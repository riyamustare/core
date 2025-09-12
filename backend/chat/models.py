from django.db import models
import json

class ChatSession(models.Model):
    user_id = models.CharField(max_length=255)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    conversation = models.JSONField()  # Stores the full conversation
    summary = models.TextField(null=True, blank=True)  # Stores the AI-generated summary
    emotions = models.JSONField(default=list)  # Stores identified emotions
    topics = models.JSONField(default=list)  # Stores identified topics

    def set_conversation(self, conversation_list):
        self.conversation = json.dumps(conversation_list)

    def get_conversation(self):
        return json.loads(self.conversation)
