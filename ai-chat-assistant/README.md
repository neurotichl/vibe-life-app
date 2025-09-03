# 🤖 AI Chat Assistant with Journal Integration

A beautiful NiceGUI-based chat interface that connects to Google's Gemini AI with journal app integration tools. The AI assistant can help you create and manage journal entries while maintaining conversational memory during your session.

## ✨ Features

- **🤖 Gemini AI Integration**: Powered by Google's Gemini Pro model
- **📝 Journal Tools**: Direct integration with your journal app API
- **💭 Session Memory**: Remembers conversation context during the session
- **🎨 Beautiful UI**: Clean, responsive interface built with NiceGUI
- **🔧 Function Calling**: AI can create and retrieve journal entries automatically
- **😊 Mood Tracking**: Supports all 8 mood categories from the journal app
- **🏷️ Tag Management**: Automatically categorizes journal entries

## 🚀 Quick Start

### Prerequisites

1. **Gemini API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Journal App Running**: Make sure your journal app is running on `localhost:3000`

### Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   export GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the chat assistant**:
   ```bash
   python main.py
   ```

4. **Open your browser** to `http://localhost:8080`

## 🎯 How It Works

### AI Tools Integration
The assistant has access to two powerful tools:

1. **create_journal_entry**: Creates new journal entries in your journal app
2. **get_journal_entries**: Retrieves past entries for reflection and review

### Example Conversations

**Creating Entries**:
- "I had an amazing day at work today. We launched our new product!"
- "I'm feeling grateful for my family and friends."
- "Today was tough, but I learned something important..."

**Reviewing Entries**:
- "Show me my entries from yesterday"
- "What did I write about last week?"
- "Help me reflect on my recent thoughts"

## 🏗️ Architecture

```
ai-chat-assistant/
├── main.py              # NiceGUI web interface
├── gemini_client.py     # Gemini AI client with function calling
├── journal_tools.py     # Journal API integration tools  
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `JOURNAL_API_URL`: Journal app URL (default: http://localhost:3000)

### Docker Support (Future)

The app is designed with Docker in mind:
- Each component runs on a different port
- Environment variables for service discovery
- Ready for `docker-compose` orchestration

## 📱 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Real-time Chat**: Instant responses with typing indicators
- **Function Call Display**: Shows when journal entries are created
- **Session Management**: Clear chat and start fresh anytime
- **Status Indicators**: Connection status and message counts

## 🎨 Design Philosophy

- **Sea Blue Theme**: Calm, professional color scheme matching journal app
- **Conversational**: Natural language interaction
- **Supportive**: Encouraging reflection and emotional awareness
- **Efficient**: Quick access to journal functionality

## 🚧 Future Enhancements

1. **Persistent Memory**: Save conversation history across sessions
2. **Multiple Journal Types**: Support for habits, meals, tasks
3. **Voice Input**: Speech-to-text for hands-free journaling
4. **Insights Dashboard**: AI-powered analytics on journal patterns
5. **Mobile App**: React Native version using the same APIs

## 🤝 Integration with LifeOS

This chat assistant is part of the broader LifeOS ecosystem:
- **Universal Schema**: Compatible with all LifeOS data types
- **API-First**: Ready for multi-frontend architecture
- **Vector-Ready**: Prepared for semantic search features
- **Microservice**: Independent service that can be containerized

## 📝 Example Usage

```bash
# Terminal 1: Start journal app
cd journal-app
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
npm run dev

# Terminal 2: Start chat assistant  
cd ai-chat-assistant
export GEMINI_API_KEY=your_key_here
python main.py
```

Now you have:
- Journal app at `localhost:3000`
- Chat assistant at `localhost:8080`
- Full AI-powered journaling experience! 🎉