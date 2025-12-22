from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from deps import get_db
from database.models import User
from sqlalchemy import select
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import os
from typing import Optional
import uuid
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

# Initialize Firebase Admin SDK using environment variables
if not firebase_admin._apps:
    try:
        # Get Firebase credentials from environment variables
        firebase_project_id = os.getenv('FIREBASE_PROJECT_ID')
        firebase_client_email = os.getenv('FIREBASE_CLIENT_EMAIL')
        firebase_private_key = os.getenv('FIREBASE_PRIVATE_KEY')
        
        # Validate that all required environment variables are present
        if not all([firebase_project_id, firebase_client_email, firebase_private_key]):
            raise ValueError("Missing required Firebase environment variables")
        
        # Replace escaped newlines in private key
        firebase_private_key = firebase_private_key.replace('\\n', '\n')
        
        # Create credentials dictionary
        firebase_credentials = {
            "type": "service_account",
            "project_id": firebase_project_id,
            "private_key": firebase_private_key,
            "client_email": firebase_client_email,
            "token_uri": "https://oauth2.googleapis.com/token"
        }
        
        # Initialize Firebase Admin SDK
        cred = credentials.Certificate(firebase_credentials)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {str(e)}")
        print("Token verification will fail. Please check your Firebase environment variables.")

# Pydantic models
class SignupRequest(BaseModel):
    firebase_uid: str
    email: EmailStr
    full_name: Optional[str] = None
    photo_url: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    company: Optional[str] = None

class UserResponse(BaseModel):
    id: UUID
    firebase_uid: str
    email: str
    full_name: Optional[str]
    company: Optional[str]
    photo_url: Optional[str]
    created_at: Optional[datetime]  # accept real datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Dependency to get current user from Firebase token


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = credentials.credentials

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        firebase_uid = decoded_token["uid"]

        # FIX: async SQLAlchemy query
        result = await db.execute(
            select(User).where(User.firebase_uid == firebase_uid)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found in database"
            )

        return user

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """
    Create a new user in the database after Firebase signup.
    This endpoint is called by the frontend after successful Firebase authentication.
    """
    # Check if user already exists
    result = await db.execute(
        select(User).where(
            (User.firebase_uid == request.firebase_uid) |
            (User.email == request.email)
        )
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        # Yes → return existing user
        return existing_user

    # Create new user
    new_user = User(
        id=uuid.uuid4(),
        firebase_uid=request.firebase_uid,
        email=request.email,
        full_name=request.full_name,
        photo_url=request.photo_url
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    """
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the current user's profile information.
    """
    if request.full_name is not None:
        current_user.full_name = request.full_name
    
    if request.company is not None:
        current_user.company = request.company
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint. Firebase handles token invalidation on the client side.
    This endpoint can be used for any server-side cleanup if needed.
    """
    return {"message": "Logged out successfully"}

@router.post("/verify-token")
async def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verify if the provided Firebase token is valid.
    """
    return {"valid": True, "user_id": str(current_user.id)}
