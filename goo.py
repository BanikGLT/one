import requests
import sqlite3
import time
import json

DB_NAME = 'collections_data.db'
TABLE_NAME = 'collections'

# Создание таблицы, если не существует
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(f'''
        CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            collection_id TEXT,
            name TEXT,
            model TEXT,
            backdrop TEXT,
            amount INTEGER,
            floor_price REAL,
            photo_url TEXT,
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Извлечение нужных атрибутов из attributes
def get_attribute(attributes, attr_type):
    if not isinstance(attributes, list):
        return None
    for attr in attributes:
        if attr.get('type') == attr_type:
            return attr.get('value')
    return None

# Сохранение данных в БД
def save_to_db(data):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(f'''
        INSERT INTO {TABLE_NAME} (collection_id, name, model, backdrop, amount, floor_price, photo_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('collection_id'),
        data.get('name'),
        data.get('model'),
        data.get('backdrop'),
        data.get('amount'),
        data.get('floor_price'),
        data.get('photo_url'),
        data.get('created_at')
    ))
    conn.commit()
    conn.close()

# Основная логика обхода коллекций и пагинации
def process_collections(collections, max_pages=5, delay=1):
    for idx, col in enumerate(collections):
        print(f"\n[{idx+1}/{len(collections)}] Обработка коллекции: {col['base_url']}")
        offset = 0
        for page in range(max_pages):
            url = col['base_url'] + f"&offset={offset}"
            try:
                resp = requests.get(url, headers=col['headers'])
                if resp.status_code != 200:
                    print(f"Ошибка {resp.status_code} для {url}")
                    break
                data = resp.json()
                actions = data.get('results') or data.get('actions') or []
                if not actions:
                    print("Нет данных на этой странице.")
                    break
                for item in actions:
                    attributes = item.get('attributes', [])
                    save_to_db({
                        'collection_id': item.get('collection_id'),
                        'name': get_attribute(attributes, 'name'),
                        'model': get_attribute(attributes, 'model'),
                        'backdrop': get_attribute(attributes, 'backdrop'),
                        'amount': item.get('amount'),
                        'floor_price': item.get('floor_price'),
                        'photo_url': item.get('photo_url'),
                        'created_at': item.get('created_at')
                    })
                print(f"Страница {page+1}: {len(actions)} записей сохранено.")
                offset += 20
                time.sleep(delay)
            except Exception as e:
                print(f"Ошибка при обработке: {e}")
                break

if __name__ == "__main__":
    print(f"Всего коллекций: {len(collections)}")
    init_db()
    # Можно задать параметры через input или оставить дефолтные
    try:
        max_pages = int(input("Сколько страниц (по 20 записей) обрабатывать для каждой коллекции? [по умолчанию 5]: ") or 5)
    except Exception:
        max_pages = 5
    try:
        delay = float(input("Задержка между запросами (сек): [по умолчанию 1]: ") or 1)
    except Exception:
        delay = 1
    process_collections(collections, max_pages=max_pages, delay=delay)
    print("\nГотово! Все данные сохранены в базе.") 