#!/usr/bin/env python3
"""
AI Chat Assistant with Journal Integration
A NiceGUI-based chat interface that connects to Gemini AI with journal app tools
"""

import os
import asyncio
from datetime import datetime
from typing import List, Dict, Any

from nicegui import ui, run, app
from dotenv import load_dotenv

from gemini_client import GeminiChatClient
from journal_tools import MOOD_OPTIONS

# Load environment variables
load_dotenv()

class ChatAssistant:
    def __init__(self):
        # Get API keys and config from environment
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.journal_api_url = os.getenv('JOURNAL_API_URL', 'http://localhost:3000')
        
        # Initialize Gemini client
        self.gemini_client = None
        self.is_connected = False
        
        # UI components (will be set during UI creation)
        self.chat_container = None
        self.message_input = None
        self.send_button = None
        self.status_label = None
        
    def init_gemini(self) -> bool:
        """Initialize Gemini client"""
        if not self.gemini_api_key:
            return False
            
        try:
            self.gemini_client = GeminiChatClient(
                api_key=self.gemini_api_key,
                journal_api_url=self.journal_api_url
            )
            self.gemini_client.start_chat()
            self.is_connected = True
            return True
        except Exception as e:
            print(f"Failed to initialize Gemini: {e}")
            return False
    
    def create_ui(self):
        """Create the chat interface"""
        with ui.page_layout() as layout:
            # Header
            with ui.header().classes('bg-gradient-to-r from-blue-500 to-cyan-500'):
                with ui.row().classes('w-full items-center'):
                    ui.label('🤖 AI Journal Assistant').classes('text-2xl font-bold text-white')
                    ui.space()
                    
                    # Connection status
                    if self.is_connected:
                        ui.badge('Connected', color='positive').classes('text-sm')
                    else:
                        ui.badge('Disconnected', color='negative').classes('text-sm')
                    
                    # Clear chat button
                    ui.button('Clear Chat', icon='refresh', on_click=self.clear_chat)\
                        .classes('text-white').props('flat')

            # Main content area
            with ui.column().classes('flex-1 p-4 max-w-4xl mx-auto w-full'):
                # Welcome message
                if not self.is_connected:
                    ui.markdown("""
                    ### ⚠️ Setup Required
                    
                    Please set your `GEMINI_API_KEY` environment variable to start chatting.
                    
                    The assistant can help you:
                    - 📝 Create journal entries
                    - 🔍 Search past entries  
                    - 💭 Reflect on your thoughts
                    - 😊 Track your moods
                    """).classes('bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400')
                else:
                    ui.markdown("""
                    ### 👋 Welcome to your AI Journal Assistant!
                    
                    I can help you:
                    - **📝 Create journal entries** - Share your thoughts and I'll save them
                    - **🔍 Review past entries** - Ask me about your previous reflections
                    - **💭 Reflect together** - Let's explore your experiences and feelings
                    - **😊 Track moods** - I'll help categorize your emotional states
                    
                    Just start chatting naturally! Try saying something like:
                    - "I had a great day today..."
                    - "Help me reflect on this week"
                    - "Show me my recent journal entries"
                    """).classes('bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400')

                # Chat messages container
                self.chat_container = ui.column().classes('flex-1 space-y-4 min-h-[400px]')

                # Input area
                with ui.row().classes('w-full items-end space-x-2 sticky bottom-0 bg-white p-4 border-t'):
                    self.message_input = ui.textarea(
                        placeholder='Share your thoughts, ask questions, or request journal entries...',
                        value=''
                    ).classes('flex-1 min-h-[60px]').props('outlined auto-grow')
                    
                    self.send_button = ui.button(
                        'Send', 
                        icon='send',
                        on_click=self.send_message
                    ).classes('bg-blue-500 text-white px-6 py-3')
                
                # Handle Enter key to send message
                self.message_input.on('keydown.enter', 
                    lambda e: self.send_message() if not e.args['shiftKey'] else None)

                # Status area
                self.status_label = ui.label('').classes('text-sm text-gray-500 mt-2')

    async def send_message(self):
        """Send message to Gemini and display response"""
        if not self.is_connected or not self.gemini_client:
            self.show_error("Please set up your Gemini API key first")
            return
            
        message = self.message_input.value.strip()
        if not message:
            return

        # Clear input and disable send button
        self.message_input.value = ''
        self.send_button.disable()
        self.status_label.text = 'Thinking...'

        # Add user message to chat
        self.add_message(message, is_user=True)

        try:
            # Send to Gemini
            response_data = await asyncio.get_event_loop().run_in_executor(
                None, self.gemini_client.send_message, message
            )

            if response_data['success']:
                # Add AI response
                self.add_message(response_data['response'], is_user=False)
                
                # Show function call results if any
                if response_data.get('function_results'):
                    for result in response_data['function_results']:
                        self.add_function_result(result)
                        
                self.status_label.text = f"Chat history: {response_data['chat_history_length']} messages"
            else:
                self.show_error(response_data.get('error', 'Unknown error'))

        except Exception as e:
            self.show_error(f"Error: {str(e)}")

        finally:
            self.send_button.enable()

    def add_message(self, content: str, is_user: bool = False):
        """Add a message to the chat container"""
        with self.chat_container:
            if is_user:
                # User message (right-aligned, blue)
                with ui.row().classes('w-full justify-end'):
                    with ui.card().classes('bg-blue-500 text-white max-w-[80%] p-4'):
                        ui.markdown(content).classes('text-white')
                        ui.label(f"You • {datetime.now().strftime('%H:%M')}")\
                            .classes('text-xs text-blue-100 mt-2')
            else:
                # AI message (left-aligned, gray)
                with ui.row().classes('w-full justify-start'):
                    with ui.card().classes('bg-gray-100 max-w-[80%] p-4'):
                        ui.markdown(content)
                        ui.label(f"Assistant • {datetime.now().strftime('%H:%M')}")\
                            .classes('text-xs text-gray-500 mt-2')

    def add_function_result(self, result: Dict[str, Any]):
        """Add a function call result to the chat"""
        with self.chat_container:
            with ui.row().classes('w-full justify-center'):
                with ui.card().classes('bg-green-50 border-l-4 border-green-400 p-3 max-w-[90%]'):
                    function_name = result.get('function', 'Unknown')
                    function_result = result.get('result', {})
                    
                    if function_result.get('success'):
                        ui.html(f'<div class="flex items-center space-x-2">'
                               f'<span class="text-green-600">✅</span>'
                               f'<span class="font-medium">{function_result.get("message", "Success")}</span>'
                               f'</div>')
                        
                        # Show entry details if it's a journal creation
                        if function_name == 'create_journal_entry' and function_result.get('data'):
                            entry_data = function_result['data']
                            metadata = entry_data.get('metadata', {})
                            
                            with ui.column().classes('mt-2 space-y-1'):
                                if metadata.get('title'):
                                    ui.label(f"Title: {metadata['title']}").classes('text-sm font-medium')
                                if metadata.get('mood'):
                                    mood_emoji = MOOD_OPTIONS.get(metadata['mood'], '')
                                    ui.label(f"Mood: {mood_emoji} {metadata['mood']}").classes('text-sm')
                                if metadata.get('tags'):
                                    ui.label(f"Tags: {', '.join(metadata['tags'])}").classes('text-sm')
                    else:
                        ui.html(f'<div class="flex items-center space-x-2">'
                               f'<span class="text-red-600">❌</span>'
                               f'<span class="font-medium text-red-600">{function_result.get("message", "Error")}</span>'
                               f'</div>')

    def show_error(self, message: str):
        """Show an error message"""
        with self.chat_container:
            with ui.row().classes('w-full justify-center'):
                with ui.card().classes('bg-red-50 border-l-4 border-red-400 p-3 max-w-[90%]'):
                    ui.html(f'<div class="flex items-center space-x-2">'
                           f'<span class="text-red-600">⚠️</span>'
                           f'<span class="text-red-600">{message}</span>'
                           f'</div>')

    def clear_chat(self):
        """Clear the chat history"""
        if self.gemini_client:
            self.gemini_client.clear_history()
        self.chat_container.clear()
        self.status_label.text = 'Chat cleared'
        
        # Show welcome message again
        with self.chat_container:
            with ui.row().classes('w-full justify-center'):
                with ui.card().classes('bg-blue-50 p-4 max-w-[90%]'):
                    ui.markdown("**Chat cleared!** 🧹\n\nFeel free to start a new conversation.")


def main():
    """Main application entry point"""
    # Create chat assistant
    assistant = ChatAssistant()
    
    # Try to initialize Gemini
    assistant.init_gemini()
    
    # Create UI
    assistant.create_ui()
    
    # Configure the app
    ui.run(
        title="🤖 AI Journal Assistant",
        port=8080,
        show=True,
        reload=False,
        favicon='🤖'
    )


if __name__ == '__main__':
    main()