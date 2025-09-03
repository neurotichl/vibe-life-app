import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional


class JournalAPI:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url.rstrip('/')
    
    def create_journal_entry(
        self, 
        content: str, 
        title: Optional[str] = None, 
        mood: Optional[str] = None, 
        tags: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Create a new journal entry via the journal app API
        
        Args:
            content: The main journal content (required)
            title: Optional title for the entry
            mood: Mood category (amazing, happy, okay, sad, angry, excited, tired, grateful)
            tags: List of tags to categorize the entry
            
        Returns:
            Dict containing the created journal entry or error info
        """
        url = f"{self.base_url}/api/journal"
        
        payload = {
            "content": content
        }
        
        if title:
            payload["title"] = title
        if mood:
            payload["mood"] = mood
        if tags:
            payload["tags"] = tags
            
        try:
            response = requests.post(
                url, 
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "data": response.json(),
                    "message": "Journal entry created successfully! 📝"
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "message": "Failed to create journal entry"
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Could not connect to journal app. Make sure it's running on localhost:3000"
            }
    
    def get_journal_entries(self, date: Optional[str] = None) -> Dict[str, Any]:
        """
        Get journal entries, optionally filtered by date
        
        Args:
            date: Optional date in YYYY-MM-DD format
            
        Returns:
            Dict containing entries or error info
        """
        url = f"{self.base_url}/api/journal"
        
        params = {}
        if date:
            params["date"] = date
            
        try:
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                entries = response.json()
                return {
                    "success": True,
                    "data": entries,
                    "message": f"Found {len(entries)} journal entries"
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "message": "Failed to fetch journal entries"
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Could not connect to journal app"
            }


# Define tools for Gemini function calling
JOURNAL_TOOLS = [
    {
        "name": "create_journal_entry",
        "description": "Create a new journal entry in the user's personal journal app. Use this when the user wants to record thoughts, experiences, or reflections.",
        "parameters": {
            "type": "object",
            "properties": {
                "content": {
                    "type": "string",
                    "description": "The main content of the journal entry. This should be the user's thoughts, experiences, or reflections."
                },
                "title": {
                    "type": "string",
                    "description": "Optional title for the journal entry"
                },
                "mood": {
                    "type": "string",
                    "enum": ["amazing", "happy", "okay", "sad", "angry", "excited", "tired", "grateful"],
                    "description": "The user's mood when making this entry"
                },
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Tags to categorize the journal entry (e.g., work, personal, travel, learning)"
                }
            },
            "required": ["content"]
        }
    },
    {
        "name": "get_journal_entries",
        "description": "Retrieve journal entries from the user's personal journal. Use this when the user wants to review past entries or when you need context about their previous thoughts.",
        "parameters": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "description": "Optional date in YYYY-MM-DD format to filter entries for a specific day"
                }
            }
        }
    }
]

# Available mood options with emojis for user reference
MOOD_OPTIONS = {
    "amazing": "🌟",
    "happy": "😊", 
    "okay": "😐",
    "sad": "😔",
    "angry": "😠",
    "excited": "🎉",
    "tired": "😴",
    "grateful": "🙏"
}