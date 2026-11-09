from pydantic import BaseModel, Field
class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
class AppointmentCreate(BaseModel):
    pet_type: str
    pet_name: str
    service: str
    appointment_date: str
    appointment_time: str
    owner_name: str
