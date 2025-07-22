import sqlite3
from telethon import TelegramClient, events
from telethon.tl.types import MessageActionStarGift, MessageActionStarGiftUnique
from telethon.tl.functions.payments import GetStarGifts
import asyncio

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

client = TelegramClient(session_name, api_id, api_hash)

async def poll_gifts():
    print("[INFO] Запуск опроса подарков...")
    last_gift_ids = set()
    me = await client.get_me()
    my_id = me.id
    print(f"[INFO] Мой user_id: {my_id}")
    while True:
        try:
            print("[INFO] Запрашиваю список полученных подарков...")
            gifts = await client(GetStarGifts(offset_id=0, limit=100))
            print(f"[INFO] Получено подарков (всего): {len(gifts.gifts)}")
            for gift in gifts.gifts:
                # Фильтруем только входящие подарки (где to_id — это мой user_id)
                to_id = getattr(gift.to_id, 'user_id', None)
                if to_id != my_id:
                    continue
                if gift.id not in last_gift_ids:
                    sender_id = getattr(gift.from_id, 'user_id', None)
                    sender_username = None
                    if sender_id:
                        try:
                            sender = await client.get_entity(sender_id)
                            sender_username = getattr(sender, 'username', None)
                        except Exception as e:
                            print(f"[WARN] Не удалось получить username отправителя: {e}")
                    gift_id = gift.gift.id if hasattr(gift, 'gift') and hasattr(gift.gift, 'id') else None
                    stars = gift.gift.stars if hasattr(gift, 'gift') and hasattr(gift.gift, 'stars') else None
                    msg_text = getattr(gift, 'message', '')
                    print(f"[NEW INCOMING GIFT] ID: {gift_id}, Stars: {stars}, From: {sender_username or sender_id}, Message: {msg_text}")
                    # Отправляем ответ
                    if sender_id:
                        text = (
                            f"Спасибо за подарок!\n"
                            f"ID подарка: {gift_id}\n"
                            f"Звёзд: {stars}\n"
                            f"Сообщение: {msg_text}"
                        )
                        try:
                            await client.send_message(sender_id, text)
                            print(f"[INFO] Ответ отправлен пользователю {sender_username or sender_id}")
                        except Exception as e:
                            print(f"[ERROR] Не удалось отправить сообщение отправителю: {e}")
                    # Сохраняем в базе
                    cursor.execute(
                        "INSERT INTO gifts (sender_id, sender_username, gift_id, stars, message) VALUES (?, ?, ?, ?, ?)",
                        (sender_id, sender_username, gift_id, stars, msg_text)
                    )
                    conn.commit()
                    print(f"[INFO] Подарок от {sender_username or sender_id} сохранён в базе.")
            # Обновляем только входящие подарки
            last_gift_ids = {gift.id for gift in gifts.gifts if getattr(gift.to_id, 'user_id', None) == my_id}
        except Exception as e:
            print(f"[ERROR] Ошибка при опросе подарков: {e}")
        await asyncio.sleep(10)

if __name__ == "__main__":
    with client:
        client.loop.create_task(poll_gifts())
        client.loop.run_forever() 