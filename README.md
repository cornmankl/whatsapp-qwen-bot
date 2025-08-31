# 🤖 WhatsApp Bot dengan Qwen AI

Projek ini membangunkan **bot WhatsApp pintar** yang menggunakan **model Qwen AI** untuk berinteraksi secara automatik dalam peribadi mahupun kumpulan.

---

## ✨ Ciri-ciri Utama

- 🧠 **AI Qwen** menjawab soalan secara automatik
- 📊 **Dashboard UI** untuk lihat log dan statistik
- 🔐 **Login selamat** ke dashboard
- 📡 **Notifikasi Telegram** jika bot mati
- 🔄 **Auto restart** jika terputus
- ☁️ **Deploy mudah** ke Railway (percuma)

---

## 🧰 Teknologi Digunakan

- `whatsapp-web.js` - Untuk sambungan ke WhatsApp Web
- `transformers` (HuggingFace) - Untuk model Qwen
- `MongoDB` - Simpan log mesej
- `Express.js` - Dashboard & login
- `Railway` - Deployment (percuma)

---

## 🚀 Setup dan Deploy

### 1. Deploy ke Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fcornmankl%2Fwhatsapp-qwen-bot)

Atau:

- Buka [Railway Dashboard](https://railway.app)
- Klik **New Project** → **Deploy from GitHub**
- Pilih repo `cornmankl/whatsapp-qwen-bot`

### 2. Tambah MongoDB

- Klik **+ New** → **MongoDB**
- Railway akan auto inject `MONGO_URI`

### 3. Tambah Telegram Token (opsyenal)

- Dapatkan token dari `@BotFather` di Telegram
- Tambah dalam Railway:
  - `TELEGRAM_BOT_TOKEN` = `your_token`
  - `TELEGRAM_CHAT_ID` = `your_chat_id`

---

## 🧪 Ujian Bot

- Buka **Railway Logs** → Scan QR code untuk login
- Hantar mesej ke bot:
  - `hello`
  - `!help`
  - `!ping`

---

## 🔐 Login ke Dashboard

- Buka `https://<your-app>.railway.app`
- Login dengan:
  - Username: `admin`
  - Password: `password`

---

## 🛠️ Nota Penting

- Bot hanya boleh hidup jika **seseorang scan QR code**
- Pastikan Railway service sentiasa hidup
- Jika bot mati, QR akan berubah

---

## 📦 Struktur Projek

```
whatsapp-qwen-bot/
├── bot.js             # Logik utama bot
├── qwen_model.py      # Model Qwen AI
├── views/             # UI dashboard
├── public/            # CSS/JS untuk UI
├── middleware/        # Auth login
├── Dockerfile         # Untuk deploy
└── requirements.txt   # Python dependencies
```

---

## 🧑‍💻 Pembangun

Dibangunkan oleh **Cornman KL**  
GitHub: [https://github.com/cornmankl](https://github.com/cornmankl)

---

## 📜 Lesen

MIT License