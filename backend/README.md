# Backend

Здесь будет находиться серверная часть проекта (FastAPI, userbot на Pyrogram, база данных и т.д.).

## Структура
- `main.py` — FastAPI приложение
- `userbot.py` — userbot на Pyrogram
- `requirements.txt` — зависимости
- `gifts.db` — база данных (SQLite)

## Запуск

1. Установить зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. Запустить FastAPI:
   ```bash
   uvicorn main:app --reload
   ```
3. Запустить userbot:
   ```bash
   python userbot.py
   ``` 