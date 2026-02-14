# 🌿 HabitQuest Pro

**HabitQuest Pro** is a high-performance, aesthetically pleasing habit tracking application designed to help users build consistency through data-driven insights and gamified motivation.

## ✨ Key Features

- **🎯 Intelligent Tracking**: Easily create and track daily or weekly habits with a streamlined, mobile-responsive dashboard.
- **🔥 Streak System**: Real-time streak calculation to keep you motivated and accountable.
- **🧠 AI Smart Insights**: Powered by **Google Gemini (gemini-3-flash-preview)**, the app analyzes your completion patterns and provides personalized trends, tips, and progress predictions.
- **📊 Advanced Analytics**: Visualize your consistency over time with interactive area charts and habit performance bar graphs using **Recharts**.
- **🏆 Achievement Engine**: Unlock badges like "Early Bird," "Week Warrior," and "Centurion" as you hit milestones.
- **🔒 Persistence**: Seamless data persistence using browser `localStorage` (simulating a robust database experience).
- **🎨 Premium UI/UX**: Built with **Tailwind CSS** and **Inter** typography, featuring smooth transitions, backdrop blurs, and high-contrast accessibility.

## 🛠️ Tech Stack

- **Frontend**: React (Hooks, Context), TypeScript, Tailwind CSS.
- **AI Integration**: `@google/genai` (Google Gemini API).
- **Data Visualization**: Recharts.
- **Backend Concept**: FastAPI (Python) integration provided in `backend/main.py` for future cloud-scale deployment.

## 🚀 Getting Started

### Prerequisites

To use the AI Smart Insights feature, ensure you have a valid Gemini API Key.
1. Copy `.env.example` to `.env`.
2. Add your `API_KEY` to the `.env` file.

*Note: In the hosted environment, the API key is typically injected automatically via `process.env.API_KEY`.*

### Project Structure

- `index.tsx`: Application entry point.
- `App.tsx`: Root component managing global state, persistence, and navigation.
- `geminiService.ts`: Core service for communicating with the Gemini AI model.
- `components/`:
    - `Dashboard.tsx`: Primary view for daily habit interactions.
    - `Analytics.tsx`: Data visualization and achievement tracking.
    - `HabitCard.tsx`: Individual habit management and streak logic.
    - `InsightPanel.tsx`: The UI bridge for AI-generated feedback.
    - `Auth.tsx`: Polished login and registration interface.
- `backend/`: Contains a conceptual FastAPI implementation for a production-ready Python backend.

## 📝 Usage

1. **Create**: Add a new habit via the "New Habit" button on the dashboard.
2. **Complete**: Tap the checkbox on a habit card to mark it as done for today.
3. **Analyze**: Head to the Analytics tab to view your long-term progress.
4. **Learn**: Check the AI Insights panel on your dashboard for tailored habit-building advice.

## 📜 License

MIT License - feel free to build and grow your habits!
