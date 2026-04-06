from django.contrib import admin
from .models import Category, Farmer, Product, Order, OrderItem, Profile, Address

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'rating', 'is_verified')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'weight', 'is_organic', 'is_preorder')
    list_filter = ('category', 'is_organic', 'is_preorder')
    search_fields = ('name',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'status', 'total_amount', 'is_preorder')
    list_filter = ('status', 'is_preorder')
    inlines = [OrderItemInline]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'address_type', 'city', 'is_default')
    list_filter = ('address_type', 'is_default')
