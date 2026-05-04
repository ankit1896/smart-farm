from django.core.management.base import BaseCommand
from farm.models import MarketPrice
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds the database with a comprehensive list of government commodities from Agmarknet'

    def handle(self, *args, **options):
        vegetables = [
            "Ashgourd", "Bitter gourd", "Bottle gourd", "Little gourd (Kundru)", "Pointed gourd (Parval)", 
            "Ridge Gourd", "Snakeguard", "Ribbed Celery", "Amaranthus", "Ambat Chuka", "Coriander (Leaves)", 
            "Curry Leaf", "Methi", "Mint (Pudina)", "Spinach", "Swiss Chard", "Beetroot", "Carrot", 
            "Colacasia", "Elephant Yam (Suran)", "Potato", "Raddish", "Sweet Potato", "Tapioca", 
            "Taro (Arvi)", "Cluster beans", "Cowpea (Veg)", "Double Beans", "French Beans", "Green Avare", 
            "Guar", "Sem", "Soya Chunks", "Bhindi (Ladies Finger)", "Brinjal", "Cabbage", "Capsicum", 
            "Cauliflower", "Drumstick", "Garlic", "Ginger (Green)", "Green Chilli", "Lemon", "Mashrooms", 
            "Onion", "Pumpkin", "Tomato", "Aloe Vera", "Bamboo Shoot", "Brocoli", "Jackfruit (Raw)", 
            "Knool Khol", "Lotus Sticks", "Red Cabbage", "Tinda"
        ]
        fruits = [
            "Apple", "Banana", "Mango", "Orange", "Papaya", "Pomegranate", "Grapes", "Guava", "Jackfruit", 
            "Lemon", "Lime", "Mousambi", "Pear", "Pineapple", "Sapota", "Water Melon"
        ]
        dairy = ["Milk", "Paneer", "Ghee", "Butter", "Curd"]
        others = ["Wheat", "Paddy", "Rice", "Maize", "Bajra", "Jowar", "Ragi", "Barley", "Arhar (Tur)", "Bengal Gram (Gram)", "Black Gram (Urd)", "Green Gram (Moong)", "Lentil (Masur)", "Mustard", "Groundnut", "Soyabean", "Sunflower", "Sesamum"]

        import random
        def seed_list(names, category_name):
            count = 0
            for name in names:
                # Use random realistic prices: 30-80 Rs/kg (stored as 3000-8000 Rs/Quintal)
                modal = random.randint(30, 80) * 100
                min_p = modal - random.randint(5, 15) * 100
                max_p = modal + random.randint(5, 15) * 100
                
                obj, created = MarketPrice.objects.update_or_create(
                    commodity=name,
                    defaults={
                        'market': 'Government Standard',
                        'state': 'India',
                        'district': 'Standard',
                        'min_price': min_p,
                        'max_price': max_p,
                        'modal_price': modal,
                        'date': timezone.now().date(),
                    }
                )
                if created:
                    count += 1
            return count

        v_count = seed_list(vegetables, 'vegetable')
        f_count = seed_list(fruits, 'fruit')
        d_count = seed_list(dairy, 'dairy')
        o_count = seed_list(others, 'other')

        self.stdout.write(self.style.SUCCESS(f'Seeded: Veg({v_count}), Fruit({f_count}), Dairy({d_count}), Others({o_count}). Total: {MarketPrice.objects.count()}'))
