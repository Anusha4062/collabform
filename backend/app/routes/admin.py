from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas import FormCreate, FormRead
from app.services.form_service import create_form
from app.auth.dependencies import get_current_user
from app.models import User

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/forms", response_model=FormRead)
def create_form_route(
    form: FormCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can create forms.")
    return create_form(form, db, current_user)
