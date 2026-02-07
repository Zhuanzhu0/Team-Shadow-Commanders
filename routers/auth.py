from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserLogin, OTPVerify, Token
from auth import get_password_hash, verify_password, create_access_token, generate_otp, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    otp = generate_otp()
    
    # In a real app, send OTP via email here.
    print(f"--- MOCK EMAIL --- To: {user.email}, OTP: {otp}")
    
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        is_verified=False,
        otp_secret=otp
    )
    db.add(new_user)
    db.commit()
    return {"message": "OTP sent to email", "mock_otp": otp} # Returning mock_otp for testing

@router.post("/verify-otp")
def verify_otp(otp_data: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.otp_secret != otp_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    user.is_verified = True
    user.otp_secret = None # Clear OTP after use
    db.commit()
    return {"message": "Account verified successfully"}

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Account not verified. Please verify OTP.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
