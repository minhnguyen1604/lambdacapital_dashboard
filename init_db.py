import sys
import sqlite3
import math
import os
import zipfile
import xml.etree.ElementTree as ET
import re

# Reconfigure stdout/stderr to support Vietnamese characters on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

DB_PATH = 'FTMO'
EXCEL_PATH = os.path.join('data', 'FTMO_10k.xlsx')

def parse_excel_pure_python(excel_path):
    trades = []
    if not os.path.exists(excel_path):
        print(f"Không tìm thấy file Excel tại {excel_path}.")
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
                
                # Format variables to correct types
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
                    'trade_id': int(trade_id),
                    'open_time': str(open_time) if open_time else None,
                    'close_time': str(close_time) if close_time else None,
                    'type': str(order_type).upper() if order_type else 'BUY',
                    'volume': volume_val,
                    'symbol': str(symbol).upper() if symbol else '',
                    'open_price': open_price_val,
                    'close_price': close_price_val,
                    'sl': sl_val,
                    'tp': tp_val,
                    'swap': swap_val,
                    'commission': commission_val,
                    'profit': profit_val,
                    'net_profit': net_profit,
                    'pips': pips_val,
                    'rr': rr,
                    'duration': duration_val
                })
    except Exception as e:
        print(f"Lỗi đọc file Excel: {e}")
        
    return trades

def init_database():
    print("Khởi tạo cơ sở dữ liệu SQLite...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Drop table if exists to start fresh
    cursor.execute("DROP TABLE IF EXISTS FTMO_10k")
    cursor.execute("DROP TABLE IF EXISTS trades")
    
    # Create FTMO_10k table
    cursor.execute("""
        CREATE TABLE FTMO_10k (
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
    
    # 1. Parse and insert FTMO_10k Excel data
    print(f"Đọc dữ liệu từ file Excel: {EXCEL_PATH}")
    trades_data = parse_excel_pure_python(EXCEL_PATH)
    
    trades_to_insert = []
    for t in trades_data:
        trades_to_insert.append((
            'ftmo-10k', t['trade_id'], t['open_time'], t['close_time'], t['type'],
            t['volume'], t['symbol'], t['open_price'], t['close_price'], t['sl'], t['tp'],
            t['swap'], t['commission'], t['profit'], t['net_profit'], t['pips'], t['rr'], t['duration']
        ))
        
    if trades_to_insert:
        cursor.executemany("""
            INSERT INTO FTMO_10k (
                account_id, trade_id, open_time, close_time, type,
                volume, symbol, open_price, close_price, sl, tp,
                swap, commission, profit, net_profit, pips, rr, duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, trades_to_insert)
        print(f"Đã nạp {len(trades_to_insert)} giao dịch của FTMO 10k vào SQLite.")
        
    # 2. Seed mock data for other accounts so dashboard is populated
    print("Nạp dữ liệu mẫu cho các tài khoản còn lại...")
    seed_data = [
        # ftmo-100k-1
        ('ftmo-100k-1', 10001, '2026-06-02 10:00:00', '2026-06-02 15:00:00', 'BUY', 1.0, 'GBPUSD', 1.2500, 1.2620, 1.2420, 1.2650, 0.0, -10.00, 1210.00, 1200.00, 120.0, 1.5, 18000),
        ('ftmo-100k-1', 10002, '2026-06-04 09:00:00', '2026-06-04 18:00:00', 'SELL', 1.0, 'XAUUSD', 2300.0, 2305.0, 2295.0, 2280.0, 0.0, -10.00, -490.00, -500.00, -50.0, 1.0, 32400),
        ('ftmo-100k-1', 10003, '2026-06-08 14:00:00', '2026-06-08 20:00:00', 'BUY', 1.5, 'EURUSD', 1.0800, 1.0853, 1.0760, 1.0900, 0.0, -15.00, 815.00, 800.00, 53.0, 2.0, 21600),
        
        # the5ers-5k
        ('the5ers-5k', 20001, '2026-06-03 08:00:00', '2026-06-03 16:00:00', 'BUY', 0.1, 'AUDUSD', 0.6500, 0.6535, 0.6480, 0.6560, 0.0, -1.00, 351.00, 350.00, 35.0, 3.0, 28800),
        ('the5ers-5k', 20002, '2026-06-05 11:00:00', '2026-06-05 13:00:00', 'SELL', 0.2, 'USDJPY', 155.00, 155.50, 154.50, 153.50, 0.0, -2.00, -98.00, -100.00, -50.0, 1.0, 7200),
        
        # personal-1
        ('personal-1', 30001, '2026-06-02 08:30:00', '2026-06-02 12:00:00', 'BUY', 0.1, 'EURUSD', 1.0820, 1.0835, 1.0810, 1.0850, 0.0, -1.00, 151.00, 150.00, 15.0, 1.5, 12600),
        ('personal-1', 30002, '2026-06-04 13:15:00', '2026-06-04 17:30:00', 'SELL', 0.15, 'XAUUSD', 2310.0, 2305.0, 2312.5, 2300.0, 0.0, -1.50, 81.50, 80.00, 50.0, 2.0, 15300),
        
        # personal-2
        ('personal-2', 40001, '2026-06-03 14:00:00', '2026-06-03 22:00:00', 'SELL', 0.2, 'GBPUSD', 1.2650, 1.2660, 1.2640, 1.2610, 0.0, -2.00, -198.00, -200.00, -10.0, 1.0, 28800),
        ('personal-2', 40002, '2026-06-06 09:30:00', '2026-06-06 15:45:00', 'BUY', 0.3, 'EURUSD', 1.0850, 1.0865, 1.0835, 1.0895, 0.0, -3.00, 453.00, 450.00, 15.0, 2.2, 22500)
    ]
    
    cursor.executemany("""
        INSERT INTO FTMO_10k (
            account_id, trade_id, open_time, close_time, type,
            volume, symbol, open_price, close_price, sl, tp,
            swap, commission, profit, net_profit, pips, rr, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, seed_data)
    
    conn.commit()
    conn.close()
    print("Hoàn tất khởi tạo dữ liệu trong SQLite!")

if __name__ == '__main__':
    init_database()
