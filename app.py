from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
import pyodbc
import json
from datetime import timedelta, datetime
from uuid import uuid4

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "clave_muy_segura"  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)  
jwt = JWTManager(app)

DB_CONNECTION = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=Automatizacion.mssql.somee.com;"
    "Database=Automatizacion;"
    "Uid=JAZNAMUCHE_SQLLogin_1;"
    "Pwd=trwua7fd3g;"
)

def get_db_connection():
    return pyodbc.connect(DB_CONNECTION)

@app.route("/")
def home():
    return render_template("index.html")

# 🔹 LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT username, password_hash, activo
        FROM Usuarios
        WHERE username = ?
    """, (username,))
    user = cursor.fetchone()
    conn.close()

    if user and user[2] == 1 and check_password_hash(user[1], password):
        token = create_access_token(identity=json.dumps({"username": user[0]}))
        return jsonify({"access_token": token, "username": user[0]})
    else:
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

# 🔹 RUTA PROTEGIDA
@app.route("/bienvenido")
@jwt_required()
def bienvenido():
    identity = get_jwt_identity()
    user = json.loads(identity)
    return render_template("dashboard.html", usuario=user["username"])

# 🔹 REGISTER
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    celular = data.get("celular")
    email = data.get("email")
    password = data.get("password")
    rol = data.get("rol", "usuario")
    activo = 1
    fecha_creacion = datetime.now()

    if not username or not celular or not email or not password:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    password_hash = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 🚨 Verificar si ya existe username o email
        cursor.execute("SELECT COUNT(*) FROM Usuarios WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone()[0] > 0:
            return jsonify({"error": "El usuario o email ya existe"}), 409

        cursor.execute("""
            INSERT INTO Usuarios (id_usuario, username, celular, email, password_hash, rol, activo, fecha_creacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"USR{uuid4().hex[:8]}",
            username, celular, email, password_hash, rol, activo, fecha_creacion
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
