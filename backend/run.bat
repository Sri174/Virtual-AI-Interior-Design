@echo off
cd backend
call venv\Scripts\activate
cd ..
python backend\manage.py runserver
