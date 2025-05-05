from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, this is the Ai_SmartFitnessBot backend!"

if __name__ == '__main__':
    # Railway передает порт через переменную окружения 'PORT'
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
