import os
import json
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from journal_tools import JournalAPI, JOURNAL_TOOLS


class GeminiChatClient:
    def __init__(self, api_key: str, journal_api_url: str = "http://localhost:3000"):
        """Initialize Gemini client with function calling capabilities"""
        genai.configure(api_key=api_key)
        
        # Configure the model with function calling
        self.model = genai.GenerativeModel(
            model_name="gemini-pro",
            tools=JOURNAL_TOOLS
        )
        
        # Initialize journal API client
        self.journal_api = JournalAPI(journal_api_url)
        
        # Session memory (will be reset when app restarts)
        self.chat_history: List[Dict[str, Any]] = []
        self.chat_session = None
        
        # System prompt
        self.system_prompt = """
        You are a helpful AI assistant that can help users manage their personal journal. 

        Key capabilities:
        - You can create journal entries by calling the create_journal_entry function
        - You can retrieve past journal entries by calling the get_journal_entries function
        - You maintain conversation context within this session only
        - You're supportive, empathetic, and encourage reflection

        Guidelines:
        - When users share experiences, thoughts, or feelings, offer to save them as journal entries
        - Ask clarifying questions to help create meaningful journal entries
        - Suggest appropriate moods and tags based on the conversation
        - Help users reflect on their experiences
        - Be encouraging and supportive

        Available moods: amazing 🌟, happy 😊, okay 😐, sad 😔, angry 😠, excited 🎉, tired 😴, grateful 🙏
        """
    
    def start_chat(self):
        """Start a new chat session"""
        self.chat_session = self.model.start_chat(history=[])
        self.chat_history = []
    
    def send_message(self, message: str) -> Dict[str, Any]:
        """
        Send a message to Gemini and handle function calls
        
        Returns:
            Dict with response content and any function call results
        """
        if not self.chat_session:
            self.start_chat()
        
        try:
            # Send message to Gemini
            response = self.chat_session.send_message(
                f"{self.system_prompt}\n\nUser: {message}"
            )
            
            # Store user message in history
            self.chat_history.append({
                "role": "user", 
                "content": message,
                "timestamp": self._get_timestamp()
            })
            
            # Handle function calls if any
            function_results = []
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                    for part in candidate.content.parts:
                        if hasattr(part, 'function_call'):
                            # Execute function call
                            result = self._execute_function_call(part.function_call)
                            function_results.append(result)
            
            # Get the text response
            response_text = response.text if hasattr(response, 'text') else str(response)
            
            # Store assistant response in history
            self.chat_history.append({
                "role": "assistant",
                "content": response_text,
                "function_calls": function_results,
                "timestamp": self._get_timestamp()
            })
            
            return {
                "success": True,
                "response": response_text,
                "function_results": function_results,
                "chat_history_length": len(self.chat_history)
            }
            
        except Exception as e:
            error_msg = f"Error communicating with Gemini: {str(e)}"
            return {
                "success": False,
                "error": error_msg,
                "response": "Sorry, I encountered an error. Please try again."
            }
    
    def _execute_function_call(self, function_call) -> Dict[str, Any]:
        """Execute a function call from Gemini"""
        function_name = function_call.name
        args = {}
        
        # Parse function arguments
        if hasattr(function_call, 'args'):
            for key, value in function_call.args.items():
                args[key] = value
        
        try:
            if function_name == "create_journal_entry":
                result = self.journal_api.create_journal_entry(
                    content=args.get("content"),
                    title=args.get("title"),
                    mood=args.get("mood"),
                    tags=args.get("tags")
                )
                return {
                    "function": function_name,
                    "args": args,
                    "result": result
                }
                
            elif function_name == "get_journal_entries":
                result = self.journal_api.get_journal_entries(
                    date=args.get("date")
                )
                return {
                    "function": function_name,
                    "args": args,
                    "result": result
                }
                
            else:
                return {
                    "function": function_name,
                    "args": args,
                    "result": {
                        "success": False,
                        "error": f"Unknown function: {function_name}"
                    }
                }
                
        except Exception as e:
            return {
                "function": function_name,
                "args": args,
                "result": {
                    "success": False,
                    "error": f"Function execution error: {str(e)}"
                }
            }
    
    def _get_timestamp(self) -> str:
        """Get current timestamp for chat history"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def get_chat_history(self) -> List[Dict[str, Any]]:
        """Get the current chat history"""
        return self.chat_history
    
    def clear_history(self):
        """Clear chat history and start fresh"""
        self.chat_history = []
        self.chat_session = None