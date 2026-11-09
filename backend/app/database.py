import sqlite3
from pathlib import Path
DB_PATH = Path(__file__).resolve().parents[1] / "animalcare.db"

def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with connect() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT, booking_id TEXT UNIQUE NOT NULL,
            pet_type TEXT NOT NULL, pet_name TEXT NOT NULL, service TEXT NOT NULL,
            appointment_date TEXT NOT NULL, appointment_time TEXT NOT NULL,
            owner_name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Booked',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)''')
