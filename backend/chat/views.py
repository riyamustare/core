import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    temperature=0,
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

system_prompt = """
You are Core, a compassionate AI companion focused on supportive listening and emotional reflection.

Your approach should be:
1. Empathetic Understanding:
   - Listen attentively to the user's emotions and experiences
   - Reflect back their feelings with genuine understanding
   - Validate their experiences without judgment

2. Thoughtful Responses:
   - Respond naturally and conversationally
   - Vary your responses rather than using the same template
   - Ask relevant follow-up questions that show you're truly listening

3. Emotional Support:
   - Create a safe space for expression
   - Show genuine interest in their well-being
   - Acknowledge both spoken and unspoken emotions

4. Conversation Flow:
   - Balance between listening and gentle guidance
   - Use open-ended questions to explore thoughts and feelings
   - Allow natural pauses for reflection

5. Professional Boundaries:
   - Maintain appropriate emotional support without attempting diagnosis
   - If crisis situations arise, recommend professional help
   - Be clear about your role as a supportive listener, not a replacement for therapy

Keep your tone warm, genuine, and conversational while maintaining appropriate boundaries.
"""

from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ChatSession

@api_view(["GET"])
def session_history(request):
    try:
        user_id = request.query_params.get('user_id')
        sessions = ChatSession.objects.filter(user_id=user_id).order_by('-start_time')
        
        sessions_data = [{
            'id': session.id,
            'start_time': session.start_time,
            'end_time': session.end_time,
            'summary': session.summary,
            'emotions': session.emotions,
            'topics': session.topics,
            'conversation': session.conversation
        } for session in sessions]
        
        return Response(sessions_data)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)

@api_view(["POST"])
def chat_view(request):
    try:
        action = request.data.get("action", "chat")
        user_input = request.data.get("message")
        conversation_history = request.data.get("history", [])
        user_id = request.data.get("user_id")

        if action == "end_session":
            # Generate session summary
            summary_prompt = """
            Based on the conversation history below, create a comprehensive therapy session summary that includes:
            1. Key emotions identified (with emoji)
            2. Main topics discussed (with emoji)
            3. Core insights and progress made
            4. Thoughtful reflection on the user's journey
            
            Format the summary in a clear, empathetic way that helps the user reflect on their session.
            
            Conversation History:
            {conversation}
            """
            
            formatted_conversation = "\n".join([
                f"{'User' if msg[0] == 'human' else 'AI'}: {msg[1]}"
                for msg in conversation_history
            ])

            summary_messages = [
                ("system", summary_prompt),
                ("human", formatted_conversation)
            ]
            
            summary_prompt_template = ChatPromptTemplate.from_messages([
                {"role": msg[0], "content": msg[1]} for msg in summary_messages
            ])
            
            summary_response = llm.invoke(summary_prompt_template.format(
                conversation=formatted_conversation
            ))
            summary = summary_response.content if hasattr(summary_response, 'content') else str(summary_response)

            # Extract emotions and topics (you could make this more sophisticated)
            emotions = ["😓 pressured", "😌 relieved", "🤔 contemplative"]
            topics = ["💼 career", "💰 finances", "👣 progress", "🧠 self-reflection"]

            # Save session to database
            session = ChatSession.objects.create(
                user_id=user_id,
                conversation=conversation_history,
                summary=summary,
                emotions=emotions,
                topics=topics,
                end_time=datetime.now()
            )

            return Response({
                "summary": summary,
                "emotions": emotions,
                "topics": topics,
                "session_id": session.id
            })

        else:  # Normal chat message
            # Format the conversation history for the LLM
            formatted_messages = [
                ("system", system_prompt),
            ]

            # Add conversation history
            for msg_type, content in conversation_history:
                formatted_messages.append((msg_type, content))

            # Add the current user message
            formatted_messages.append(("human", user_input))

            # Create the chat prompt
            prompt = ChatPromptTemplate.from_messages([
                {"role": msg[0], "content": msg[1]} for msg in formatted_messages
            ])

            # Get response from LLM
            response = llm.invoke(prompt.format_messages(user_input=user_input))
            ai_response = response.content if hasattr(response, 'content') else str(response)

            # Update conversation history
            conversation_history.append(("human", user_input))
            conversation_history.append(("assistant", ai_response))

            return Response({
                "reply": ai_response,
                "history": conversation_history
            })

    except Exception as e:
        print(f"Error in chat_view: {str(e)}")  # For debugging
        return Response({
            "error": "An error occurred while processing your message.",
            "details": str(e)
        }, status=500)
