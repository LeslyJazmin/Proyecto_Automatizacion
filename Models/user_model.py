import os
import pyodbc
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from uuid import uuid4
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

DB_CONNECTION = os.getenv("DB_CONNECTION")

def get_db_connection():
    return pyodbc.connect(DB_CONNECTION)

def find_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username, password_hash, activo FROM Usuarios WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user

def create_user(username, celular, email, password, rol="usuario"):
    conn = get_db_connection()
    cursor = conn.cursor()
    password_hash = generate_password_hash(password)
    id_usuario = f"USR{uuid4().hex[:8]}"   # ID único alfanumérico
    fecha_creacion = datetime.now()

    cursor.execute("""
        INSERT INTO Usuarios (id_usuario, username, celular, email, password_hash, rol, activo, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (id_usuario, username, celular, email, password_hash, rol, 1, fecha_creacion))
    conn.commit()
    conn.close()
