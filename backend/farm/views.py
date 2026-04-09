from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDay
from datetime import timedelta
from django.utils import timezone
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
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        is_preorder = self.request.query_params.get('is_preorder')
        if is_preorder is not None:
            queryset = queryset.filter(is_preorder=is_preorder.lower() == 'true')
        return queryset

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
        
        # Get role from profile
        try:
            token['role'] = user.profile.role
        except:
            token['role'] = 'customer'

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

class FarmerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # More direct way to get the farmer profile
            farmer = Farmer.objects.get(user=request.user)
        except Farmer.DoesNotExist:
            return Response({"error": "User is not associated with any farmer profile"}, status=status.HTTP_404_NOT_FOUND)

        # 1. Total Products
        total_products = Product.objects.filter(farmer=farmer).count()

        # 2. Total Sales (from OrderItems)
        farmer_order_items = OrderItem.objects.filter(product__farmer=farmer)
        total_sales = farmer_order_items.aggregate(total=Sum(F('price') * F('quantity')))['total'] or 0

        # 3. Pending Orders
        order_pending = farmer_order_items.filter(order__status='Pending').count()

        # 4. Revenue Growth (Last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        revenue_growth = (
            farmer_order_items.filter(order__created_at__gte=seven_days_ago)
            .annotate(day=TruncDay('order__created_at'))
            .values('day')
            .annotate(revenue=Sum(F('price') * F('quantity')))
            .order_by('day')
        )
        
        days_map = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        revenue_data = []
        for rd in revenue_growth:
            revenue_data.append({
                "day": days_map[rd['day'].weekday()],
                "revenue": float(rd['revenue'])
            })

        # 5. Products Sales (by Category)
        products_sales = (
            farmer_order_items.values('product__category__name')
            .annotate(value=Count('id'))
            .order_by('-value')
        )
        sales_distribution = [
            {"name": ps['product__category__name'] or "Uncategorized", "value": ps['value']}
            for ps in products_sales
        ]

        # 6. Trending Products (Top 4)
        trending = (
            farmer_order_items.values('product__id', 'product__name', 'product__price')
            .annotate(sales=Sum(F('price') * F('quantity')))
            .order_by('-sales')[:4]
        )
        trending_products = []
        for t in trending:
            try:
                p_obj = Product.objects.get(id=t['product__id'])
                img_url = request.build_absolute_uri(p_obj.image_url.url) if p_obj.image_url else None
            except:
                img_url = None
                
            trending_products.append({
                "id": t['product__id'],
                "name": t['product__name'],
                "price": float(t['product__price']),
                "sales": float(t['sales']),
                "image": img_url
            })

        # 7. Recent Orders (Last 5)
        recent = (
            farmer_order_items.select_related('order', 'product')
            .order_by('-order__created_at')[:5]
        )
        recent_orders = []
        for r in recent:
            recent_orders.append({
                "product_name": r.product.name if r.product else "Unknown",
                "order_id": f"#{r.order.id}",
                "status": r.order.status
            })

        # 8. Full Farmer Profile for the Profile Page
        try:
            profile_obj = Profile.objects.get(user=request.user)
            phone = profile_obj.phone
        except Profile.DoesNotExist:
            phone = "Not provided"

        farmer_profile_data = {
            "farmer_name": farmer.name or request.user.get_full_name() or request.user.username,
            "farm_name": farmer.farm_name or f"{farmer.name}'s Farm",
            "email": request.user.email,
            "phone": phone,
            "location": farmer.location,
            "seller_since_yrs": farmer.seller_since_yrs,
            "date_joined": request.user.date_joined.strftime("%Y-%m-%d"),
            "image_url": request.build_absolute_uri(farmer.image_url.url) if farmer.image_url else None
        }

        return Response({
            "farmer_name": farmer.name or request.user.get_full_name() or request.user.username,
            "farm_name": farmer.farm_name or f"{farmer.name}'s Farm",
            "total_products": total_products,
            "total_sales": float(total_sales),
            "order_pending": order_pending,
            "revenue_growth": revenue_data,
            "products_sales": sales_distribution,
            "trending_products": trending_products,
            "recent_orders": recent_orders,
            "farmer_profile": farmer_profile_data
        })

class FarmerOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            farmer = Farmer.objects.get(user=request.user)
        except Farmer.DoesNotExist:
            return Response({"error": "Farmer profile not found"}, status=status.HTTP_404_NOT_FOUND)

        farmer_order_items = OrderItem.objects.filter(product__farmer=farmer).select_related('order', 'product').order_by('-order__created_at')
        
        orders_data = []
        for item in farmer_order_items:
            orders_data.append({
                "id": item.order.id,
                "product_name": item.product.name,
                "price": float(item.price * item.quantity),
                "status": item.order.status,
                "created_at": item.order.created_at
            })
        
        return Response(orders_data)

class FarmerProductListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            farmer = Farmer.objects.get(user=request.user)
        except Farmer.DoesNotExist:
            return Response({"error": "Farmer profile not found"}, status=status.HTTP_404_NOT_FOUND)

        products = Product.objects.filter(farmer=farmer).select_related('category')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class FarmerProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            farmer = Farmer.objects.get(user=request.user)
        except Farmer.DoesNotExist:
            return Response({"error": "Farmer profile not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        
        # 1. Update User model (Email)
        user = request.user
        if 'email' in data:
            user.email = data['email']
        
        # Split farmer_name into first_name and last_name if possible
        if 'farmer_name' in data:
            names = data['farmer_name'].split(' ', 1)
            user.first_name = names[0]
            if len(names) > 1:
                user.last_name = names[1]
            else:
                user.last_name = ""
        user.save()

        # 2. Update Farmer model
        if 'farmer_name' in data:
            farmer.name = data['farmer_name']
        if 'farm_name' in data:
            farmer.farm_name = data['farm_name']
        if 'location' in data:
            farmer.location = data['location']
        farmer.save()

        # 3. Update Profile model (Phone)
        # 4. Update Profile Image
        if 'image' in request.FILES:
            farmer.image_url = request.FILES['image']
            farmer.save()

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
