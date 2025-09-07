from flask import Flask, render_template
from flask_jwt_extended import JWTManager
from datetime import timedelta
from Controllers import auth_controller  # ojo: la carpeta debe llamarse Controllers con mayúscula/minúscula igual

# 👇 Aquí le decimos a Flask que las vistas (HTML) están en la carpeta "views"
app = Flask(__name__, template_folder="views")

app.config["JWT_SECRET_KEY"] = "clave_muy_segura"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    return auth_controller.login()

@app.route("/register", methods=["POST"])
def register():
    return auth_controller.register()

@app.route("/bienvenido")
def bienvenido():
    return auth_controller.bienvenido()

if __name__ == "__main__":
    app.run(debug=True)
