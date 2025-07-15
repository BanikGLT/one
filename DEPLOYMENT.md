# 🚀 Инструкции по деплою

## Обзор

Telegram Jackpot готов к деплою на различные платформы. Выберите подходящий вариант для ваших нужд.

## 📋 Требования

- Node.js 18+
- npm или yarn
- Git

## 🛠 Подготовка к деплою

### 1. Сборка проекта
```bash
# Установка зависимостей
npm install

# Сборка для продакшена
npm run build
```

### 2. Проверка сборки
```bash
# Предпросмотр собранного проекта
npm run preview
```

## 🌐 Варианты деплоя

### 1. Vercel (Рекомендуется)

**Преимущества:** Быстрый деплой, автоматическая интеграция с Git, бесплатный план.

```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel

# Или через веб-интерфейс
# 1. Загрузите папку dist на vercel.com
# 2. Или подключите GitHub репозиторий
```

### 2. Netlify

**Преимущества:** Простой деплой, бесплатный SSL, CDN.

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Деплой
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

**Преимущества:** Бесплатно, интеграция с GitHub.

```bash
# Добавьте в package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Установка gh-pages
npm install --save-dev gh-pages

# Деплой
npm run deploy
```

### 4. Firebase Hosting

**Преимущества:** Google Cloud, быстрая загрузка.

```bash
# Установка Firebase CLI
npm install -g firebase-tools

# Инициализация
firebase init hosting

# Деплой
firebase deploy
```

### 5. AWS S3 + CloudFront

**Преимущества:** Масштабируемость, низкая стоимость.

```bash
# Установка AWS CLI
# Настройка credentials

# Синхронизация с S3
aws s3 sync dist/ s3://your-bucket-name

# Настройка CloudFront для CDN
```

## 🔧 Конфигурация для Telegram

### 1. Настройка Telegram Bot

```javascript
// В вашем боте добавьте:
const webAppUrl = 'https://your-domain.com';

// Кнопка для открытия веб-приложения
const keyboard = {
  inline_keyboard: [[
    {
      text: '🎰 Играть в Джекпот',
      web_app: { url: webAppUrl }
    }
  ]]
};
```

### 2. Настройка Telegram Web App

```javascript
// В index.html добавьте:
<script src="https://telegram.org/js/telegram-web-app.js"></script>

// В вашем коде:
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
```

### 3. Обработка платежей

```javascript
// Интеграция с Telegram Payments
const paymentData = {
  title: 'Telegram Jackpot',
  description: 'Пополнение баланса',
  payload: 'jackpot_payment',
  provider_token: 'YOUR_PROVIDER_TOKEN',
  currency: 'TON',
  prices: [{ label: 'Гифт', amount: 1000 }]
};

tg.MainButton.showProgress();
tg.sendData(JSON.stringify(paymentData));
```

## 🔒 Безопасность

### 1. HTTPS
Убедитесь, что ваш домен использует HTTPS (обязательно для Telegram Web Apps).

### 2. CSP Headers
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline';">
```

### 3. Environment Variables
```bash
# Создайте .env файл
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_API_URL=https://your-api.com
```

## 📊 Мониторинг

### 1. Google Analytics
```html
<!-- Добавьте в index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Tracking
```javascript
// Добавьте в main.jsx
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Отправка в ваш сервис мониторинга
});
```

## 🚀 Оптимизация

### 1. Сжатие
```bash
# Установка compression-webpack-plugin
npm install --save-dev compression-webpack-plugin

# Настройка в vite.config.js
import compression from 'compression-webpack-plugin';

export default {
  plugins: [
    compression({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
```

### 2. Кэширование
```javascript
// В вашем сервере добавьте заголовки:
{
  'Cache-Control': 'public, max-age=31536000, immutable',
  'ETag': 'your-etag'
}
```

## 🔄 CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи сборки
2. Убедитесь в корректности конфигурации
3. Проверьте совместимость с Telegram Web Apps
4. Обратитесь к документации платформы деплоя

---

**Удачного деплоя! 🎰** 