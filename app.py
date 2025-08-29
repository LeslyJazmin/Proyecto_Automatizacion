from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import pyodbc
import json
from flask_jwt_extended import decode_token

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "clave_muy_segura"
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

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

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
        # Login correcto → renderiza página de bienvenida
        return render_template("dashboard.html", usuario=user[0])
    else:
        return render_template("index.html", error="Usuario o contraseña incorrectos")

@app.route("/bienvenido")
def bienvenido():
    token = request.args.get("token")  # <-- leemos el token de la URL
    if not token:
        return "No se proporcionó token", 401

    try:
        identity = decode_token(token)['sub']  # decodificamos JWT
        user = json.loads(identity)
        return render_template("dashboard.html", usuario=user["username"])
    except Exception as e:
        return f"Token inválido: {str(e)}", 401

if __name__ == "__main__":
    app.run(debug=True)
