from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import ResponseCreate, FormResponseCreate
from app.services.auth_services import get_db, get_current_user
from app.services import response_service
from app.models import User

router = APIRouter()

@router.post("/forms/{form_id}/submit")
def submit_response_form_submit(
    form_id: int,
    response: ResponseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return response_service.submit_response(form_id, response, db, user)

@router.post("/forms/{form_id}/responses")
def submit_response_form_responses(
    form_id: int,
    response_data: FormResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return response_service.submit_form_response(form_id, response_data, db, current_user)

@router.get("/forms/all-responses")
def get_all_responses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can view all responses")
    return response_service.get_all_responses(db)
