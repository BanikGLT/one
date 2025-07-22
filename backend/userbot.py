import sqlite3
from telethon import TelegramClient, events
from telethon.tl.types import MessageActionStarGift, MessageActionStarGiftUnique
import asyncio

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

client = TelegramClient(session_name, api_id, api_hash)

@client.on(events.MessageEdited)
@client.on(events.NewMessage)
async def handler(event):
    if not event.is_service:
        return
    action = getattr(event.action, "__class__", None)
    if action in [MessageActionStarGift, MessageActionStarGiftUnique]:
        sender = await event.get_sender()
        sender_id = sender.id if sender else None
        sender_username = sender.username if sender else None
        gift = getattr(event.action, "gift", None)
        gift_id = getattr(gift, "id", None)
        stars = getattr(gift, "stars", None)
        msg_text = getattr(event.action, "message", "")

        # 1. Отправляем отправителю инфу о подарке
        if sender_id:
            text = (
                f"Спасибо за подарок!\n"
                f"ID подарка: {gift_id}\n"
                f"Звёзд: {stars}\n"
                f"Сообщение: {msg_text}"
            )
            try:
                await client.send_message(sender_id, text)
            except Exception as e:
                print(f"Не удалось отправить сообщение отправителю: {e}")

        # 2. Сохраняем в базе
        cursor.execute(
            "INSERT INTO gifts (sender_id, sender_username, gift_id, stars, message) VALUES (?, ?, ?, ?, ?)",
            (sender_id, sender_username, gift_id, stars, msg_text)
        )
        conn.commit()
        print(f"Подарок от {sender_username or sender_id} сохранён в базе.")

if __name__ == "__main__":
    with client:
        client.loop.run_forever() 