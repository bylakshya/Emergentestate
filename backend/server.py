from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from datetime import datetime, timedelta
from typing import List, Optional

# Import our models and utilities
from models import *
from auth import *
from database import connect_to_mongo, close_mongo_connection, get_db
from utils import serialize_doc, serialize_docs, calculate_dashboard_stats, format_currency

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="RealEstate Pro API",
    description="Comprehensive Real Estate Management Platform",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Global database reference
db = None

@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection"""
    await connect_to_mongo()
    global db
    db = get_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection"""
    await close_mongo_connection()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "RealEstate Pro API - Version 1.0.0"}

# Authentication Routes
@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    """User registration"""
    # Check if passwords match
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict(exclude={"password", "confirm_password"})
    user_dict["password"] = hashed_password
    
    user = User(**user_dict)
    await db.users.insert_one(user.dict())
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user.dict())
    return TokenResponse(access_token=access_token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin):
    """User login"""
    # Find user by email
    user_data = await db.users.find_one({"email": user_credentials.email})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user_data["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data["id"]}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user_data)
    return TokenResponse(access_token=access_token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

# Dashboard Routes
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: UserResponse = Depends(get_current_user)):
    """Get dashboard statistics"""
    if current_user.role == "broker":
        # Calculate broker stats
        properties_count = await db.properties.count_documents({"user_id": current_user.id})
        customers_count = await db.customers.count_documents({"user_id": current_user.id})
        active_deals = await db.deals.count_documents({
            "user_id": current_user.id,
            "status": {"$nin": ["Closed", "Cancelled"]}
        })
        
        # Calculate brokerage amounts (this is simplified)
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        monthly_deals = await db.deals.find({
            "user_id": current_user.id,
            "status": "Closed",
            "close_date": {
                "$gte": datetime(current_year, current_month, 1),
                "$lt": datetime(current_year, current_month + 1, 1) if current_month < 12 else datetime(current_year + 1, 1, 1)
            }
        }).to_list(None)
        
        monthly_brokerage = sum([float(deal.get("brokerage_amount", "0").replace("₹", "").replace("Lakh", "").replace("Cr", "").replace(",", "")) for deal in monthly_deals])
        
        all_deals = await db.deals.find({
            "user_id": current_user.id,
            "status": "Closed"
        }).to_list(None)
        
        total_brokerage = sum([float(deal.get("brokerage_amount", "0").replace("₹", "").replace("Lakh", "").replace("Cr", "").replace(",", "")) for deal in all_deals])
        
        return BrokerStats(
            total_properties=properties_count,
            total_customers=customers_count,
            active_deals=active_deals,
            monthly_brokerage=format_currency(monthly_brokerage),
            total_brokerage=format_currency(total_brokerage)
        )
    
    else:  # builder
        projects_count = await db.projects.count_documents({"user_id": current_user.id})
        
        # Calculate plots statistics
        projects = await db.projects.find({"user_id": current_user.id}).to_list(None)
        total_plots = sum([project.get("total_plots", 0) for project in projects])
        sold_plots = sum([project.get("sold_plots", 0) for project in projects])
        
        # Calculate revenue (simplified)
        financial_records = await db.financial_records.find({
            "user_id": current_user.id
        }).to_list(None)
        
        current_month_revenue = 0
        total_revenue = 0
        
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        for record in financial_records:
            total_revenue += record.get("revenue", 0)
            if record.get("year") == current_year and record.get("month") == str(current_month):
                current_month_revenue += record.get("revenue", 0)
        
        return BuilderStats(
            total_projects=projects_count,
            total_plots=total_plots,
            sold_plots=sold_plots,
            monthly_revenue=format_currency(current_month_revenue),
            total_revenue=format_currency(total_revenue)
        )

# Include the router in the main app
app.include_router(api_router)
