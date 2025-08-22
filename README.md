# WhatsApp-Bot-2.O

# About


### GitHub Repository Description

**Title:** WhatsApp Query Logger to Google Sheets
**Short Description:** Node.js bot that listens to WhatsApp messages and logs detected queries to Google Sheets automatically.

---

### Suggested Topics / Tags

* `whatsapp-bot`
* `google-sheets`
* `nodejs`
* `baileys`
* `automation`
* `chatbot`
* `real-time`
* `productivity`
* `javascript`






# WhatsApp Query to Google Sheets Bot

A Node.js bot that automatically listens to WhatsApp messages in a group or individual chat, detects queries based on keywords or question marks, and logs them to a **Google Sheet** in real-time.

This is powered by [`@whiskeysockets/baileys`](https://github.com/adiwajshing/Baileys) for WhatsApp Web connections and the **Google Sheets API** for spreadsheet updates.

---

## Features

* Connects to WhatsApp via QR code authentication.
* Detects queries automatically using keywords and `?`.
* Appends queries to a Google Sheet with timestamp, sender name, and message.
* Automatically reconnects if disconnected.
* Fully configurable with your Google Sheet ID and credentials.

---

## Prerequisites

* Node.js >= 18
* NPM or Yarn
* A Google Cloud Project with Google Sheets API enabled
* WhatsApp account (can be personal or business)

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/whatsapp-sheets-bot.git
cd whatsapp-sheets-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Google API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable **Google Sheets API**.
4. Create a **Service Account** and download the JSON key file.
5. Rename the file to `credentials.json` and place it in the project root.
6. Share your Google Sheet with the service account email (found in the JSON file).

---

### 4. Configure Spreadsheet

* Replace `SHEET_ID` in `index.js` with your Google Sheet ID:

```js
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
```

* Make sure your sheet has at least three columns: **Timestamp | Sender | Message**

---

### 5. Run the Bot

```bash
node index.js
```

* Scan the QR code with your WhatsApp app.
* Once connected, any detected query will be automatically added to the Google Sheet.

---

## File Structure

```
whatsapp-sheets-bot/
│
├─ auth_info/          # WhatsApp authentication state (auto-generated)
├─ credentials.json    # Google service account key
├─ index.js            # Main bot script
├─ package.json
└─ README.md
```

---

## How It Works

1. Connects to WhatsApp Web using Baileys.
2. Listens for new messages in groups or individual chats.
3. Filters messages containing keywords (`update`, `issue`, `help`, `query`, etc.) or ending with a `?`.
4. Sends the message details to Google Sheets using the Sheets API.

---

## Tips & Notes

* Use `USER_ENTERED` as the `valueInputOption` to allow Google Sheets to auto-format timestamps.
* Keep `auth_info` folder private. It contains your WhatsApp session credentials.
* Make sure your service account has access to the target spreadsheet.

---

## Troubleshooting

* **QR code not showing**: Make sure your terminal supports ANSI codes, or use another terminal.
* **Google API errors**: Check your credentials and share the sheet with the service account email.
* **Bot disconnects**: Baileys will auto-reconnect. Delete `auth_info` and re-run if logged out.

---

## License

MIT License. Feel free to use, modify, and distribute.


