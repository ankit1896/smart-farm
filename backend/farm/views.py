from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Category, Farmer, Product, Order, OrderItem, Profile, Address
from .serializers import (
    CategorySerializer, FarmerSerializer, FarmerDetailSerializer, ProductSerializer, 
    RegisteSerializer, OrderSerializer, AddressSerializer, ProfileSerializer
)
from rest_framework import generics, permissions, status, viewsets
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'

class FarmerListView(generics.ListAPIView):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

class FarmerDetailView(generics.RetrieveAPIView):
    queryset = Farmer.objects.all()
    serializer_class = FarmerDetailSerializer
    lookup_field = 'id'

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Create your views here.

def home(request):
        return Response({"message": "Welcome to the home page"}, status=status.HTTP_200_OK)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"message": "Welcome to the protected page"}, status=status.HTTP_200_OK)

class RegisterView(APIView):
    
    def post(self, request):
        serializer = RegisteSerializer(data= request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Add custom fields
        token['username'] = user.username
        token['email'] = user.email
        token['fullname'] = f"{user.first_name} {user.last_name}".strip() or user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related(
            'items__product__farmer',
            'items__product__category'
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


