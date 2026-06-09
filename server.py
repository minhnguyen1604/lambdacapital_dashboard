import http.server
import socketserver
import urllib.parse
import json
import sqlite3
import os
import sys

# Reconfigure stdout/stderr to support Vietnamese characters on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = 3000
DB_PATH = 'FTMO'

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
        try:
            if os.path.exists(DB_PATH):
                conn = sqlite3.connect(DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Fetch trades for the requested account from SQLite including duration
                cursor.execute("""
                    SELECT id, trade_id, open_time, close_time, type, 
                           symbol, net_profit, rr, duration 
                    FROM trades 
                    WHERE account_id = ?
                    ORDER BY date(close_time) ASC, close_time ASC
                """, (account_id,))
                
                rows = cursor.fetchall()
                for row in rows:
                    # Parse YYYY-MM-DD date from close_time or open_time
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
        except Exception as e:
            print(f"Error querying database: {e}")
            self.send_error(500, f"Database error: {e}")
            return

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
