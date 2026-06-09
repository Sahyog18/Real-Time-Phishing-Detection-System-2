import sqlite3
import os
from datetime import datetime

DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database")
DB_PATH = os.path.join(DB_DIR, "phishing.db")

def init_db():
    """Initializes the database and creates tables if they do not exist."""
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Scan History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        url TEXT NOT NULL,
        prediction TEXT NOT NULL,
        confidence REAL NOT NULL,
        risk_level TEXT NOT NULL,
        scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        vt_malicious INTEGER DEFAULT 0,
        vt_suspicious INTEGER DEFAULT 0,
        vt_harmless INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    )
    """)
    
    # 3. Reports Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id INTEGER NOT NULL,
        report_path TEXT NOT NULL,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scan_id) REFERENCES scan_history (id) ON DELETE CASCADE
    )
    """)
    
    # 4. Threat Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS threat_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id INTEGER NOT NULL,
        threat_type TEXT NOT NULL,
        details TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scan_id) REFERENCES scan_history (id) ON DELETE CASCADE
    )
    """)
    
    # 5. Admin Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE SET NULL
    )
    """)
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Returns a connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

def log_admin_action(admin_id, action, details):
    """Logs administrative actions for audit trails."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
            (admin_id, action, details)
        )
        conn.commit()
    except Exception as e:
        print(f"Error logging admin action: {e}")
    finally:
        conn.close()

# Run initialization on import
init_db()
print(f"Database initialized at: {DB_PATH}")
