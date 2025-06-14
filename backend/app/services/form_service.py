from sqlalchemy.orm import Session
from app.models import Form, FormField, FormResponse, FieldAnswer 
from app.schemas import FormCreate, FormResponseCreate
from app.models import User
from fastapi import HTTPException

def create_form(db: Session, form: FormCreate, user: User):
    db_form = Form(title=form.title, description=form.description, creator_id=user.id)
    db.add(db_form)
    db.commit()
    db.refresh(db_form)

    for field in form.fields:
        db_field = FormField(
            form_id=db_form.id,
            label=field.label,
            field_type=field.field_type
        )
        db.add(db_field)
    db.commit()
    return db_form


def get_user_forms(db: Session, user: User):
    return db.query(Form).filter(Form.creator_id == user.id).all()


def submit_response(db: Session, form_id: int, response: FormResponseCreate, user: User):
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    # Create the new form response
    new_response = FormResponse(form_id=form_id, user_id=user.id)
    db.add(new_response)
    db.commit()
    db.refresh(new_response)

    # Store answers
    for field_label, answer_value in response.answers.items():
        field = db.query(FormField).filter(FormField.form_id == form_id, FormField.label == field_label).first()
        if not field:
            raise HTTPException(status_code=400, detail=f"Field '{field_label}' not found in form")

        answer = FieldAnswer(
            response_id=new_response.id,
            field_id=field.id,
            answer=answer_value
        )
        db.add(answer)

    db.commit()
    return {"message": "Response submitted successfully"}


def get_all_responses(db: Session, form_id: int, user: User):
    form = db.query(Form).filter(Form.id == form_id, Form.creator_id == user.id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found or unauthorized")
    
    responses = (
        db.query(FormResponse)
        .filter(FormResponse.form_id == form_id)
        .all()
    )
    
    result = []
    for response in responses:
        answers = (
            db.query(FieldAnswer)
            .filter(FieldAnswer.response_id == response.id)
            .all()
        )
        result.append({
            "response_id": response.id,
            "created_at": response.created_at,
            "answers": [
                {
                    "field_id": ans.field_id,
                    "value": ans.value
                }
                for ans in answers
            ]
        })
    return result