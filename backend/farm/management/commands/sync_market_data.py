from django.core.management.base import BaseCommand
from farm.services.mandi_service import MandiAIService
import json

class Command(BaseCommand):
    help = 'Sync Mandi market prices using AI extraction'

    def add_arguments(self, parser):
        parser.add_argument('--text', type=str, help='Raw market bulletin text to parse')
        parser.add_argument('--report-file', type=str, help='Path to a file containing the market report')
        parser.add_argument('--mock', action='store_true', help='Seed with mock Noida data')
        parser.add_argument('--live', action='store_true', help='Perform a live sync (requires report text or file)')

    def handle(self, *args, **options):
        service = MandiAIService()
        
        if options['mock']:
            self.stdout.write(self.style.SUCCESS("Seeding mock Noida market data..."))
            mock_data = [
                {
                    "commodity": "Potato", "market": "Noida", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 1800.0, "max_price": 2200.0, 
                    "modal_price": 2000.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Potato", "market": "Dadri", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 1700.0, "max_price": 2100.0, 
                    "modal_price": 1900.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Tomato", "market": "Noida", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 2500.0, "max_price": 3000.0, 
                    "modal_price": 2800.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Okra", "market": "Noida", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 3000.0, "max_price": 4000.0, 
                    "modal_price": 3500.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Cauliflower", "market": "Noida", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 2000.0, "max_price": 2600.0, 
                    "modal_price": 2300.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Brinjal", "market": "Noida", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 1200.0, "max_price": 1600.0, 
                    "modal_price": 1400.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Apple", "market": "Sahibabad", "district": "Ghaziabad", 
                    "state": "Uttar Pradesh", "min_price": 8000.0, "max_price": 12000.0, 
                    "modal_price": 10000.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Banana", "market": "Noida", "district": "Gautam Buddh Nagar", 
                    "state": "Uttar Pradesh", "min_price": 2500.0, "max_price": 3500.0, 
                    "modal_price": 3000.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Potato", "market": "Azadpur", "district": "New Delhi", 
                    "state": "Delhi", "min_price": 900.0, "max_price": 1300.0, 
                    "modal_price": 1100.0, "date": "2026-04-09"
                },
                {
                    "commodity": "Banana", "market": "Gultekdi", "district": "Pune", 
                    "state": "Maharashtra", "min_price": 2400.0, "max_price": 3200.0, 
                    "modal_price": 2800.0, "date": "2026-04-09"
                }
            ]
            from farm.services.mandi_service import MandiItem
            items = [MandiItem(**item) for item in mock_data]
            service.sync_to_db(items)
            self.stdout.write(self.style.SUCCESS(f"Successfully synced {len(items)} mock entries."))
            return

        raw_text = options.get('text')
        report_file = options.get('report_file')
        
        if report_file:
            try:
                with open(report_file, 'r') as f:
                    raw_text = f.read()
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error reading report file: {e}"))
                return
                
        if not raw_text:
            self.stdout.write(self.style.WARNING("No input text provided. Use --text, --report-file or --mock."))
            return

        source_label = "Live Mandi Feed" if options['live'] else "AI Analysis"
        self.stdout.write(f"Sending data to Gemini Pro for extraction ({source_label})...")
        items = service.extract_from_text(raw_text)
        
        if not items:
            self.stdout.write(self.style.ERROR("AI extraction failed or returned no items."))
            return

        service.sync_to_db(items)
        self.stdout.write(self.style.SUCCESS(f"Successfully synced {len(items)} items to the database."))
