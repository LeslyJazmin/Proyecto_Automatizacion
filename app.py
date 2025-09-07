import os
from flask import Flask, render_template
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv

# Importar controladores
from Controllers import auth_controller

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__, template_folder="Views")

# Configuración JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)

# Rutas básicas
@app.route("/")
def home():
    return render_template("index.html")

# Registrar controladores
app.register_blueprint(auth_controller.bp)

if __name__ == "__main__":
    app.run(debug=True)
