from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict

# --- User Schemas ---

class User(BaseModel):
    id: int
    username: str
    email: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr    

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

# --- Auth ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- Form Fields ---

class FormFieldBase(BaseModel):
    label: str
    field_type: str

class FormFieldCreate(FormFieldBase):
    pass

class FormFieldRead(FormFieldBase):
    id: int

    class Config:
        from_attributes = True

class FormFieldOut(BaseModel):
    id: int
    label: str
    field_type: str

    class Config:
        orm_mode = True

# --- Forms ---

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None
    fields: List[FormFieldCreate]

class FormOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    fields: List[FormFieldOut]
    creator: UserOut

class FormRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    fields: List[FormFieldRead]

    class Config:
        from_attributes = True

# --- Responses ---

class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str

class ResponseCreate(BaseModel):
    form_id: int
    answers: List[AnswerCreate]

class AnswerOut(BaseModel):
    question_id: int
    answer_text: str

    class Config:
        orm_mode = True

class ResponseOut(BaseModel):
    id: int
    responder: UserOut
    form: FormOut
    answers: List[AnswerOut]

    class Config:
        orm_mode = True

# --- Form Response as Dictionary (collaborative input) ---

class FieldAnswer(BaseModel):
    field_id: int
    value: str

class FormResponseCreate(BaseModel):
    answers: Dict[str, str]

    class Config:
        from_attributes = True
class FormResponseSchema(BaseModel):
    id: int
    form_id: int
    responder_id: int
    responses: Optional[str] = None  

    class Config:
        from_attributes = True
