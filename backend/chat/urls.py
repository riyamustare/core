from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat_view, name='chat'),
    path('sessions/', views.session_history, name='session_history'),
]
