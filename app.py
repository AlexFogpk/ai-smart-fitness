import os
import sys
import asyncio
from fastapi import FastAPI, Request, HTTPException
from telegram import Update, WebAppInfo # KeyboardButton, ReplyKeyboardMarkup removed as direct dict is used for reply_markup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import uvicorn

# Configuration
TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN')
# Ensure your Railway service for the backend is configured to expose this path for the webhook
WEBHOOK_URL = "https://ai-smart-fitness-production-2422.up.railway.app/telegram-webhook"
WEB_APP_URL = "https://ai-sf-frontend-production.up.railway.app"  # Your frontend URL

# Initialize FastAPI app
# lifespan will replace on_startup and on_shutdown in newer FastAPI, but this is fine for now.
app = FastAPI()

# --- Telegram Bot Command Handlers ---
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message:
        await update.message.reply_text(
            'Привет! Это Ai_SmartFitnessBot. Я помогу тебе с фитнесом и питанием!\n'
            'Напиши /app чтобы открыть мини-приложение.'
        )

async def app_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message:
        # For python-telegram-bot v20+, reply_markup is a dict, not a ReplyKeyboardMarkup object
        # KeyboardButton is also not directly instantiated here, but its structure is defined in the dict.
        keyboard = [[ # Array of rows
            {"text": "Открыть фитнес-приложение", "web_app": {"url": WEB_APP_URL}}
        ]]
        await update.message.reply_text(
            'Запусти мини-приложение:',
            reply_markup={"keyboard": keyboard, "resize_keyboard": True}
        )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message and update.message.text:
        await update.message.reply_text(f'Я получил от тебя сообщение: {update.message.text}')
    elif update.message: # Handles messages that might not have text (e.g., photos, stickers if not filtered out)
        await update.message.reply_text('Я понимаю только текстовые сообщения. Пришли мне текст.')

# --- FastAPI Routes ---
@app.get("/")
async def root():
    return {"message": "Hello, this is the Ai_SmartFitnessBot FastAPI backend!"}

@app.post("/telegram-webhook")
async def telegram_webhook_endpoint(request: Request):
    print("[WEBHOOK] Received a request on /telegram-webhook endpoint.", file=sys.stderr)
    try:
        data = await request.json()
        # print("Получен запрос от Telegram:", data, file=sys.stderr) # Uncomment for debugging
        
        if not hasattr(app.state, 'ptb_application'):
            print("PTB Application not initialized in app.state", file=sys.stderr)
            raise HTTPException(status_code=500, detail="Bot application not initialized")

        ptb_app = app.state.ptb_application
        
        update = Update.de_json(data, ptb_app.bot)
        print(f"[WEBHOOK] Update object created: {update.to_dict()}", file=sys.stderr)
        
        await ptb_app.process_update(update)
        print("[WEBHOOK] ptb_app.process_update call completed.", file=sys.stderr)
        
        return {"status": "ok"}
    except Exception as e:
        print(f"Ошибка в вебхуке: {e}", file=sys.stderr)
        # Consider raising HTTPException for actual errors if needed by Telegram for retries
        # For now, always return 200 to Telegram to avoid retries for processing errors
        return {"status": "error processing update"}, 200 # Important to return 200 to Telegram


# --- Application Setup and Lifespan Events ---
async def lifespan_startup():
    print("Starting up and setting webhook...", file=sys.stderr)
    if not TELEGRAM_TOKEN:
        print("TELEGRAM_TOKEN is not set!", file=sys.stderr)
        # Optionally raise an error or handle differently
        return

    ptb_application = Application.builder().token(TELEGRAM_TOKEN).build()

    # Register handlers
    ptb_application.add_handler(CommandHandler("start", start_command))
    ptb_application.add_handler(CommandHandler("app", app_command))
    ptb_application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    # Add a handler for non-text messages if you want specific behavior
    ptb_application.add_handler(MessageHandler(filters.ALL & ~filters.TEXT & ~filters.COMMAND, handle_message))

    await ptb_application.initialize()

    app.state.ptb_application = ptb_application

    try:
        # Check if webhook is already set to avoid errors, or drop pending updates
        # current_webhook_info = await ptb_application.bot.get_webhook_info()
        # if current_webhook_info.url != WEBHOOK_URL:
        await ptb_application.bot.set_webhook(
            url=WEBHOOK_URL,
            allowed_updates=Update.ALL_TYPES,
            drop_pending_updates=True # Good for ensuring a clean state on startup
        )
        print(f"Webhook set to {WEBHOOK_URL}", file=sys.stderr)
        # else:
        #     print(f"Webhook already set to {WEBHOOK_URL}", file=sys.stderr)

    except Exception as e:
        print(f"Failed to set webhook: {e}", file=sys.stderr)

async def lifespan_shutdown():
    print("Shutting down...", file=sys.stderr)
    if hasattr(app.state, 'ptb_application') and app.state.ptb_application:
        print("Attempting to delete webhook...", file=sys.stderr)
        try:
            await app.state.ptb_application.bot.delete_webhook()
            print("Webhook deleted.", file=sys.stderr)
        except Exception as e:
            print(f"Failed to delete webhook: {e}", file=sys.stderr)
        
        ptb_app = app.state.ptb_application 
        print("Attempting to shutdown PTB application...", file=sys.stderr)
        try:
            await ptb_app.shutdown()
            print("PTB application shutdown complete.", file=sys.stderr)
        except Exception as e:
            print(f"Failed to shutdown PTB application: {e}", file=sys.stderr)

        # For python-telegram-bot v20+, Application object doesn't have a simple .shutdown()
        # It relies on asyncio task cancellation if you were running it with .run_polling() or .run_webhook()
        # Since we manage the FastAPI lifecycle, this explicit PTB app shutdown is less critical here.
        print("PTB Application cleanup (if any) would go here.", file=sys.stderr)
    else:
        print("No PTB application found in app.state during shutdown.", file=sys.stderr)

# Updated lifespan context manager for FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    await lifespan_startup()
    yield
    await lifespan_shutdown()

# Для FastAPI 0.93.0+ (предпочтительно). Если вызовет AttributeError, верните app.router.lifespan_context = lifespan для более старых версий.
app.lifespan = lifespan # MODIFIED


if __name__ == "__main__":
    # This part is for local development. Railway will use the Procfile.
    port = int(os.environ.get("PORT", 8000)) 
    print(f"Starting Uvicorn locally on port {port}", file=sys.stderr)
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True) # "app:app" string for Uvicorn CLI
