const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { google } = require('googleapis');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

// ---------------- CONFIG ----------------
const SHEET_ID = '1-YQIsg6ADJv9D4ztfS_FDJyF9Ajwo0InPAo12kxFA_Y';
const CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json'));
// ----------------------------------------

const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version
    });

    // Save credentials automatically
    sock.ev.on('creds.update', saveCreds);

    // Handle connection + QR
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📱 Scan this QR to log in:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log('Reconnecting...');
            } else {
                console.log('Logged out. Delete auth_info folder and try again.');
            }
        } else if (connection === 'open') {
            console.log('✅ Connected to WhatsApp');
        }
    });

    // Listen for new messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        const keywords = ['update', 'issue', 'help', 'query', 'timing', 'not finalized', 'Need'];
        const isQuery = text.endsWith('?') || keywords.some(word => text.toLowerCase().includes(word));

        if (isQuery) {
            const sender = msg.pushName || 'Unknown';
            const chat = msg.key.remoteJid || 'Group';
            console.log(`📩 Query detected from ${sender}: ${text}`);
            await appendToSheet(chat, sender, text);
        }
    });

    // Append detected queries to Google Sheet
    async function appendToSheet(group, sender, query) {
        try {
            const values = [[new Date().toLocaleString(), sender, query]];
            console.log('📝 Sending to Google Sheets:', values);

            const res = await sheets.spreadsheets.values.append({
                spreadsheetId: SHEET_ID,
                range: 'Sheet1!A:C',
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                resource: { values },
            });

            console.log('✅ Query added to sheet, response:', JSON.stringify(res.data, null, 2));
        } catch (err) {
            console.error('❌ Error updating sheet:', err.errors || err.message || err);
        }
    }
})();
