from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import pyodbc
import uuid
from datetime import datetime
import json  # <-- importamos json para convertir dict a string

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "clave_muy_segura"  # en producción usar .env
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

# --- REGISTRO ---
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    rol = data.get("rol", "usuario")

    if not username or not password:
        return jsonify({"message": "Faltan datos"}), 400

    try:
        hashed_password = generate_password_hash(password)
        user_id = str(uuid.uuid4())[:8]
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO Usuarios (id_usuario, username, email, password_hash, rol, activo, fecha_creacion)
            VALUES (?, ?, ?, ?, ?, 1, GETDATE())
        """, (user_id, username, email, hashed_password, rol))

        conn.commit()
        conn.close()

        return jsonify({"message": "Usuario registrado con éxito", "id_usuario": user_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- LOGIN ---
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id_usuario, username, password_hash, rol, activo 
            FROM Usuarios
            WHERE username = ?
        """, (username,))
        user = cursor.fetchone()
        conn.close()

        if user and user[4] == 1:
            stored_password = user[2]
            if check_password_hash(stored_password, password):
                # Convertimos diccionario a string JSON
                token = create_access_token(identity=json.dumps({
                    "id": user[0],
                    "username": user[1],
                    "rol": user[3]
                }))
                return jsonify(access_token=token), 200

        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- RUTA PROTEGIDA ---
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Recuperamos el string JSON y lo convertimos a dict
    current_user = json.loads(get_jwt_identity())
    return jsonify(logged_in_as=current_user), 200

if __name__ == "__main__":
    app.run(debug=True)
