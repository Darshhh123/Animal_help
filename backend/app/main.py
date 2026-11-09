import os, uuid
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from .database import connect, init_db
from .schemas import ChatRequest, AppointmentCreate

load_dotenv(Path(__file__).resolve().parents[1] / '.env')
app = FastAPI(title='AnimalCare AI API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:4200'],
                   allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
init_db()

@app.get('/api/health')
def health():
    return {'status': 'ok'}

@app.post('/api/chat')
def chat(body: ChatRequest):
    key = os.getenv('GEMINI_API_KEY')
    if not key:
        return {'reply': 'Add GEMINI_API_KEY to backend/.env to enable AI answers. I can help with general cat and dog care information. For urgent symptoms, contact a veterinarian.'}
    try:
        client = genai.Client(api_key=key)
        prompt = ('You are AnimalCare AI for cats and dogs. Give concise, safe educational pet-care '
                  'information. Never diagnose, prescribe medicines or doses. For breathing difficulty, '
                  'collapse, seizures, poisoning or severe pain, advise immediate veterinary care. User: '
                  + body.message)
        result = client.models.generate_content(
            model=os.getenv('GEMINI_MODEL', 'gemini-2.5-flash'), contents=prompt)
        return {'reply': result.text or 'Please try asking in another way.'}
    except Exception:
        raise HTTPException(status_code=502, detail='AI service temporarily unavailable.')

@app.post('/api/appointments')
def create_appointment(body: AppointmentCreate):
    if body.pet_type.lower() not in ('dog', 'cat'):
        raise HTTPException(status_code=400, detail='Pet type must be dog or cat.')
    booking_id = 'AC-' + uuid.uuid4().hex[:8].upper()
    with connect() as conn:
        conn.execute('''INSERT INTO appointments
        (booking_id, pet_type, pet_name, service, appointment_date, appointment_time, owner_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (booking_id, body.pet_type.lower(), body.pet_name, body.service,
         body.appointment_date, body.appointment_time, body.owner_name))
    return {'booking_id': booking_id, 'message': 'Demo appointment saved.'}

@app.get('/api/appointments')
def list_appointments():
    with connect() as conn:
        rows = conn.execute('SELECT * FROM appointments ORDER BY id DESC').fetchall()
    return [dict(row) for row in rows]

@app.put('/api/appointments/{booking_id}/cancel')
def cancel_appointment(booking_id: str):
    with connect() as conn:
        cur = conn.execute("UPDATE appointments SET status='Cancelled' WHERE booking_id=? AND status='Booked'", (booking_id,))
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail='Active booking not found.')
    return {'message': 'Appointment cancelled.'}
