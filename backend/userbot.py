import os
import sqlite3
from pyrogram import Client, filters
from pyrogram.raw.types import MessageActionStarGift

# Можно брать из переменных окружения или вписать прямо
api_id = 27613166
api_hash = "f8db5c0f8345c59926194dd36a07062b"
phone_number = "+79301221411"

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

app = Client(session_name, api_id=api_id, api_hash=api_hash, phone_number=phone_number)

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

@app.on_client_started
async def on_start(client):
    # Отправляем себе в Избранное сообщение об успешном запуске
    await client.send_message("me", "Успешно<3")

app.run()
