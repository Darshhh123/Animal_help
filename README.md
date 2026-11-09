# AnimalCare AI (Angular + FastAPI)

## Requirements
Python 3.10+, Node.js 18+.

## Backend (PowerShell)
```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Add your Gemini API key to backend/.env
uvicorn app.main:app --reload
```
Swagger: http://127.0.0.1:8000/docs

## Frontend (second terminal)
```powershell
cd frontend
npm install
npm start
```
Open http://localhost:4200

Appointments are stored in backend/animalcare.db (SQLite). This is a demo and does not
check a real clinic calendar. Pet-care information is educational, not diagnosis or treatment.
