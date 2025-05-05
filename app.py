from flask import Flask, request
import os
from telegram import Bot, Update
from telegram.ext import CommandHandler, MessageHandler, Filters, Dispatcher
import threading

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN')  # <-- ваш настоящий токен

app = Flask(__name__)

bot = Bot(token=TELEGRAM_TOKEN)

# Главная страница
@app.route('/')
def home():
    return "Hello, this is the Ai_SmartFitnessBot backend!"

# Точка для Telegram webhook
@app.route('/telegram-webhook', methods=['POST'])
def telegram_webhook():
    if request.method == "POST":
        update = Update.de_json(request.get_json(force=True), bot)
        dp.process_update(update)
        return 'ok', 200

# Создаем обработчики для Telegram
def start(update, context):
    update.message.reply_text('Привет! Это Ai_SmartFitnessBot. Я помогу тебе с фитнесом и питанием!')

def echo(update, context):
    update.message.reply_text('Я получил от тебя сообщение: ' + update.message.text)

from telegram.ext import Dispatcher

dp = Dispatcher(bot, None, workers=0)
dp.add_handler(CommandHandler("start", start))
dp.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))

# Фоновый запуск
def run():
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    run()
