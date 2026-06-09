import http.server
import socketserver
import urllib.parse
import json
import sqlite3
import os
import sys
import zipfile
import xml.etree.ElementTree as ET
import re

# Reconfigure stdout/stderr to support Vietnamese characters on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = 3000
DB_PATH = 'FTMO'
EXCEL_PATH = os.path.join('data', 'FTMO_10k.xlsx')

# Fallback mock data for accounts other than ftmo-10k
MOCK_TRADES = {
    'ftmo-100k-1': [
        {'id': 10001, 'date': '2026-06-02', 'symbol': 'GBPUSD', 'direction': 'BUY', 'amount': 1200.0, 'rr': 1.5, 'duration': 18000},
        {'id': 10002, 'date': '2026-06-04', 'symbol': 'XAUUSD', 'direction': 'SELL', 'amount': -500.0, 'rr': 1.0, 'duration': 32400},
        {'id': 10003, 'date': '2026-06-08', 'symbol': 'EURUSD', 'direction': 'BUY', 'amount': 800.0, 'rr': 2.0, 'duration': 21600}
    ],
    'the5ers-5k': [
        {'id': 20001, 'date': '2026-06-03', 'symbol': 'AUDUSD', 'direction': 'BUY', 'amount': 350.0, 'rr': 3.0, 'duration': 28800},
        {'id': 20002, 'date': '2026-06-05', 'symbol': 'USDJPY', 'direction': 'SELL', 'amount': -100.0, 'rr': 1.0, 'duration': 7200}
    ],
    'personal-1': [
        {'id': 30001, 'date': '2026-06-02', 'symbol': 'EURUSD', 'direction': 'BUY', 'amount': 150.0, 'rr': 1.5, 'duration': 12600},
        {'id': 30002, 'date': '2026-06-04', 'symbol': 'XAUUSD', 'direction': 'SELL', 'amount': 80.0, 'rr': 2.0, 'duration': 15300}
    ],
    'personal-2': [
        {'id': 40001, 'date': '2026-06-03', 'symbol': 'GBPUSD', 'direction': 'SELL', 'amount': -200.0, 'rr': 1.0, 'duration': 28800},
        {'id': 40002, 'date': '2026-06-06', 'symbol': 'EURUSD', 'direction': 'BUY', 'amount': 450.0, 'rr': 2.2, 'duration': 22500}
    ]
}

