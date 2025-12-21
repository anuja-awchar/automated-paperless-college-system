from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # allow any user to register (or maybe restrictive? For now allow any for testing)
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
