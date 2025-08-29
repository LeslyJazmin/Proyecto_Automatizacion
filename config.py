import pyodbc

DB_CONNECTION = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=Automatizacion.mssql.somee.com;"
    "Database=Automatizacion;"
    "Uid=JAZNAMUCHE_SQLLogin_1;"
    "Pwd=trwua7fd3g;"
)

JWT_SECRET_KEY = "clave_muy_segura"

def get_db_connection():
    return pyodbc.connect(DB_CONNECTION)
