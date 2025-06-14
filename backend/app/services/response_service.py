from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Form, FormResponse, User
from app.schemas import ResponseCreate, FormResponseCreate

def submit_response(form_id: int, response: ResponseCreate, db: Session, user: User):
    """Simple response storage (flat structure)"""
    new_response = FormResponse(
        form_id=form_id,
        responder_id=user.id,
        responses=response.responses
    )
    db.add(new_response)
    db.commit()
    db.refresh(new_response)
    return new_response

def submit_form_response(form_id: int, response_data: FormResponseCreate, db: Session, current_user: User):
    """Structured form response (per-question answers)"""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    response = FormResponse(form_id=form_id, responder_id=current_user.id)
    db.add(response)
    db.commit()
    db.refresh(response)

    for field_id_str, value in response_data.answers.items():
        try:
            question_id = int(field_id_str)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid question ID format")

        answer = Answer(
            response_id=response.id,
            question_id=question_id,
            answer_text=value
        )
        db.add(answer)

    db.commit()
    db.refresh(response)
    return response

def get_all_responses(db: Session):
    return db.query(FormResponse).all()
