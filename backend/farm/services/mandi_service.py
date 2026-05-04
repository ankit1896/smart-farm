import os
import json
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from django.conf import settings
from farm.models import MarketPrice, Farmer, Product
import difflib

class MandiItem(BaseModel):
    commodity: str
    market: str
    district: str
    state: str
    min_price: float
    max_price: float
    modal_price: float
    date: str

class MandiExtraction(BaseModel):
    items: List[MandiItem]

class MandiAIService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def extract_from_text(self, raw_text: str, current_date: Optional[str] = None) -> List[MandiItem]:
        """
        Uses Gemini Pro to extract Mandi prices from unstructured text/html.
        """
        today = current_date or date.today().isoformat()
        prompt = f"""
        Extract daily market (Mandi) price data from the following text.
        IMPORTANT: These are WHOLESALE prices. 
        - If prices are per quintal (100kg), keep them as is. 
        - If prices are per crate or box, estimate the weight or mark it clearly.
        - The target date is {today}.
        
        Return the data as a list of items with: commodity, market, district, state, min_price, max_price, modal_price, and date.
        
        Text:
        {raw_text}
        """
        
        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=MandiExtraction
            )
        )
        
        try:
            data = json.loads(response.text)
            items = data.get("items", [])
            # Ensure date is set correctly if Gemini missed it
            for item in items:
                if not item.get('date'):
                    item['date'] = today
            return items
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return []

    def sync_to_db(self, items: List[MandiItem]):
        """
        Saves extracted items to the MarketPrice model.
        """
        for item in items:
            MarketPrice.objects.update_or_create(
                commodity=item.commodity,
                market=item.market,
                date=item.date,
                defaults={
                    'district': item.district,
                    'state': item.state,
                    'min_price': item.min_price,
                    'max_price': item.max_price,
                    'modal_price': item.modal_price,
                }
            )

    @staticmethod
    def get_nearby_markets(farmer: Farmer) -> List[str]:
        """
        Identify nearby Mandis based on farmer location string.
        Logic: Extract city/district from "Sector 62, Noida, UP"
        """
        if not farmer.location:
            return []
            
        location_parts = [p.strip().lower() for p in farmer.location.split(',')]
        
        # Known mandis in NCR and major cities
        major_mandis = {
            "noida": ["noida", "dadri", "sahibabad", "dankaur"],
            "delhi": ["azadpur", "keshopur", "shahdara", "delhi"],
            "ghaziabad": ["sahibabad", "ghaziabad"],
            "pune": ["pune", "gultekdi", "manjri"],
            "ranchi": ["ranchi", "pandra"]
        }
        
        matches = []
        for city, mandis in major_mandis.items():
            if any(city in p for p in location_parts):
                matches.extend([m.capitalize() for m in mandis])
        
        # Fallback to general area if no direct match
        if not matches:
            # Simple heuristic: return the most likely district name found
            return [location_parts[-2].capitalize()] if len(location_parts) > 1 else []
            
        return matches

    HINDI_TO_ENGLISH_MAP = {
        # Vegetables
        'bhindi': 'Okra',
        'ladyfinger': 'Okra',
        'okara': 'Okra',
        'okra': 'Okra',
        'aloo': 'Potato',
        'आलू': 'Potato',
        'potato': 'Potato',
        'gajar': 'Carrot',
        'गाजर': 'Carrot',
        'carrot': 'Carrot',
        'adrak': 'Ginger',
        'अदरक': 'Ginger',
        'ginger': 'Ginger',
        'tamatar': 'Tomato',
        'टमाटर': 'Tomato',
        'tomato': 'Tomato',
        'pyaaz': 'Onion',
        'प्याज': 'Onion',
        'pyaj': 'Onion',
        'onion': 'Onion',
        'brinjal': 'Brinjal',
        'बैंगन': 'Brinjal',
        'baingan': 'Brinjal',
        'cauliflower': 'Cauliflower',
        'फूलगोभी': 'Cauliflower',
        'phoolgobhi': 'Cauliflower',
        'capsicum': 'Capsicum',
        'shimla mirch': 'Capsicum',
        'शिमला मिर्च': 'Capsicum',
        'garlic': 'Garlic',
        'lehsun': 'Garlic',
        'लहसुन': 'Garlic',
        'chilli': 'Green Chilli',
        'mirch': 'Green Chilli',
        'pumpkin': 'Pumpkin',
        'kaddu': 'Pumpkin',
        
        # Fruits
        'apple': 'Apple',
        'सेब': 'Apple',
        'seb': 'Apple',
        'banana': 'Banana',
        'केला': 'Banana',
        'kela': 'Banana',
        'mango': 'Mango',
        'आम': 'Mango',
        'aam': 'Mango',
        'orange': 'Orange',
        'संतरा': 'Orange',
        'santra': 'Orange',
        'papaya': 'Papaya',
        'पपीता': 'Papaya',
        'papita': 'Papaya',
        'lemon': 'Lemon',
        'nimboo': 'Lemon',
        'नींबू': 'Lemon',
        
        # Dairy
        'milk': 'Milk',
        'दूध': 'Milk',
        'doodh': 'Milk',
        'cow milk': 'Milk',
        'buffalo milk': 'Milk',
        'paneer': 'Paneer',
        'पनीर': 'Paneer',
        'cheese': 'Paneer',
        'ghee': 'Ghee',
        'घी': 'Ghee',
        'butter': 'Butter',
        'मक्खन': 'Butter',
        'curd': 'Curd',
        'दही': 'Curd',
        'dahi': 'Curd'
    }

    def normalize_commodity_name(self, name: str) -> str:
        # 1. Clean and check manual map first (Instant)
        clean_name = name.lower().strip()
        
        # Exact Substring Match
        for hindi, english in self.HINDI_TO_ENGLISH_MAP.items():
            if hindi in clean_name:
                return english

        # 2. Fuzzy Typo Match (High Accuracy Spellchecker)
        possible_keys = list(self.HINDI_TO_ENGLISH_MAP.keys())
        # cutoff=0.7 means it allows minor typos (e.g. 'okara' -> 'okra', 'brinjal' -> 'brinjal')
        matches = difflib.get_close_matches(clean_name, possible_keys, n=1, cutoff=0.7)
        if matches:
            return self.HINDI_TO_ENGLISH_MAP[matches[0]]

        # 2. AI Fallback (Flexible)
        prompt = f"Extract only the primary English commodity name from this string: '{name}'. Output a single word only (e.g., Potato, Tomato, Ginger)."
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def get_market_benchmark(self, product: Product):
        """
        Calculates a benchmark price for a product based on nearby market data.
        """
        farmer = product.farmer
        
        # 1. Normalize commodity name using our AI-enhanced mapper
        # This handles "Fresh Tomato", "Aloo", "Organic Bhindi" etc.
        commodity_keyword = self.normalize_commodity_name(product.name)
        
        if not farmer:
            # Fallback to general market if no farmer is linked to the product
            prices = MarketPrice.objects.filter(
                commodity__icontains=commodity_keyword
            ).order_by('-date')
            
            if not prices.exists():
                return None
            
            latest = prices.first()
            return {
                "market_name": latest.market,
                "modal_price": round(float(latest.modal_price) / 100, 2),
                "range": (round(float(latest.min_price) / 100, 2), round(float(latest.max_price) / 100, 2)),
                "date": latest.date,
                "is_local": False
            }

        # 2. Identify specifically mapped nearby markets
        nearby_markets = self.get_nearby_markets(farmer)
        
        # 3. Primary Search: Match Normalized Commodity + Local Markets
        prices = MarketPrice.objects.filter(
            commodity__icontains=commodity_keyword,
            market__in=nearby_markets
        ).order_by('-date')
        
        # 4. Fallback 1: Broaden search to District or State if local mandi data is missing
        if not prices.exists() and farmer.location:
            location_parts = [p.strip() for p in farmer.location.split(',')]
            # Try matching district or state names found in the location string
            for part in reversed(location_parts):
                if len(part) < 3: continue # Skip small words
                
                # Try matching as district
                dist_prices = MarketPrice.objects.filter(
                    commodity__icontains=commodity_keyword,
                    district__icontains=part
                ).order_by('-date')
                if dist_prices.exists():
                    prices = dist_prices
                    break
                
                # Try matching as state
                state_prices = MarketPrice.objects.filter(
                    commodity__icontains=commodity_keyword,
                    state__icontains=part
                ).order_by('-date')
                if state_prices.exists():
                    prices = state_prices
                    break

        # 5. Fallback 2: Any available market for this commodity (Nationwide Benchmark)
        if not prices.exists():
            prices = MarketPrice.objects.filter(
                commodity__icontains=commodity_keyword
            ).order_by('-date')

        # 6. Final Fallback: AI Discovery (Dynamic Search Simulation)
        # If still no data, we use AI to "discover" a realistic benchmark
        if not prices.exists():
            discovered = self.discover_market_data(commodity_keyword, farmer.location if farmer else "India")
            if discovered:
                return discovered

        if not prices.exists():
            return None
            
        # Get the latest entry
        latest = prices.first()
        
        # Intelligent price calculation: 
        # Mandi data is usually per Quintal (100kg), we convert to per kg
        def format_price(p):
            p = float(p)
            return round(p / 100, 2) if p > 500 else round(p, 2)

        is_local = latest.market in nearby_markets or (farmer.location and (latest.district in farmer.location or latest.state in farmer.location))

        return {
            "market_name": latest.market,
            "modal_price": format_price(latest.modal_price),
            "range": (format_price(latest.min_price), format_price(latest.max_price)),
            "date": latest.date,
            "is_local": is_local
        }

    def discover_market_data(self, commodity: str, location: str):
        """
        Uses AI to 'discover' or estimate realistic market prices when hard data is missing.
        This ensures the user always gets a benchmark.
        """
        today = date.today().isoformat()
        prompt = f"""
        Provide the current realistic Mandi (Wholesale) market price for '{commodity}' in '{location}'.
        If exact data for today ({today}) is unavailable, provide a highly realistic estimate based on seasonal trends in India.
        
        Return exactly ONE item in JSON format. Prices must be in INR per QUINTAL (100kg).
        - market: A major Mandi name in that region.
        - district: The district name.
        - state: The state name.
        - min_price: Min wholesale price per quintal.
        - max_price: Max wholesale price per quintal.
        - modal_price: Average wholesale price per quintal.
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=MandiItem
                )
            )
            
            data = json.loads(response.text)
            # Create a MarketPrice object from the AI discovery
            price_obj = MarketPrice.objects.create(
                commodity=commodity.capitalize(),
                market=data.get('market', 'Regional Mandi'),
                district=data.get('district', ''),
                state=data.get('state', ''),
                min_price=data.get('min_price'),
                max_price=data.get('max_price'),
                modal_price=data.get('modal_price'),
                date=today
            )
            
            # Format and return immediately
            def format_p(p): return round(float(p) / 100, 2) if float(p) > 500 else round(float(p), 2)
            
            return {
                "market_name": price_obj.market,
                "modal_price": format_p(price_obj.modal_price),
                "range": (format_p(price_obj.min_price), format_p(price_obj.max_price)),
                "date": price_obj.date,
                "is_local": True,
                "source": "AI Market Insight"
            }
        except Exception as e:
            print(f"Discovery error: {e}")
            return None


    def fetch_and_sync(self):
        """
        Simulates fetching live data from a Mandi portal and syncing it to the DB.
        In a real scenario, this would use requests to fetch a URL like agmarknet.gov.in.
        """
        # Simulated raw HTML/Text from a Mandi portal
        simulated_raw_data = """
        Daily Market Report - April 29, 2024
        Market: Noida, State: UP, District: Gautam Budh Nagar
        Tomato: Min 2000, Max 2500, Modal 2200 (per Quintal)
        Potato: Min 1500, Max 1800, Modal 1600 (per Quintal)
        Onion: Min 2200, Max 2800, Modal 2500 (per Quintal)
        
        Market: Azadpur, State: Delhi, District: Delhi
        Tomato: Min 1800, Max 2400, Modal 2100 (per Quintal)
        Okra: Min 3000, Max 4000, Modal 3500 (per Quintal)
        Ginger: Min 8000, Max 10000, Modal 9000 (per Quintal)
        
        Market: Gultekdi, State: Maharashtra, District: Pune
        Tomato: Min 1500, Max 2000, Modal 1800 (per Quintal)
        Banana: Min 2000, Max 3000, Modal 2500 (per Quintal)
        """
        
        # Extract items using AI
        extracted_items = self.extract_from_text(simulated_raw_data)
        
        if extracted_items:
            # Sync to database
            self.sync_to_db(extracted_items)
            return len(extracted_items)
        return 0


