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

DB_FTMO = 'FTMO'
DB_THE5ERS = 'the5ers'
EXCEL_10K = os.path.join('data', 'FTMO_10k.xlsx')
EXCEL_100K = os.path.join('data', 'FTMO_100k_1.xlsx')

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
    # ----------------------------------------------------
    # 1. Initialize FTMO Database
    # ----------------------------------------------------
    print("Khởi tạo cơ sở dữ liệu SQLite: FTMO...")
    conn = sqlite3.connect(DB_FTMO)
    cursor = conn.cursor()
    
    # Recreate table FTMO_10k
    cursor.execute("DROP TABLE IF EXISTS FTMO_10k")
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
    
    # Recreate table FTMO_100k_1
    cursor.execute("DROP TABLE IF EXISTS FTMO_100k_1")
    cursor.execute("""
        CREATE TABLE FTMO_100k_1 (
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
    
    # Load and insert FTMO_10k Excel data
    print(f"Đọc dữ liệu từ file Excel: {EXCEL_10K}")
    trades_10k = parse_excel_pure_python(EXCEL_10K)
    insert_10k = []
    for t in trades_10k:
        insert_10k.append((
            'ftmo-10k', t['trade_id'], t['open_time'], t['close_time'], t['type'],
            t['volume'], t['symbol'], t['open_price'], t['close_price'], t['sl'], t['tp'],
            t['swap'], t['commission'], t['profit'], t['net_profit'], t['pips'], t['rr'], t['duration']
        ))
    if insert_10k:
        cursor.executemany("""
            INSERT INTO FTMO_10k (
                account_id, trade_id, open_time, close_time, type,
                volume, symbol, open_price, close_price, sl, tp,
                swap, commission, profit, net_profit, pips, rr, duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, insert_10k)
        print(f"Đã nạp {len(insert_10k)} giao dịch của FTMO 10k vào SQLite.")
        
    # Load and insert FTMO_100k_1 Excel data
    print(f"Đọc dữ liệu từ file Excel: {EXCEL_100K}")
    trades_100k = parse_excel_pure_python(EXCEL_100K)
    insert_100k = []
    for t in trades_100k:
        insert_100k.append((
            'ftmo-100k-1', t['trade_id'], t['open_time'], t['close_time'], t['type'],
            t['volume'], t['symbol'], t['open_price'], t['close_price'], t['sl'], t['tp'],
            t['swap'], t['commission'], t['profit'], t['net_profit'], t['pips'], t['rr'], t['duration']
        ))
    if insert_100k:
        cursor.executemany("""
            INSERT INTO FTMO_100k_1 (
                account_id, trade_id, open_time, close_time, type,
                volume, symbol, open_price, close_price, sl, tp,
                swap, commission, profit, net_profit, pips, rr, duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, insert_100k)
        print(f"Đã nạp {len(insert_100k)} giao dịch của FTMO 100k #1 vào SQLite.")
        
    # Seed mock data for personal accounts so dashboard is populated if checked
    print("Nạp dữ liệu mẫu cho các tài khoản FTMO còn lại...")
    seed_ftmo = [
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
    """, seed_ftmo)
    
    conn.commit()
    conn.close()
    print("Hoàn tất khởi tạo dữ liệu trong SQLite FTMO!")
    
    # ----------------------------------------------------
    # 2. Initialize The5ers Database
    # ----------------------------------------------------
    print("Khởi tạo cơ sở dữ liệu SQLite: the5ers...")
    conn_5 = sqlite3.connect(DB_THE5ERS)
    cursor_5 = conn_5.cursor()
    
    # Recreate table the5ers_5k
    cursor_5.execute("DROP TABLE IF EXISTS the5ers_5k")
    cursor_5.execute("""
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
    
    # Seed mock data for the5ers-5k so it has default data if user skips token update
    print("Nạp dữ liệu mẫu mặc định cho The5ers 5k...")
    seed_5ers = [
        ('the5ers-5k', 20001, '2026-06-03 08:00:00', '2026-06-03 16:00:00', 'BUY', 0.1, 'AUDUSD', 0.6500, 0.6535, 0.6480, 0.6560, 0.0, -1.00, 351.00, 350.00, 35.0, 3.0, 28800),
        ('the5ers-5k', 20002, '2026-06-05 11:00:00', '2026-06-05 13:00:00', 'SELL', 0.2, 'USDJPY', 155.00, 155.50, 154.50, 153.50, 0.0, -2.00, -98.00, -100.00, -50.0, 1.0, 7200)
    ]
    cursor_5.executemany("""
        INSERT INTO the5ers_5k (
            account_id, trade_id, open_time, close_time, type,
            volume, symbol, open_price, close_price, sl, tp,
            swap, commission, profit, net_profit, pips, rr, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, seed_5ers)
    
    conn_5.commit()
    conn_5.close()
    print("Hoàn tất khởi tạo dữ liệu trong SQLite the5ers!")

def update_database_from_excel_files():
    import glob
    print("===================================================")
    print("   [He thong] Dang quet va cap nhat database...")
    print("===================================================")
    
    # 1. Create tables if they do not exist
    conn_ftmo = sqlite3.connect(DB_FTMO)
    cursor_ftmo = conn_ftmo.cursor()
    
    cursor_ftmo.execute("""
        CREATE TABLE IF NOT EXISTS FTMO_10k (
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
    
    cursor_ftmo.execute("""
        CREATE TABLE IF NOT EXISTS FTMO_100k_1 (
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
    conn_ftmo.commit()
    conn_ftmo.close()
    
    conn_5 = sqlite3.connect(DB_THE5ERS)
    cursor_5 = conn_5.cursor()
    cursor_5.execute("""
        CREATE TABLE IF NOT EXISTS the5ers_5k (
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
    conn_5.commit()
    conn_5.close()
    
    # 2. Scan data folder for Excel files
    excel_dir = 'data'
    if not os.path.exists(excel_dir):
        os.makedirs(excel_dir, exist_ok=True)
        
    excel_files = glob.glob(os.path.join(excel_dir, "*.xlsx"))
    
    # Dictionary to collect trades in memory to deduplicate them
    # Key: (db_name, table_name, account_id, trade_id) -> trade details tuple
    trades_by_key = {}
    
    # Load existing trades from FTMO database to avoid losing old trades if user deleted excel files
    if os.path.exists(DB_FTMO):
        try:
            conn = sqlite3.connect(DB_FTMO)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='FTMO_10k'")
            if cursor.fetchone():
                cursor.execute("""
                    SELECT account_id, trade_id, open_time, close_time, type,
                           volume, symbol, open_price, close_price, sl, tp,
                           swap, commission, profit, net_profit, pips, rr, duration
                    FROM FTMO_10k
                """)
                for row in cursor.fetchall():
                    key = (DB_FTMO, 'FTMO_10k', row[0], row[1])
                    trades_by_key[key] = row
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='FTMO_100k_1'")
            if cursor.fetchone():
                cursor.execute("""
                    SELECT account_id, trade_id, open_time, close_time, type,
                           volume, symbol, open_price, close_price, sl, tp,
                           swap, commission, profit, net_profit, pips, rr, duration
                    FROM FTMO_100k_1
                """)
                for row in cursor.fetchall():
                    key = (DB_FTMO, 'FTMO_100k_1', row[0], row[1])
                    trades_by_key[key] = row
            conn.close()
        except Exception as e:
            print(f"[Canh bao] Khong the doc du lieu cu tu FTMO DB: {e}")
            
    # Load existing trades from the5ers database
    if os.path.exists(DB_THE5ERS):
        try:
            conn = sqlite3.connect(DB_THE5ERS)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='the5ers_5k'")
            if cursor.fetchone():
                cursor.execute("""
                    SELECT account_id, trade_id, open_time, close_time, type,
                           volume, symbol, open_price, close_price, sl, tp,
                           swap, commission, profit, net_profit, pips, rr, duration
                    FROM the5ers_5k
                """)
                for row in cursor.fetchall():
                    key = (DB_THE5ERS, 'the5ers_5k', row[0], row[1])
                    trades_by_key[key] = row
            conn.close()
        except Exception as e:
            print(f"[Canh bao] Khong the doc du lieu cu tu the5ers DB: {e}")

    # Process new/existing Excel files and overwrite trades (to apply updates)
    for file_path in excel_files:
        filename = os.path.basename(file_path).lower()
        
        # Mapping filename to database and table
        is_challenge = 'challenge' in filename
        target_account_ids = []
        if '10k' in filename:
            db_name = DB_FTMO
            table_name = 'FTMO_10k'
            if is_challenge:
                target_account_ids = ['challenge-ftmo-10k']
            else:
                target_account_ids = ['challenge-ftmo-10k', 'ftmo-10k']
        elif '100k' in filename:
            db_name = DB_FTMO
            table_name = 'FTMO_100k_1'
            if is_challenge:
                target_account_ids = ['challenge-ftmo-100k-1']
            else:
                target_account_ids = ['challenge-ftmo-100k-1', 'ftmo-100k-1']
        elif 'the5ers' in filename or '5ers' in filename:
            db_name = DB_THE5ERS
            table_name = 'the5ers_5k'
            if is_challenge:
                target_account_ids = ['challenge-the5ers-5k']
            else:
                target_account_ids = ['challenge-the5ers-5k', 'the5ers-5k']
        else:
            print(f"[Bo qua] File '{os.path.basename(file_path)}' khong khop voi tai khoan nao.")
            continue
            
        print(f"[Doc file] {os.path.basename(file_path)} -> Account(s): {', '.join(target_account_ids)}")
        file_trades = parse_excel_pure_python(file_path)
        print(f"   -> Tim thay {len(file_trades)} giao dich.")
        
        for acc_id in target_account_ids:
            for t in file_trades:
                key = (db_name, table_name, acc_id, t['trade_id'])
                trades_by_key[key] = (
                    acc_id, t['trade_id'], t['open_time'], t['close_time'], t['type'],
                    t['volume'], t['symbol'], t['open_price'], t['close_price'], t['sl'], t['tp'],
                    t['swap'], t['commission'], t['profit'], t['net_profit'], t['pips'], t['rr'], t['duration']
                )

    # Re-group all trades
    trades_by_table = {}
    for key, val in trades_by_key.items():
        db_name, table_name, _, _ = key
        table_key = (db_name, table_name)
        if table_key not in trades_by_table:
            trades_by_table[table_key] = []
        trades_by_table[table_key].append(val)
        
    # Write to databases
    for (db_name, table_name), rows in trades_by_table.items():
        try:
            conn = sqlite3.connect(db_name)
            cursor = conn.cursor()
            cursor.execute(f"DELETE FROM {table_name}")
            cursor.executemany(f"""
                INSERT INTO {table_name} (
                    account_id, trade_id, open_time, close_time, type,
                    volume, symbol, open_price, close_price, sl, tp,
                    swap, commission, profit, net_profit, pips, rr, duration
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, rows)
            conn.commit()
            conn.close()
            print(f"[Ghi DB] Da cap nhat {len(rows)} giao dich vao database '{db_name}' bang '{table_name}'.")
        except Exception as e:
            print(f"[Loi] Khong the ghi du lieu vao database '{db_name}' bang '{table_name}': {e}")
            
    # Ensure personal accounts mock data exists in FTMO_10k
    try:
        conn = sqlite3.connect(DB_FTMO)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM FTMO_10k WHERE account_id LIKE 'personal-%'")
        if cursor.fetchone()[0] == 0:
            print("[Seed] Dang nap du lieu mau cho personal-1 va personal-2...")
            seed_ftmo = [
                ('personal-1', 30001, '2026-06-02 08:30:00', '2026-06-02 12:00:00', 'BUY', 0.1, 'EURUSD', 1.0820, 1.0835, 1.0810, 1.0850, 0.0, -1.00, 151.00, 150.00, 15.0, 1.5, 12600),
                ('personal-1', 30002, '2026-06-04 13:15:00', '2026-06-04 17:30:00', 'SELL', 0.15, 'XAUUSD', 2310.0, 2305.0, 2312.5, 2300.0, 0.0, -1.50, 81.50, 80.00, 50.0, 2.0, 15300),
                ('personal-2', 40001, '2026-06-03 14:00:00', '2026-06-03 22:00:00', 'SELL', 0.2, 'GBPUSD', 1.2650, 1.2660, 1.2640, 1.2610, 0.0, -2.00, -198.00, -200.00, -10.0, 1.0, 28800),
                ('personal-2', 40002, '2026-06-06 09:30:00', '2026-06-06 15:45:00', 'BUY', 0.3, 'EURUSD', 1.0850, 1.0865, 1.0835, 1.0895, 0.0, -3.00, 453.00, 450.00, 15.0, 2.2, 22500)
            ]
            cursor.executemany("""
                INSERT INTO FTMO_10k (
                    account_id, trade_id, open_time, close_time, type,
                    volume, symbol, open_price, close_price, sl, tp,
                    swap, commission, profit, net_profit, pips, rr, duration
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, seed_ftmo)
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Canh bao] Khong the seed du lieu personal: {e}")
        
    # Ensure default mock data for the5ers if table is empty
    try:
        conn = sqlite3.connect(DB_THE5ERS)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM the5ers_5k")
        if cursor.fetchone()[0] == 0:
            print("[Seed] Dang nap du lieu mau mac dinh cho the5ers-5k...")
            seed_5ers = [
                ('the5ers-5k', 20001, '2026-06-03 08:00:00', '2026-06-03 16:00:00', 'BUY', 0.1, 'AUDUSD', 0.6500, 0.6535, 0.6480, 0.6560, 0.0, -1.00, 351.00, 350.00, 35.0, 3.0, 28800),
                ('the5ers-5k', 20002, '2026-06-05 11:00:00', '2026-06-05 13:00:00', 'SELL', 0.2, 'USDJPY', 155.00, 155.50, 154.50, 153.50, 0.0, -2.00, -98.00, -100.00, -50.0, 1.0, 7200)
            ]
            cursor.executemany("""
                INSERT INTO the5ers_5k (
                    account_id, trade_id, open_time, close_time, type,
                    volume, symbol, open_price, close_price, sl, tp,
                    swap, commission, profit, net_profit, pips, rr, duration
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, seed_5ers)
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Canh bao] Khong the seed du lieu the5ers: {e}")
        
    print("===================================================")
    print("   [He thong] Da hoan tat cap nhat du lieu!")
    print("===================================================")

if __name__ == '__main__':
    update_database_from_excel_files()

