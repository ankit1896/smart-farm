"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from farm.views import (
    ProductListView, ProductDetailView, FarmerListView, FarmerDetailView,
    CategoryListView, RegisterView, home, ProtectedView, 
    MyTokenObtainPairView, OrderListCreateView, OrderDetailView, AddressViewSet, UserProfileView,
    GoogleLogin
)
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', home, name='home'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/protected/', ProtectedView.as_view(), name='protected'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
   #path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/farmers/', FarmerListView.as_view(), name='farmer-list'),
    path('api/farmers/<int:id>/', FarmerDetailView.as_view(), name='farmer-detail'),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('api/orders/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/social/login/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
