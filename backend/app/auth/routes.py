from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth_services import register_user, authenticate_user, get_db
from app.auth.utils import create_access_token
from app.schemas import UserCreate, UserRead
from app.models import User
from app.auth.dependencies import get_current_user 

router = APIRouter()

# --- Register a new user ---
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.auth_services import register_user, authenticate_user, get_db
from app.models import User

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = register_user(user, db)
        
        admin_count = db.query(User).filter(User.is_admin == True).count()
        
        if admin_count == 0:
            new_user.is_admin = True
            db.commit()
            db.refresh(new_user)
        
        return new_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_admin": current_user.is_admin
    }

@router.post("/make-admin/{username}")
def make_user_admin(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can promote users")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_admin = True
    db.commit()

    return {"message": f" User '{username}' has been made an admin."}
