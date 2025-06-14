from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import FormCreate, FormRead, FormResponseCreate
from app.services.form_service import (
    create_form,
    get_user_forms,
    submit_response,
    get_all_responses,
)
from app.services.auth_services import get_current_user, get_db
from app.models import User, Form

router = APIRouter()


@router.post("/", response_model=FormRead)
def create_form_route(
    form: FormCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_form(db=db, form=form, user=current_user)


@router.get("/", response_model=list[FormRead])
def get_forms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_forms(db=db, user=current_user)


@router.get("/{form_id}", response_model=FormRead)
def get_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


@router.post("/{form_id}/responses")
def submit_response_route(
    form_id: int,
    response_data: FormResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return submit_response(db=db, form_id=form_id, response=response_data, user=current_user)


@router.get("/{form_id}/responses")
def get_form_responses(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_responses(db=db, form_id=form_id, user=current_user)
