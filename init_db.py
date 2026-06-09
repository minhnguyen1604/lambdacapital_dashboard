import sys
import sqlite3
import pandas as pd
import math
import os

# Reconfigure stdout/stderr to support Vietnamese characters on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

DB_PATH = 'FTMO'
EXCEL_PATH = os.path.join('data', 'FTMO_10k.xlsx')

def init_database():
    print("Khởi tạo cơ sở dữ liệu SQLite...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Drop table if exists to start fresh
    cursor.execute("DROP TABLE IF EXISTS trades")
    
    # Create trades table
    cursor.execute("""
        CREATE TABLE trades (
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
    if os.path.exists(EXCEL_PATH):
        print(f"Đọc dữ liệu từ file Excel: {EXCEL_PATH}")
        df = pd.read_excel(EXCEL_PATH)
        
        # Replace NaN with None for SQLite compatibility
        df = df.where(pd.notnull(df), None)
        
        trades_to_insert = []
        for index, row in df.iterrows():
            trade_id = row.get('Mã số giao dịch')
            open_time = str(row.get('Mở')) if row.get('Mở') else None
            close_time = str(row.get('Đóng')) if row.get('Đóng') else None
            order_type = str(row.get('Lệnh')).upper() if row.get('Lệnh') else None
            volume = row.get('Khối lượng')
            symbol = str(row.get('Mã')).upper() if row.get('Mã') else None
            open_price = row.get('Giá mở lệnh')
            close_price = row.get('Giá đóng lệnh')
            sl = row.get('Cắt Lỗ')
            tp = row.get('Chốt Lời')
            swap = row.get('Phí qua đêm') or 0.0
            commission = row.get('Tiền hoa hồng') or 0.0
            profit = row.get('Lợi nhuận') or 0.0
            pips = row.get('Píp')
            duration = row.get('Thời lượng giao dịch tính bằng giây')
            
            # Calculate Net Profit
            net_profit = round(profit + commission + swap, 2)
            
            # Calculate R:R
            # If SL is set, we estimate R:R as Reward/Risk
            # Clamped between 0.5 and 5.0 for clean visual charts, default to 2.0 if no SL is set
            rr = 2.0
            if sl and open_price and abs(open_price - sl) > 0:
                risk = abs(open_price - sl)
                reward = abs(tp - open_price) if tp else abs(close_price - open_price)
                calculated_rr = reward / risk
                rr = round(min(max(calculated_rr, 0.5), 5.0), 1)
            
            trades_to_insert.append((
                'ftmo-10k', trade_id, open_time, close_time, order_type,
                volume, symbol, open_price, close_price, sl, tp,
                swap, commission, profit, net_profit, pips, rr, duration
            ))
            
        cursor.executemany("""
            INSERT INTO trades (
                account_id, trade_id, open_time, close_time, type,
                volume, symbol, open_price, close_price, sl, tp,
                swap, commission, profit, net_profit, pips, rr, duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, trades_to_insert)
        print(f"Đã nạp {len(trades_to_insert)} giao dịch của FTMO 10k vào SQLite.")
    else:
        print(f"Không tìm thấy file Excel tại {EXCEL_PATH}. Tạo rỗng.")
        
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
        INSERT INTO trades (
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
