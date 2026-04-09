from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Farmer, Product, Order, OrderItem, Profile, Address

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class FarmerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Farmer
        fields = ['id', 'name', 'farm_name', 'location', 'rating', 'is_verified', 'seller_since_yrs', 'image_url']

    def get_image_url(self, obj):
        if obj.image_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_url.url)
            return obj.image_url.url
        return None

class FarmerDetailSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    products = serializers.SerializerMethodField()
    class Meta:
        model = Farmer
        fields = ['id', 'name', 'farm_name', 'location', 'rating', 'is_verified', 'seller_since_yrs', 'image_url', 'products']

    def get_image_url(self, obj):
        if obj.image_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_url.url)
            return obj.image_url.url
        return None

    def get_products(self, obj):
        products = obj.products.all()
        return ProductSerializer(products, many=True, context=self.context).data

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    farmer = FarmerSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'category', 'farmer', 'name', 'price', 'discount_price', 'weight', 'is_organic', 'rating', 'is_preorder', 'harvest_date', 'image_url']

    def get_image_url(self, obj):
        if obj.image_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_url.url)
            return obj.image_url.url
        return None

class RegisteSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    is_farmer = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'confirm_password', 'is_farmer']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data

    def create(self, validated_data):
        confirm_password = validated_data.pop('confirm_password')
        is_farmer = validated_data.pop('is_farmer', False)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        # Create Profile with role
        Profile.objects.create(
            user=user, 
            role='farmer' if is_farmer else 'customer'
        )

        # Create Farmer if flag is true
        if is_farmer:
            Farmer.objects.create(
                user=user,
                name=f"{user.first_name} {user.last_name}".strip() or user.username,
                farm_name=f"{user.first_name}'s Farm",
                location="Update Location",
                seller_since_yrs=0
            )

        return user

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['product', 'product_details', 'quantity', 'price', 'weight']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'total_amount', 'shipping_address', 'shipping_address_snapshot', 'address', 'is_preorder', 'items']
        read_only_fields = ['user', 'created_at', 'status', 'shipping_address_snapshot']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Snapshot the shipping address if provided
        shipping_address = validated_data.get('shipping_address')
        if shipping_address:
            validated_data['shipping_address_snapshot'] = {
                'full_name': shipping_address.full_name,
                'phone': shipping_address.phone,
                'house_no': shipping_address.house_no,
                'area': shipping_address.area,
                'landmark': shipping_address.landmark,
                'city': shipping_address.city,
                'state': shipping_address.state,
                'postal_code': shipping_address.postal_code,
                'address_type': shipping_address.address_type,
            }
        
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'user', 'full_name', 'address_type', 'house_no', 'area', 'landmark', 'address', 'city', 'state', 'postal_code', 'phone', 'is_default']
        read_only_fields = ('user',)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['phone', 'user_details', 'stats']

    def get_stats(self, obj):
        user = obj.user
        total_orders = Order.objects.filter(user=user).count()
        pending_orders = Order.objects.filter(user=user, status='Pending').count()
        return {
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'wishlist_count': 0
        }
