import sqlite3
from pyrogram import Client, filters
from pyrogram.raw.types import MessageActionStarGift

api_id = "YOUR_API_ID"
api_hash = "YOUR_API_HASH"
session_name = "userbot"

# --- Инициализация базы данных ---
conn = sqlite3.connect("gifts.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    sender_username TEXT,
    gift_id INTEGER,
    stars INTEGER,
    message TEXT
)
""")
conn.commit()

app = Client(session_name, api_id=api_id, api_hash=api_hash)

@app.on_message(filters.service)
async def handle_service_message(client, message):
    if isinstance(message.action, MessageActionStarGift):
        sender = message.from_user
        gift = message.action.gift
        gift_id = gift.id
        stars = gift.stars
        sender_id = sender.id if sender else None
        sender_username = sender.username if sender else None
        msg_text = getattr(message.action, "message", "")

        # 1. Отправляем отправителю подарок инфу о подарке
        if sender_id:
            text = (
                f"Спасибо за подарок!\n"
                f"ID подарка: {gift_id}\n"
                f"Звёзд: {stars}\n"
                f"Сообщение: {msg_text}"
            )
            await client.send_message(sender_id, text)

        # 2. Сохраняем в базе
        cursor.execute(
            "INSERT INTO gifts (sender_id, sender_username, gift_id, stars, message) VALUES (?, ?, ?, ?, ?)",
            (sender_id, sender_username, gift_id, stars, msg_text)
        )
        conn.commit()
        print(f"Подарок от {sender_username or sender_id} сохранён в базе.")

app.run() 