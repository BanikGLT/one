import asyncio
import sqlite3
from telethon import TelegramClient
from telethon.tl.functions.payments import GetUserStarGifts
from telethon.tl.types import InputUserSelf

api_id = 27613166
api_hash = "f8db5c0f8345c59926194dd36a07062b"
phone_number = "+79301221411"
session_name = "userbot"  # имя файла сессии (userbot.session)

# --- Инициализация базы данных ---
conn = sqlite3.connect("gifts.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY,
    sender_id INTEGER,
    sender_username TEXT,
    gift_id INTEGER,
    stars INTEGER,
    message TEXT
)
""")
conn.commit()

client = TelegramClient(session_name, api_id, api_hash)

async def check_new_gifts():
    while True:
        gifts = await client(GetUserStarGifts(
            user_id=InputUserSelf(),
            offset="",
            limit=100
        ))
        for user_gift in gifts.gifts:
            # user_gift.id — уникальный id подарка
            cursor.execute("SELECT 1 FROM gifts WHERE id = ?", (user_gift.id,))
            if cursor.fetchone():
                continue  # уже обработан

            sender_id = user_gift.from_id.user_id if user_gift.from_id else None
            sender_username = None
            if sender_id:
                try:
                    sender = await client.get_entity(sender_id)
                    sender_username = getattr(sender, "username", None)
                except Exception:
                    sender_username = None
            gift_id = user_gift.gift.id
            stars = user_gift.gift.stars
            msg_text = getattr(user_gift, "message", "")

            # Отправляем отправителю инфу о подарке
            if sender_id:
                text = (
                    f"Спасибо за подарок!\n"
                    f"ID подарка: {gift_id}\n"
                    f"Звёзд: {stars}\n"
                    f"Сообщение: {msg_text}"
                )
                await client.send_message(sender_id, text)

            # Сохраняем в базе
            cursor.execute(
                "INSERT INTO gifts (id, sender_id, sender_username, gift_id, stars, message) VALUES (?, ?, ?, ?, ?, ?)",
                (user_gift.id, sender_id, sender_username, gift_id, stars, msg_text)
            )
            conn.commit()
            print(f"Подарок от {sender_username or sender_id} сохранён в базе.")

        await asyncio.sleep(5)  # Проверять каждые 5 секунд

async def main():
    await client.start(phone=phone_number)  # Только при первом запуске спросит номер/код, потом будет использовать сессию
    await client.send_message("me", "Успешно<3")
    print("Userbot успешно запущен и слушает подарки...")
    await check_new_gifts()

if __name__ == "__main__":
    asyncio.run(main())
