// bot.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const path = require('path');

// Setup MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const clientDB = new MongoClient(mongoUri);
let db, logsCollection;

async function connectDB() {
    await clientDB.connect();
    db = clientDB.db('whatsappBot');
    logsCollection = db.collection('logs');
}

connectDB().then(() => console.log('✅ Connected to MongoDB'));

// Setup default user (admin:password)
async function setupDefaultUser() {
    const users = db.collection('users');
    const userExists = await users.findOne({ username: 'admin' });
    if (!userExists) {
        const hash = await bcrypt.hash('password', 10);
        await users.insertOne({ username: 'admin', password: hash });
        console.log('🔐 Default user: admin / password');
    }
}

setTimeout(() => {
    connectDB().then(setupDefaultUser);
}, 2000);

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot WhatsApp Dah Sedia!');
    await sendTelegram('✅ Bot WhatsApp telah sedia!');
});

client.on('disconnected', async () => {
    console.log('🔴 Bot terputus!');
    await sendTelegram('🔴 Bot WhatsApp terputus!');
});

// Abaikan user tertentu
const ignoredUsers = ['60123456789@c.us'];

client.on('message', async msg => {
    const user = msg.from;
    const text = msg.body.trim();

    if (msg.fromMe) return;

    if (ignoredUsers.includes(user)) {
        console.log(`🚫 Diabaikan: ${user}`);
        return;
    }

    if (text.startsWith('!')) {
        if (text === '!help') {
            msg.reply('👋 Hai! Saya Qwen AI. Boleh jawab apa saja. Cuba tanya sesuatu!');
        } else if (text === '!ping') {
            msg.reply('pong');
        } else {
            msg.reply('❓ Command tidak dikenali.');
        }
        return;
    }

    try {
        const reply = await new Promise((resolve, reject) => {
            exec(`python3 qwen_model.py "${text}"`, (err, stdout) => {
                if (err) reject(err);
                else resolve(stdout.trim());
            });
        });

        msg.reply(reply);

        // Simpan log
        await logsCollection.insertOne({
            timestamp: new Date(),
            from: user,
            message: text,
            reply: reply
        });

    } catch (err) {
        console.error(err);
        msg.reply('❌ Maaf, saya tidak dapat menjawab sekarang.');
    }
});

// Telegram notification
async function sendTelegram(message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: message
    });
}

// Express server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'qwenbot',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/logs', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    const logs = await logsCollection.find().sort({ timestamp: -1 }).limit(100).toArray();
    res.json(logs);
});

app.listen(PORT, () => {
    console.log(`🌐 Dashboard di http://localhost:${PORT}`);
});

client.initialize();