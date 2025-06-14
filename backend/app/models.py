from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from pydantic import BaseModel, EmailStr
from datetime import datetime

# ---------- USER ----------
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))
    is_admin = Column(Boolean, default=False)

    forms = relationship("Form", back_populates="creator")
    responses = relationship("FormResponse", back_populates="responder")  # ✅ now valid

# ---------- FORM ----------
class Form(Base):
    __tablename__ = 'forms'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    creator_id = Column(Integer, ForeignKey('users.id'))

    creator = relationship("User", back_populates="forms")
    fields = relationship("FormField", back_populates="form", cascade="all, delete-orphan")
    responses = relationship("FormResponse", back_populates="form")

# ---------- FORM FIELD ----------
class FormField(Base):
    __tablename__ = 'form_fields'

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(200))
    field_type = Column(String(50))
    form_id = Column(Integer, ForeignKey('forms.id'))

    form = relationship("Form", back_populates="fields")

# ---------- FORM RESPONSE ----------
class FormResponse(Base):
    __tablename__ = "form_responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    responder_id = Column(Integer, ForeignKey("users.id"))  # ✅ Needed to fix NoForeignKeysError
    created_at = Column(DateTime, default=datetime.utcnow)

    form = relationship("Form", back_populates="responses")
    responder = relationship("User", back_populates="responses")  # ✅ Matches User.responses

    field_answers = relationship("FieldAnswer", back_populates="response", cascade="all, delete-orphan")
    user_responses = relationship("UserResponse", back_populates="response", cascade="all, delete-orphan")

# ---------- FIELD ANSWER ----------
class FieldAnswer(Base):
    __tablename__ = "field_answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("form_responses.id"))
    field_id = Column(Integer, ForeignKey("form_fields.id"))
    value = Column(String)

    response = relationship("FormResponse", back_populates="field_answers")

# ---------- USER RESPONSE ----------
class UserResponse(Base):
    __tablename__ = "user_responses"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("form_responses.id"))
    field_id = Column(Integer, ForeignKey("form_fields.id"))
    answer = Column(Text)
    value = Column(String)

    response = relationship("FormResponse", back_populates="user_responses")
    field = relationship("FormField")

# ---------- Pydantic Schemas ----------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True  # Pydantic v2 replacement for orm_mode
