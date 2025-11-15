# 🤖 AI LinkedIn Post → Actionable Insights Agent

Transform any LinkedIn post into structured, actionable insights using AI. This full-stack application processes LinkedIn posts through a multi-step AI pipeline to generate summaries, main ideas, actionable steps, and project suggestions.

## ✨ Features

- **Short Summary** - Concise 2-3 sentence summary
- **Main Idea** - Extracted core message
- **Actionable Steps** - 3 prioritized actions you can take
- **Project Ideas** - Creative project suggestions inspired by the post
- **History Storage** - All processed posts saved locally (backend + localStorage)

## 🚀 Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **AI:** Jules API (multi-step reasoning pipeline)
- **Storage:** File-based JSON database (no external DB required)

## 📂 Project Structure

```
ai-linkedin-insight-agent/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/process.js      # API routes
│   ├── services/julesService.js  # AI service
│   ├── utils/fileDB.js        # File-based database
│   └── data/                  # JSON storage
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── components/        # React components
│   │   └── api.ts             # API client
│   └── public/
│
└── README.md                  # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ installed
- Jules API key (or configure for your preferred AI API)

### Backend Setup

```bash
cd backend
npm install
```



Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage

1. **Start both servers** (backend on port 3001, frontend on port 5173)
2. **Open** `http://localhost:5173` in your browser
3. **Paste** any LinkedIn post into the text area
4. **Click** "Process Post" to generate insights
5. **View** results: Summary, Main Idea, Actionable Steps, and Project Ideas
6. **Check History** tab to see all previously processed posts

## 🔌 API Endpoints

### POST `/api/process`

Process a LinkedIn post and generate insights.

**Request:**
```json
{
  "postText": "Your LinkedIn post text here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "originalText": "...",
    "summary": "...",
    "mainIdea": "...",
    "actionableSteps": "...",
    "projectIdeas": "...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/history?limit=10`

Get last N processed posts (default: 10)

## 💾 Data Storage

- **Backend:** All processed posts are saved in `backend/data/processedPosts.json`
- **Frontend:** Recent posts are cached in browser `localStorage`

## 🎯 Why This Project is Impressive

- ✅ **Real AI Agent Pipeline** - Multi-step reasoning with structured prompts
- ✅ **Full Stack** - Complete React frontend + Node.js backend
- ✅ **No Complex Setup** - File-based storage, no database or cloud required
- ✅ **Production Ready** - Clean code, error handling, TypeScript
- ✅ **Perfect for Portfolio** - Demonstrates AI integration, full-stack skills

## 🧪 Development

### Backend
- Runs on Node.js with Express
- Uses file-based JSON database for simplicity
- Integrated with Jules API for AI processing

### Frontend
- Built with Vite for fast development
- React with TypeScript for type safety
- Tailwind CSS for beautiful, responsive UI
- Automatic API proxying to backend

## 📝 Notes

- Make sure to set your `JULES_API_KEY` in `backend/.env`
- If using a different AI API, update the service in `backend/services/julesService.js`
- The application stores data locally - no external database needed!

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your own use!

## 📄 License

MIT

---

Built with ❤️ for showcasing AI and full-stack development skills.

