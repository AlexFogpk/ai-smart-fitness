from flask import Flask, request
import os
from telegram import Bot, Update

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN')
app = Flask(__name__)
bot = Bot(token=TELEGRAM_TOKEN)

@app.route('/')
def home():
    return "Hello, this is the Ai_SmartFitnessBot backend!"

@app.route('/telegram-webhook', methods=['POST'])
def telegram_webhook():
    update = Update.de_json(request.get_json(force=True), bot)
    chat_id = update.message.chat.id
    text = update.message.text

    # Простая обработка
    if text == '/start':
        bot.send_message(chat_id=chat_id, text='Привет! Это Ai_SmartFitnessBot. Я помогу тебе с фитнесом и питанием!')
    else:
        bot.send_message(chat_id=chat_id, text='Я получил от тебя сообщение: ' + text)
    return 'ok', 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
