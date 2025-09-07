from flask import request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from Models.user_model import find_user_by_username, create_user
from werkzeug.security import check_password_hash

def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = find_user_by_username(username)

    if user and user[2] == 1 and check_password_hash(user[1], password):
        token = create_access_token(identity=json.dumps({"username": user[0]}))
        return jsonify({"access_token": token, "username": user[0]})
    else:
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

@jwt_required()
def bienvenido():
    identity = get_jwt_identity()
    user = json.loads(identity)
    return render_template("dashboard.html", usuario=user["username"])

def register():
    data = request.get_json()
    username = data.get("username")
    celular = data.get("celular")
    email = data.get("email")
    password = data.get("password")
    if not username or not celular or not email or not password:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    create_user(username, celular, email, password)
    return jsonify({"message": "Usuario registrado correctamente"}), 201
