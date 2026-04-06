import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from farm.models import Category, Farmer, Product

# Clear existing data
Product.objects.all().delete()
Farmer.objects.all().delete()
Category.objects.all().delete()

# Create Categories
c_dairy = Category.objects.create(name="Dairy Products", slug="dairy")
c_veg = Category.objects.create(name="Fresh Vegetables", slug="vegetables")
c_fruit = Category.objects.create(name="Fresh Fruits", slug="fruits")

# Create Farmers
f1 = Farmer.objects.create(
    name="Rajesh Patil", 
    location="Ranchi", 
    rating=4.5, 
    is_verified=True, 
    seller_since_yrs=3,
    image_url="https://images.unsplash.com/photo-1595822527581-d1af6a9cb999?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
)
f2 = Farmer.objects.create(
    name="Suresh Kumar", 
    location="Pune", 
    rating=4.8, 
    is_verified=True, 
    seller_since_yrs=5,
    image_url="https://images.unsplash.com/photo-1530836369250-ef71a3f5e48c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
)
f3 = Farmer.objects.create(
    name="Amit Singh", 
    location="Delhi", 
    rating=4.2, 
    is_verified=False, 
    seller_since_yrs=1,
    image_url="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
)
f4 = Farmer.objects.create(
    name="Ramesh Yadav", 
    location="Mumbai", 
    rating=4.9, 
    is_verified=True, 
    seller_since_yrs=8,
    image_url="https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
)

# Create Products
Product.objects.create(
    category=c_veg,
    farmer=f1,
    name="Fresh Organic Tomatoes",
    price=40.00,
    discount_price=35.00,
    weight="1kg",
    is_organic=True,
    rating=4.8,
    image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
)
Product.objects.create(
    category=c_veg,
    farmer=f2,
    name="Crispy Green Cabbage",
    price=30.00,
    discount_price=25.00,
    weight="1kg",
    is_organic=True,
    rating=4.5,
    image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba65e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
)
Product.objects.create(
    category=c_dairy,
    farmer=f4,
    name="Pure Cow Milk",
    price=60.00,
    weight="1 Liter",
    is_organic=False,
    rating=4.9,
    image_url="https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
)
Product.objects.create(
    category=c_fruit,
    farmer=f3,
    name="Sweet Farm Apples",
    price=120.00,
    discount_price=100.00,
    weight="1kg",
    is_organic=True,
    rating=4.7,
    image_url="https://images.unsplash.com/photo-1560806887-1e4cd0b6fc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
)

print("Database successfully seeded with Farmers and Products!")
