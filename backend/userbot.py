import asyncio
import sqlite3
from telethon import TelegramClient, events
from telethon.tl.types import MessageService

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
    action_type TEXT,
    raw_action TEXT
)
""")
conn.commit()

client = TelegramClient(session_name, api_id, api_hash)

@client.on(events.NewMessage)
async def handle_service(event):
    if isinstance(event.message, MessageService):
        sender = await event.get_sender()
        sender_id = sender.id if sender else None
        sender_username = getattr(sender, "username", None)
        action_type = type(event.message.action).__name__
        raw_action = str(event.message.action)

        # Сохраняем в базу всё, что приходит как сервисное сообщение
        cursor.execute(
            "INSERT INTO gifts (sender_id, sender_username, action_type, raw_action) VALUES (?, ?, ?, ?)",
            (sender_id, sender_username, action_type, raw_action)
        )
        conn.commit()
        print(f"Сервисное сообщение от {sender_username or sender_id}: {action_type}")

        # Если это подарок (MessageActionStarGift), отправляем благодарность
        if "StarGift" in action_type:
            text = (
                f"Спасибо за подарок!\n"
                f"Тип действия: {action_type}\n"
            )
            if sender_id:
                await client.send_message(sender_id, text)

async def main():
    await client.start(phone=phone_number)
    await client.send_message("me", "Успешно<3")
    print("Userbot успешно запущен и слушает сервисные сообщения...")
    await client.run_until_disconnected()

if __name__ == "__main__":
    asyncio.run(main())
