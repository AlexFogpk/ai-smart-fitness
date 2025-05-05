from flask import Flask, request
import os
from telegram import Bot, Update
import asyncio
import sys

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN')
app = Flask(__name__)
bot = Bot(token=TELEGRAM_TOKEN)

# Создаём event loop один раз (глобально для всего процесса)
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

@app.route('/')
def home():
    return "Hello, this is the Ai_SmartFitnessBot backend!"

@app.route('/telegram-webhook', methods=['POST'])
def telegram_webhook():
    try:
        print("Получен запрос от Telegram:", file=sys.stderr)
        print(request.get_json(force=True), file=sys.stderr)

        update = Update.de_json(request.get_json(force=True), bot)
        chat_id = update.message.chat.id

        if hasattr(update.message, "text") and update.message.text:
            text = update.message.text
            if text.strip().lower() == '/start':
                loop.run_until_complete(bot.send_message(chat_id=chat_id, text='Привет! Это Ai_SmartFitnessBot. Я помогу тебе с фитнесом и питанием!'))
            else:
                loop.run_until_complete(bot.send_message(chat_id=chat_id, text='Я получил от тебя сообщение: ' + text))
        else:
            loop.run_until_complete(bot.send_message(chat_id=chat_id, text='Я понимаю только текстовые сообщения. Пришли мне текст.'))
    except Exception as e:
        print(f"Ошибка: {e}", file=sys.stderr)
    return 'ok', 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    
