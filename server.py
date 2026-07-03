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
from datetime import datetime

# Reconfigure stdout/stderr to support Vietnamese characters on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = 3000
DB_PATH = 'FTMO'
EXCEL_PATH = os.path.join('data', 'FTMO_10k.xlsx')
EXCEL_100K = os.path.join('data', 'FTMO_100k_1.xlsx')
DB_THE5ERS = 'the5ers'

# Fallback mock data for accounts other than ftmo-10k and ftmo-100k-1
MOCK_TRADES = {
    'ftmo-100k-2': [],
    'ftmo-100k-3': [],
    'ftmo-100k-4': [],
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

def format_date_str(iso_str):
    if not iso_str:
        return None
    try:
        clean_str = iso_str.replace('T', ' ').replace('Z', '')
        if '.' in clean_str:
            clean_str = clean_str.split('.')[0]
        return clean_str
    except Exception:
        return iso_str

def parse_the5ers_trades(json_data):
    items = []
    if isinstance(json_data, list):
        items = json_data
    elif isinstance(json_data, dict):
        data_content = json_data.get('data')
        if isinstance(data_content, dict):
            for k in ['results', 'positions', 'items', 'rows', 'history']:
                if k in data_content and isinstance(data_content[k], list):
                    items = data_content[k]
                    break
            if not items:
                for val in data_content.values():
                    if isinstance(val, list):
                        items = val
                        break
        if not items:
            for key in ['positions', 'results', 'items', 'rows', 'history', 'data']:
                if key in json_data:
                    if isinstance(json_data[key], list):
                        items = json_data[key]
                        break
        if not items:
            for val in json_data.values():
                if isinstance(val, list):
                    items = val
                    break
                    
    trades = []
    for item in items:
        if not isinstance(item, dict):
            continue
            
        trade_id = item.get('id') or item.get('externalId') or item.get('_id')
        if not trade_id:
            continue
            
        symbol = item.get('symbol') or ''
        direction = item.get('side') or item.get('direction') or 'BUY'
        direction_str = str(direction).upper()
        if 'SELL' in direction_str or 'SHORT' in direction_str:
            direction_str = 'SELL'
        else:
            direction_str = 'BUY'
            
        open_time_raw = item.get('openDate') or item.get('createdAt')
        close_time_raw = item.get('closeDate') or item.get('updatedAt')
        
        open_time = format_date_str(open_time_raw)
        close_time = format_date_str(close_time_raw)
        
        trade_date = None
        time_for_date = close_time or open_time
        if time_for_date:
            trade_date = time_for_date.split(' ')[0]
            
        profit = item.get('profitAndLoss') or item.get('profit') or 0.0
        swap = item.get('swap') or 0.0
        fee = item.get('fee') or item.get('commission') or 0.0
        
        try:
            profit_val = float(profit)
            swap_val = float(swap)
            fee_val = float(fee)
        except ValueError:
            profit_val = 0.0
            swap_val = 0.0
            fee_val = 0.0
            
        net_profit = round(profit_val, 2)
        
        open_price = item.get('entry') or item.get('openPrice') or 0.0
        close_price = item.get('exit') or item.get('closePrice') or 0.0
        sl = item.get('sl') or item.get('stopLoss')
        tp = item.get('tp') or item.get('takeProfit')
        volume = item.get('quantity') or item.get('volume') or 0.1
        pips = item.get('pips') or 0.0
        
        try:
            sl_val = float(sl) if sl is not None else None
            tp_val = float(tp) if tp is not None else None
            open_price_val = float(open_price)
            close_price_val = float(close_price)
        except ValueError:
            sl_val = None
            tp_val = None
            open_price_val = 0.0
            close_price_val = 0.0
            
        # Parse duration
        duration = 0
        if open_time and close_time:
            try:
                o_dt = datetime.strptime(open_time, "%Y-%m-%d %H:%M:%S")
                c_dt = datetime.strptime(close_time, "%Y-%m-%d %H:%M:%S")
                duration = int((c_dt - o_dt).total_seconds())
            except Exception:
                try:
                    metrics = item.get('tradeScore', {}).get('metrics', {})
                    duration = int(metrics.get('durationMinutes', 0)) * 60
                except Exception:
                    duration = 0
                    
        rr = 2.0
        if sl_val and open_price_val and abs(open_price_val - sl_val) > 0:
            risk = abs(open_price_val - sl_val)
            reward = abs(tp_val - open_price_val) if tp_val else abs(close_price_val - open_price_val)
            calculated_rr = reward / risk
            rr = round(min(max(calculated_rr, 0.5), 5.0), 1)
            
        trades.append({
            'id': int(trade_id) if str(trade_id).isdigit() else trade_id,
            'date': trade_date,
            'symbol': str(symbol).upper(),
            'direction': direction_str,
            'amount': net_profit,
            'rr': rr,
            'duration': duration,
            'open_time': open_time,
            'close_time': close_time,
            'volume': float(volume) if volume else 0.1,
            'open_price': open_price_val,
            'close_price': close_price_val,
            'sl': sl_val,
            'tp': tp_val,
            'swap': swap_val,
            'commission': fee_val,
            'profit': profit_val,
            'pips': float(pips) if pips else 0.0
        })
        
    return trades

def save_to_excel_openpyxl(trades, excel_path):
    try:
        import openpyxl
        from openpyxl import Workbook
    except ImportError:
        print("Installing openpyxl dependency...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
        import openpyxl
        from openpyxl import Workbook
        
    wb = Workbook()
    ws = wb.active
    ws.title = "Trades"
    
    headers = [
        'Mã số giao dịch', 'Mở', 'Lệnh', 'Khối lượng', 'Mã', 
        'Giá mở lệnh', 'Cắt Lỗ', 'Chốt Lời', 'Đóng', 'Giá đóng lệnh', 
        'Phí qua đêm', 'Tiền hoa hồng', 'Lợi nhuận', 'Píp', 'Thời lượng giao dịch tính bằng giây'
    ]
    ws.append(headers)
    
    for t in trades:
        ws.append([
            t.get('id'),
            t.get('open_time') or t.get('date'),
            t.get('direction'),
            t.get('volume'),
            t.get('symbol'),
            t.get('open_price'),
            t.get('sl'),
            t.get('tp'),
            t.get('close_time') or t.get('date'),
            t.get('close_price'),
            t.get('swap'),
            t.get('commission'),
            t.get('profit'),
            t.get('pips'),
            t.get('duration')
        ])
        
    wb.save(excel_path)
    print(f"Saved {len(trades)} trades to Excel: {excel_path}")

def save_to_the5ers_db(trades):
    try:
        conn = sqlite3.connect(DB_THE5ERS)
        cursor = conn.cursor()
        
        cursor.execute("DROP TABLE IF EXISTS the5ers_5k")
        cursor.execute("""
            CREATE TABLE the5ers_5k (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_id TEXT NOT NULL,
                trade_id INTEGER,
                open_time TEXT,
                close_time TEXT,
                type TEXT,
                volume REAL,
                symbol TEXT,
                open_price REAL,
                close_price REAL,
                sl REAL,
                tp REAL,
                swap REAL,
                commission REAL,
                profit REAL,
                net_profit REAL,
                pips REAL,
                rr REAL,
                duration INTEGER
            )
        """)
        
        insert_data = []
        for t in trades:
            insert_data.append((
                'the5ers-5k', t['id'], t['open_time'], t['close_time'], t['direction'],
                t['volume'], t['symbol'], t['open_price'], t['close_price'], t['sl'], t['tp'],
                t['swap'], t['commission'], t['profit'], t['amount'], t['pips'], t['rr'], t['duration']
            ))
            
        if insert_data:
            cursor.executemany("""
                INSERT INTO the5ers_5k (
                    account_id, trade_id, open_time, close_time, type,
                    volume, symbol, open_price, close_price, sl, tp,
                    swap, commission, profit, net_profit, pips, rr, duration
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, insert_data)
            
        conn.commit()
        conn.close()
        print(f"Saved {len(trades)} trades to SQLite the5ers database.")
    except Exception as e:
        print(f"Error saving to the5ers database: {e}")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Mute logging to keep stdout cleaner
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # API Endpoint: GET /api/trades?account=<account_id>
        if parsed_url.path == '/api/trades':
            self.handle_api_trades(parsed_url)
            return
            
        super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # API Endpoint: POST /api/the5ers/update-token
        if parsed_url.path == '/api/the5ers/update-token':
            self.handle_the5ers_update_token()
            return
            
        self.send_error(404, "Not Found")

    def handle_api_trades(self, parsed_url):
        query_params = urllib.parse.parse_qs(parsed_url.query)
        account_id = query_params.get('account', ['ftmo-10k'])[0]
        
        trades = []
        db_success = False
        
        db_file = DB_PATH
        table_name = 'FTMO_10k'
        
        if account_id == 'ftmo-10k':
            db_file = DB_PATH
            table_name = 'FTMO_10k'
        elif account_id == 'ftmo-100k-1':
            db_file = DB_PATH
            table_name = 'FTMO_100k_1'
        elif account_id == 'the5ers-5k':
            db_file = DB_THE5ERS
            table_name = 'the5ers_5k'
            
        try:
            if os.path.exists(db_file):
                conn = sqlite3.connect(db_file)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute(f"""
                    SELECT id, trade_id, open_time, close_time, type, 
                           symbol, net_profit, rr, duration 
                    FROM {table_name} 
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
            print(f"Error querying SQLite database '{db_file}' table '{table_name}': {e}")
            db_success = False

        if not db_success:
            print(f"DATABASE FALLBACK ACTIVE: Loading data for '{account_id}'...")
            if account_id == 'ftmo-10k':
                trades = parse_excel_pure_python(EXCEL_PATH)
            elif account_id == 'ftmo-100k-1':
                trades = parse_excel_pure_python(EXCEL_100K)
            elif account_id == 'the5ers-5k':
                trades = parse_excel_pure_python(os.path.join('data', 'the5ers_5k.xlsx'))
                if not trades:
                    trades = MOCK_TRADES.get(account_id, [])
            else:
                trades = MOCK_TRADES.get(account_id, [])

        response_data = json.dumps(trades).encode('utf-8')
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', len(response_data))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response_data)

    def handle_the5ers_update_token(self):
        import urllib.request
        import urllib.error
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode('utf-8'))
            token = payload.get('token')
            
            if not token:
                raise ValueError("Token is required")
                
            # Default account ID from user's Hub request URL
            account_id = '25739927'
            
            trades = []
            crawled_ids = set()
            page = 1
            max_pages = 100
            
            print(f"Crawl position requests starting for The5ers account {account_id}...")
            
            while page <= max_pages:
                url = f"https://api.the5ers.com/position/all/{account_id}?page={page}&limit=100"
                print(f"   -> Crawling page {page}...")
                
                req = urllib.request.Request(url)
                req.add_header('Authorization', f"Bearer {token}")
                req.add_header('x-brand', '5ers')
                req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
                req.add_header('Accept', 'application/json')
                
                try:
                    with urllib.request.urlopen(req) as response:
                        res_data = response.read().decode('utf-8')
                        json_response = json.loads(res_data)
                        
                        page_trades = parse_the5ers_trades(json_response)
                        if not page_trades:
                            print(f"      No trades returned on page {page}. Stopping crawl.")
                            break
                            
                        # Add new trades and prevent duplicates
                        new_trades_count = 0
                        for t in page_trades:
                            t_id = t['id']
                            if t_id not in crawled_ids:
                                crawled_ids.add(t_id)
                                trades.append(t)
                                new_trades_count += 1
                                
                        print(f"      Page {page} returned {len(page_trades)} trades ({new_trades_count} new). Total so far: {len(trades)}")
                        
                        # If page returned no new trades, we can stop
                        if new_trades_count == 0:
                            print("      All trades on this page were already processed. Stopping crawl.")
                            break
                except urllib.error.HTTPError as e:
                    # If we get a 404 or other errors on subsequent pages, stop crawling gracefully
                    print(f"      HTTP Error on page {page}: {e.code} - {e.reason}. Stopping crawl.")
                    if page == 1:
                        # If the very first page failed, raise the error to return to client
                        raise e
                    break
                except Exception as e:
                    print(f"      Error on page {page}: {e}. Stopping crawl.")
                    if page == 1:
                        raise e
                    break
                    
                page += 1
                
            if trades:
                # Create data directory if not exists
                os.makedirs('data', exist_ok=True)
                
                # 1. Save to data/the5ers_5k.xlsx
                save_to_excel_openpyxl(trades, os.path.join('data', 'the5ers_5k.xlsx'))
                
                # 2. Save to isolated SQLite DB 'the5ers' table 'the5ers_5k'
                save_to_the5ers_db(trades)
            
            # Format response for frontend
            formatted = []
            for t in trades:
                formatted.append({
                    'id': t['id'],
                    'date': t['date'],
                    'symbol': t['symbol'],
                    'direction': t['direction'],
                    'amount': t['amount'],
                    'rr': t['rr'],
                    'duration': t['duration']
                })
                
            response_bytes = json.dumps(formatted).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', len(response_bytes))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response_bytes)
            print(f"Crawl completed successfully: {len(trades)} trades processed across {page-1} pages.")
                
        except urllib.error.HTTPError as e:
            print(f"HTTP Error calling The5ers API: {e.code} - {e.reason}")
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"API Error: {e.reason}"}).encode('utf-8'))
        except Exception as e:
            print(f"Error crawling The5ers: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

def run_server():
    # Tu dong quet va cap nhat du lieu tu file Excel vao database khi khoi dong
    try:
        import init_db
        init_db.update_database_from_excel_files()
    except Exception as e:
        print(f"[LOI] Khong the tu dong cap nhat database tu Excel: {e}")

    os.chdir(os.path.dirname(os.path.abspath(__file__)))
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
