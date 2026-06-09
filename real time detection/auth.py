import bcrypt
import streamlit as st
import sqlite3
from database import get_db_connection, log_admin_action

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    """Verifies a password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def register_user(username: str, password: str, email: str, role: str = 'user') -> tuple[bool, str]:
    """Registers a new user in the database."""
    if not username or not password or not email:
        return False, "All fields are required."
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if username already exists
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            return False, f"Username '{username}' is already taken."
        
        # Hash the password and insert
        hashed = hash_password(password)
        cursor.execute(
            "INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)",
            (username, hashed, email, role)
        )
        conn.commit()
        return True, "Registration successful."
    except Exception as e:
        return False, f"Error registering user: {str(e)}"
    finally:
        conn.close()

def authenticate_user(username: str, password: str) -> dict | None:
    """Authenticates a user and returns their profile if valid."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT id, username, password_hash, email, role FROM users WHERE username = ?",
            (username,)
        )
        row = cursor.fetchone()
        if row and check_password(password, row['password_hash']):
            return {
                'id': row['id'],
                'username': row['username'],
                'email': row['email'],
                'role': row['role']
            }
        return None
    except Exception as e:
        print(f"Auth error: {e}")
        return None
    finally:
        conn.close()

def reset_password(username: str, email: str, new_password: str) -> tuple[bool, str]:
    """Resets user's password if the username and email match."""
    if not username or not email or not new_password:
        return False, "All fields are required."
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT id FROM users WHERE username = ? AND email = ?",
            (username, email)
        )
        row = cursor.fetchone()
        if not row:
            return False, "Username and Email do not match our records."
        
        hashed = hash_password(new_password)
        cursor.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (hashed, row['id'])
        )
        conn.commit()
        return True, "Password reset successful."
    except Exception as e:
        return False, f"Error resetting password: {str(e)}"
    finally:
        conn.close()

def init_session_state():
    """Initializes Streamlit session states for security and authentication."""
    if 'logged_in' not in st.session_state:
        st.session_state.logged_in = False
    if 'user_id' not in st.session_state:
        st.session_state.user_id = None
    if 'username' not in st.session_state:
        st.session_state.username = None
    if 'user_role' not in st.session_state:
        st.session_state.user_role = None
    if 'user_email' not in st.session_state:
        st.session_state.user_email = None

def login_session(user: dict):
    """Stores user details in the Streamlit session state."""
    st.session_state.logged_in = True
    st.session_state.user_id = user['id']
    st.session_state.username = user['username']
    st.session_state.user_role = user['role']
    st.session_state.user_email = user['email']

def logout_session():
    """Clears authentication details from the Streamlit session state."""
    st.session_state.logged_in = False
    st.session_state.user_id = None
    st.session_state.username = None
    st.session_state.user_role = None
    st.session_state.user_email = None

def is_logged_in() -> bool:
    """Checks if a user is currently logged in."""
    return st.session_state.get('logged_in', False)

def is_admin() -> bool:
    """Checks if the logged-in user is an administrator."""
    return is_logged_in() and st.session_state.get('user_role') == 'admin'

def get_current_user() -> dict | None:
    """Returns the current user details if logged in."""
    if is_logged_in():
        return {
            'id': st.session_state.user_id,
            'username': st.session_state.username,
            'role': st.session_state.user_role,
            'email': st.session_state.user_email
        }
    return None
