from telethon import TelegramClient, events
from telethon.tl.types import MessageService

api_id = 27613166
api_hash = "f8db5c0f8345c59926194dd36a07062b"
phone_number = "+79301221411"
session_name = "userbot"

client = TelegramClient(session_name, api_id, api_hash)

@client.on(events.NewMessage)
async def log_service(event):
    if isinstance(event.message, MessageService):
        print("=== SERVICE MESSAGE ===")
        print("RAW EVENT:", event)
        print("RAW MESSAGE:", event.message)
        print("ACTION TYPE:", type(event.message.action).__name__)
        print("ACTION:", event.message.action)
        print("=======================")

client.start(phone=phone_number)
client.run_until_disconnected()
