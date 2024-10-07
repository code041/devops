from flask import Flask, jsonify
from flask_cors import CORS

# Cria uma instância da aplicação Flask
app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])

# Define uma rota para a URL raiz
@app.route('/')
def hello_world():
    return jsonify(message='Hello, Worlds!')  # Retorna um JSON

# Executa o servidor quando o script for executado diretamente
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
