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
        elif parsed_url.path == '/api/stock/tickers':
            self.handle_api_stock_tickers(parsed_url)
            return
        elif parsed_url.path == '/api/stock/backtest':
            self.handle_api_stock_backtest(parsed_url)
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

    def handle_api_stock_tickers(self, parsed_url):
        db_path = 'd:/quant_trading/data_prices.db'
        tickers = []
        try:
            if os.path.exists(db_path):
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT Ticker, Sector, Industry 
                    FROM daily_prices 
                    GROUP BY Ticker 
                    ORDER BY Ticker ASC
                """)
                rows = cursor.fetchall()
                for row in rows:
                    ticker_name = row[0]
                    symbol = ticker_name.replace('.VN', '') if ticker_name else ''
                    tickers.append({
                        'symbol': symbol,
                        'fullname': ticker_name,
                        'sector': row[1] or 'Unknown',
                        'industry': row[2] or 'Unknown'
                    })
                conn.close()
        except Exception as e:
            print(f"Error querying tickers database: {e}")
            self.send_error(500, f"Database error: {e}")
            return

        response_data = json.dumps(tickers).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', len(response_data))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response_data)

    def handle_api_stock_backtest(self, parsed_url):
        query_params = urllib.parse.parse_qs(parsed_url.query)
        ticker = query_params.get('ticker', ['HAH'])[0].strip().upper()
        timeframe = query_params.get('timeframe', ['D'])[0].strip().upper()
        start_date = query_params.get('start', ['2024-01-01'])[0].strip()
        end_date = query_params.get('end', ['2026-06-09'])[0].strip()
        initial_balance = float(query_params.get('initial_balance', [100000000.0])[0])
        commission = float(query_params.get('commission', [0.1])[0])

        commission_mult = commission / 100.0

        try:
            import pandas as pd
            import numpy as np
            from backtesting import Backtest, Strategy
            from backtesting.lib import crossover

            def calculate_ema(values, period):
                return pd.Series(values).ewm(span=period, adjust=False).mean().values

            def calculate_wma(values, period):
                values_series = pd.Series(values)
                weights = np.arange(1, period + 1)
                return values_series.rolling(period).apply(lambda p: np.dot(p, weights) / weights.sum(), raw=True).values

            class EmaWmaCrossover(Strategy):
                ema_period = 9
                wma_period = 45

                def init(self):
                    self.ema = self.I(calculate_ema, self.data.Close, self.ema_period)
                    self.wma = self.I(calculate_wma, self.data.Close, self.wma_period)

                def next(self):
                    if crossover(self.ema, self.wma):
                        self.buy()
                    elif crossover(self.wma, self.ema):
                        self.position.close()

            db_path = 'd:/quant_trading/data_prices.db'
            table_name = 'daily_prices' if timeframe == 'D' else 'weekly_prices'
            
            ticker_query = ticker if ticker.endswith('.VN') else f"{ticker}.VN"
            
            if not os.path.exists(db_path):
                self.send_error(404, "Prices database not found")
                return

            conn = sqlite3.connect(db_path)
            df = pd.read_sql_query(
                f"SELECT Date, Open, High, Low, Close, Volume FROM {table_name} "
                f"WHERE Ticker = ? AND Date >= ? AND Date <= ? ORDER BY Date ASC",
                conn, params=(ticker_query, start_date, end_date)
            )
            conn.close()

            if df.empty or len(df) < 45:
                response_data = json.dumps({'error': 'No data found or insufficient data (need >= 45 periods)'}).encode('utf-8')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', len(response_data))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response_data)
                return

            prices_list = []
            for _, row in df.iterrows():
                prices_list.append({
                    'date': row['Date'],
                    'o': float(row['Open']),
                    'h': float(row['High']),
                    'l': float(row['Low']),
                    'c': float(row['Close']),
                    'v': float(row['Volume'])
                })

            df['Date'] = pd.to_datetime(df['Date'])
            df.set_index('Date', inplace=True)
            df.sort_index(inplace=True)
            
            df = df[['Open', 'High', 'Low', 'Close', 'Volume']]
            for col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            df.dropna(inplace=True)

            if len(df) < 45:
                response_data = json.dumps({'error': 'Insufficient valid data rows after clean'}).encode('utf-8')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', len(response_data))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response_data)
                return

            bt = Backtest(df, EmaWmaCrossover, cash=initial_balance, commission=commission_mult)
            stats = bt.run()

            def clean_val(val):
                if pd.isna(val) or val == np.inf or val == -np.inf:
                    return None
                if hasattr(val, 'item'):
                    return val.item()
                return val

            metrics = {
                'Start_Date': stats['Start'].strftime('%Y-%m-%d') if pd.notna(stats['Start']) else None,
                'End_Date': stats['End'].strftime('%Y-%m-%d') if pd.notna(stats['End']) else None,
                'Duration_Days': clean_val(stats['Duration'].days) if pd.notna(stats['Duration']) else None,
                'Exposure_Time_Pct': clean_val(stats['Exposure Time [%]']),
                'Equity_Final': clean_val(stats['Equity Final [$]']),
                'Equity_Peak': clean_val(stats['Equity Peak [$]']),
                'Return_Pct': clean_val(stats['Return [%]']),
                'Buy_Hold_Return_Pct': clean_val(stats['Buy & Hold Return [%]']),
                'Return_Ann_Pct': clean_val(stats['Return (Ann.) [%]']),
                'Volatility_Ann_Pct': clean_val(stats['Volatility (Ann.) [%]']),
                'Sharpe_Ratio': clean_val(stats['Sharpe Ratio']),
                'Sortino_Ratio': clean_val(stats['Sortino Ratio']),
                'Calmar_Ratio': clean_val(stats['Calmar Ratio']),
                'Max_Drawdown_Pct': clean_val(stats['Max. Drawdown [%]']),
                'Avg_Drawdown_Pct': clean_val(stats['Avg. Drawdown [%]']),
                'Max_Drawdown_Duration_Days': clean_val(stats['Max. Drawdown Duration'].days) if pd.notna(stats['Max. Drawdown Duration']) else None,
                'Avg_Drawdown_Duration_Days': clean_val(stats['Avg. Drawdown Duration'].days) if pd.notna(stats['Avg. Drawdown Duration']) else None,
                'Num_Trades': int(stats['# Trades']) if pd.notna(stats['# Trades']) else 0,
                'Win_Rate_Pct': clean_val(stats['Win Rate [%]']),
                'Best_Trade_Pct': clean_val(stats['Best Trade [%]']),
                'Worst_Trade_Pct': clean_val(stats['Worst Trade [%]']),
                'Avg_Trade_Pct': clean_val(stats['Avg. Trade [%]']),
                'Max_Trade_Duration_Days': clean_val(stats['Max. Trade Duration'].days) if pd.notna(stats['Max. Trade Duration']) else None,
                'Avg_Trade_Duration_Days': clean_val(stats['Avg. Trade Duration'].days) if pd.notna(stats['Avg. Trade Duration']) else None,
                'Profit_Factor': clean_val(stats['Profit Factor']),
                'Expectancy_Pct': clean_val(stats['Expectancy [%]']),
                'SQN': clean_val(stats['SQN'])
            }

            trades_list = []
            trades_df = stats['_trades']
            for _, row in trades_df.iterrows():
                trades_list.append({
                    'entry_time': row['EntryTime'].strftime('%Y-%m-%d'),
                    'exit_time': row['ExitTime'].strftime('%Y-%m-%d'),
                    'entry_price': clean_val(row['EntryPrice']),
                    'exit_price': clean_val(row['ExitPrice']),
                    'pnl': clean_val(row['PnL']),
                    'return_pct': clean_val(row['ReturnPct'] * 100)
                })

            result_json = {
                'prices': prices_list,
                'metrics': metrics,
                'trades': trades_list
            }

            response_data = json.dumps(result_json).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', len(response_data))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response_data)

        except Exception as e:
            print(f"Error executing backtest: {e}")
            self.send_error(500, f"Backtest execution error: {e}")

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