def parse_excel_pure_python(excel_path):
    trades = []
    if not os.path.exists(excel_path):
        return trades
        
    try:
        with zipfile.ZipFile(excel_path, 'r') as z:
            # Load shared strings
            shared_strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                ss_xml = z.read('xl/sharedStrings.xml')
                root_ss = ET.fromstring(ss_xml)
                ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                for si in root_ss.findall('ns:si', ns):
                    t_nodes = si.findall('.//ns:t', ns)
                    if t_nodes:
                        text_val = "".join([t.text for t in t_nodes if t.text])
                        shared_strings.append(text_val)
                    else:
                        shared_strings.append('')
            
            # Load sheet1
            sheet_xml = z.read('xl/worksheets/sheet1.xml')
            root_sheet = ET.fromstring(sheet_xml)
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            
            rows_data = []
            for row in root_sheet.findall('.//ns:row', ns):
                row_idx = int(row.get('r'))
                row_cells = {}
                for c in row.findall('ns:c', ns):
                    r_ref = c.get('r')
                    col_letter = re.sub(r'\d+', '', r_ref)
                    val_type = c.get('t')
                    v = c.find('ns:v', ns)
                    val = v.text if v is not None else None
                    
                    if val is not None:
                        if val_type == 's':
                            val = shared_strings[int(val)]
                        else:
                            try:
                                if '.' in val:
                                    val = float(val)
                                else:
                                    val = int(val)
                            except ValueError:
                                pass
                    row_cells[col_letter] = val
                rows_data.append((row_idx, row_cells))
            
            rows_data.sort(key=lambda x: x[0])
            
            if not rows_data:
                return trades
                
            headers_row = rows_data[0][1]
            headers_map = {}
            for col, val in headers_row.items():
                headers_map[val] = col
                
            for idx, r_data in rows_data[1:]:
                row = r_data
                
                def get_val(header_name):
                    col = headers_map.get(header_name)
                    return row.get(col) if col else None
                
                trade_id = get_val('Mã số giao dịch')
                if not trade_id:
                    continue
                    
                open_time = get_val('Mở')
                close_time = get_val('Đóng')
                order_type = get_val('Lệnh')
                volume = get_val('Khối lượng')
                symbol = get_val('Mã')
                open_price = get_val('Giá mở lệnh')
                close_price = get_val('Giá đóng lệnh')
                sl = get_val('Cắt Lỗ')
                tp = get_val('Chốt Lời')
                swap = get_val('Phí qua đêm') or 0.0
                commission = get_val('Tiền hoa hồng') or 0.0
                profit = get_val('Lợi nhuận') or 0.0
                pips = get_val('Píp')
                duration = get_val('Thời lượng giao dịch tính bằng giây')
                
                # Format to correct types
                volume_val = float(volume) if volume is not None else 0.0
                open_price_val = float(open_price) if open_price is not None else 0.0
                close_price_val = float(close_price) if close_price is not None else 0.0
                sl_val = float(sl) if sl is not None else None
                tp_val = float(tp) if tp is not None else None
                swap_val = float(swap) if swap is not None else 0.0
                commission_val = float(commission) if commission is not None else 0.0
                profit_val = float(profit) if profit is not None else 0.0
                pips_val = float(pips) if pips is not None else 0.0
                duration_val = int(duration) if duration is not None else 0
                
                net_profit = round(profit_val + commission_val + swap_val, 2)
                
                # Calculate R:R
                rr = 2.0
                if sl_val and open_price_val and abs(open_price_val - sl_val) > 0:
                    risk = abs(open_price_val - sl_val)
                    reward = abs(tp_val - open_price_val) if tp_val else abs(close_price_val - open_price_val)
                    calculated_rr = reward / risk
                    rr = round(min(max(calculated_rr, 0.5), 5.0), 1)
                
                trades.append({
                    'id': int(trade_id),
                    'date': str(close_time or open_time).split(' ')[0] if (close_time or open_time) else None,
                    'symbol': str(symbol).upper() if symbol else '',
                    'direction': str(order_type).upper() if order_type else 'BUY',
                    'amount': net_profit,
                    'rr': rr,
                    'duration': duration_val
                })
    except Exception as e:
        print(f"Error parsing Excel fallback: {e}")
        
    return trades

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Mute logging to keep stdout cleaner
        pass

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # API Endpoint: GET /api/trades?account=<account_id>
        if parsed_url.path == '/api/trades':
            self.handle_api_trades(parsed_url)
            return
            
        # Default behavior: Serve static files
        super().do_GET()

    def handle_api_trades(self, parsed_url):
        query_params = urllib.parse.parse_qs(parsed_url.query)
        account_id = query_params.get('account', ['ftmo-10k'])[0]
        
        trades = []
        db_success = False
        
        # 1. Try to read from SQLite DB (FTMO_10k table)
        try:
            if os.path.exists(DB_PATH):
                conn = sqlite3.connect(DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Fetch trades for the requested account from SQLite including duration
                cursor.execute("""
                    SELECT id, trade_id, open_time, close_time, type, 
                           symbol, net_profit, rr, duration 
                    FROM FTMO_10k 
                    WHERE account_id = ?
                    ORDER BY date(close_time) ASC, close_time ASC
                """, (account_id,))
                
                rows = cursor.fetchall()
                for row in rows:
                    close_time = row['close_time']
                    open_time = row['open_time']
                    trade_date = None
                    
                    if close_time:
                        trade_date = close_time.split(' ')[0]
                    elif open_time:
                        trade_date = open_time.split(' ')[0]
                        
                    trades.append({
                        'id': row['trade_id'] or row['id'],
                        'date': trade_date,
                        'symbol': row['symbol'],
                        'direction': row['type'].upper() if row['type'] else 'BUY',
                        'amount': row['net_profit'] or 0.0,
                        'rr': row['rr'] or 2.0,
                        'duration': row['duration'] or 0
                    })
                    
                conn.close()
                db_success = True
        except Exception as e:
            print(f"Error querying SQLite database, falling back to Excel: {e}")
            db_success = False

        # 2. Fallback if SQLite fails or database file is missing
        if not db_success:
            print(f"DATABASE FALLBACK ACTIVE: Loading data for '{account_id}'...")
            if account_id == 'ftmo-10k':
                # Parse Excel on-the-fly
                trades = parse_excel_pure_python(EXCEL_PATH)
            else:
                # Return seed mock data for other accounts
                trades = MOCK_TRADES.get(account_id, [])

        # Return trades as JSON
        response_data = json.dumps(trades).encode('utf-8')
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', len(response_data))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response_data)

def run_server():
    # Make sure we serve from the project root directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Enable address reuse to avoid port in use errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server is running at: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
