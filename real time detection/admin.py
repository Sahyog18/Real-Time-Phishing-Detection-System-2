import sqlite3
import pandas as pd
from database import get_db_connection, log_admin_action

def get_all_users() -> list:
    """Returns a list of all registered users in the system."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC")
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error fetching users: {e}")
        return []
    finally:
        conn.close()

def delete_user(admin_id: int, target_user_id: int, target_username: str) -> bool:
    """Deletes a user from the system and logs the administrative action."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Prevent deletion of user ID 1 or the admin's own account
        if target_user_id == admin_id:
            return False
            
        cursor.execute("DELETE FROM users WHERE id = ?", (target_user_id,))
        conn.commit()
        
        # Log action
        log_admin_action(admin_id, "DELETE_USER", f"Deleted user: {target_username} (ID: {target_user_id})")
        return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False
    finally:
        conn.close()

def get_all_scan_history() -> list:
    """Returns the system-wide scan history, joining username details."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT sh.id, u.username, sh.url, sh.prediction, sh.confidence, sh.risk_level, sh.scanned_at 
            FROM scan_history sh
            LEFT JOIN users u ON sh.user_id = u.id
            ORDER BY sh.scanned_at DESC
        """)
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error fetching collective scan history: {e}")
        return []
    finally:
        conn.close()

def delete_scan(admin_id: int, scan_id: int, url: str) -> bool:
    """Removes a URL scan entry from scan history."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM scan_history WHERE id = ?", (scan_id,))
        conn.commit()
        
        log_admin_action(admin_id, "DELETE_SCAN", f"Deleted scan record ID: {scan_id} for URL: {url}")
        return True
    except Exception as e:
        print(f"Error deleting scan: {e}")
        return False
    finally:
        conn.close()

def get_admin_logs() -> list:
    """Fetches administrative logs with username details."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT al.id, u.username, al.action, al.details, al.logged_at 
            FROM admin_logs al
            LEFT JOIN users u ON al.admin_id = u.id
            ORDER BY al.logged_at DESC
        """)
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error fetching admin logs: {e}")
        return []
    finally:
        conn.close()

def export_scans_csv() -> str:
    """Generates and returns system-wide scan history as a CSV formatted string."""
    conn = get_db_connection()
    query = """
        SELECT sh.id, u.username, sh.url, sh.prediction, sh.confidence, sh.risk_level, 
               sh.vt_malicious, sh.vt_suspicious, sh.vt_harmless, sh.scanned_at 
        FROM scan_history sh
        LEFT JOIN users u ON sh.user_id = u.id
        ORDER BY sh.scanned_at DESC
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df.to_csv(index=False)
