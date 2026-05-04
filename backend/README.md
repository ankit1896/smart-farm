# Backend Setup

This is the Django backend for the Smart Farm project.

## Requirements

- Python 3
- pip
- virtual environment

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
