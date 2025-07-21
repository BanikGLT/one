import asyncio
import sqlite3
from telethon import TelegramClient, events
from telethon.tl.types import MessageActionStarGift

# --- Настройки ---
api_id = 27613166
api_hash = "f8db5c0f8345c59926194dd36a07062b"
phone_number = "+79301221411"
session_name = "userbot"  # имя файла сессии

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

# --- Telethon клиент ---
client = TelegramClient(session_name, api_id, api_hash)

@client.on(events.NewMessage)
async def handle_gift(event):
    if event.action and isinstance(event.action, MessageActionStarGift):
        sender = await event.get_sender()
        gift = event.action.gift
        gift_id = gift.id
        stars = gift.stars
        sender_id = sender.id if sender else None
        sender_username = sender.username if sender else None
        msg_text = getattr(event.action, "message", "")

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

async def main():
    await client.start(phone=phone_number)
    await client.send_message("me", "Успешно<3")
    print("Userbot успешно запущен и слушает подарки...")
    await client.run_until_disconnected()

if __name__ == "__main__":
    asyncio.run(main())
