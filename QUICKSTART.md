# ⚡ Quick Start

## 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
```

Create `backend/.env` file:
```
PORT=3001
JULES_API_KEY=your_actual_api_key_here
JULES_API_URL=https://api.jules.ai/v1/chat/completions
```

Start backend:
```bash
npm start
```

## 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

## 3. Open Browser

Go to: `http://localhost:5173`

## ✅ Done!

Paste a LinkedIn post and click "Process Post" to see the magic happen!

---

**Note:** Make sure to replace `your_actual_api_key_here` with your real Jules API key in `backend/.env`

