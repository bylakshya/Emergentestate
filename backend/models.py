from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums
class UserRole(str, Enum):
    BROKER = "broker"
    BUILDER = "builder"

class PropertyStatus(str, Enum):
    FOR_SALE = "For Sale"
    FOR_RENT = "For Rent"

class PropertyType(str, Enum):
    VILLA = "Villa"
    APARTMENT = "Apartment"
    PLOT = "Plot"
    HOUSE = "House"

class CustomerStatus(str, Enum):
    INTERESTED = "Interested"
    CALL = "Call"
    VISIT = "Visit"
    VISIT_DONE = "Visit Done"
    FOLLOW_UP = "Follow-up"
    DEAL_LOST = "Deal Lost"
    CLOSED = "Closed"

class DealStatus(str, Enum):
    INTERESTED = "Interested"
    CALL = "Call"
    VISIT_DONE = "Visit Done"
    FOLLOW_UP = "Follow-up"
    CANCELLED = "Cancelled"
    FINALIZED = "Finalized"
    AGREEMENT = "Agreement"
    REGISTRY = "Registry"
    BROKERAGE_RECEIVED = "Brokerage Received"

class PlotStatus(str, Enum):
    AVAILABLE = "Available"
    RESERVED = "Reserved"
    SOLD = "Sold"

class PaymentStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"
    OVERDUE = "Overdue"

class NotificationType(str, Enum):
    PAYMENT = "payment"
    FOLLOWUP = "followup"
    INQUIRY = "inquiry"
    MEETING = "meeting"

# Base Models
class BaseDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User Models
class User(BaseDocument):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    is_active: bool = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str
    full_name: str
    phone: Optional[str] = None
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

# Property Models
class PropertyOwner(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None

class Property(BaseDocument):
    user_id: str
    title: str
    type: PropertyType
    status: PropertyStatus
    price: str
    size: str
    facing: str
    address: str
    area: str
    bedrooms: int = 0
    bathrooms: int = 0
    is_hot: bool = False
    has_garden: bool = False
    is_corner: bool = False
    vastu_compliant: bool = False
    owner: PropertyOwner
    images: List[str] = []
    next_follow_up: Optional[datetime] = None
    deal_status: DealStatus = DealStatus.INTERESTED
    brokerage_amount: str

class PropertyCreate(BaseModel):
    title: str
    type: PropertyType
    status: PropertyStatus
    price: str
    size: str
    facing: str
    address: str
    area: str
    bedrooms: int = 0
    bathrooms: int = 0
    is_hot: bool = False
    has_garden: bool = False
    is_corner: bool = False
    vastu_compliant: bool = False
    owner: PropertyOwner
    images: List[str] = []
    next_follow_up: Optional[datetime] = None
    deal_status: DealStatus = DealStatus.INTERESTED
    brokerage_amount: str

# Customer Models
class Customer(BaseDocument):
    user_id: str
    name: str
    phone: str
    email: Optional[str] = None
    budget: str
    interest: str
    status: CustomerStatus = CustomerStatus.INTERESTED
    is_important: bool = False
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    budget: str
    interest: str
    status: CustomerStatus = CustomerStatus.INTERESTED
    is_important: bool = False
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None

# Deal Models
class Deal(BaseDocument):
    user_id: str
    property_id: str
    customer_id: str
    property_title: str
    customer_name: str
    status: DealStatus
    deal_value: str
    brokerage_amount: str
    start_date: datetime
    close_date: Optional[datetime] = None
    notes: Optional[str] = None

class DealCreate(BaseModel):
    property_id: str
    customer_id: str
    property_title: str
    customer_name: str
    status: DealStatus
    deal_value: str
    brokerage_amount: str
    notes: Optional[str] = None

# Project Models (for Builders)
class Payment(BaseModel):
    date: datetime
    amount: str
    type: str  # Booking, Installment, Token, etc.
    status: PaymentStatus

class PlotBuyer(BaseModel):
    name: str
    phone: str
    govt_id: str
    broker: Optional[str] = None

class Plot(BaseModel):
    plot_number: str
    size: str
    price: str
    facing: str
    status: PlotStatus
    has_garden: bool = False
    is_corner: bool = False
    is_hot: bool = False
    buyer: Optional[PlotBuyer] = None
    payments: List[Payment] = []

class Project(BaseDocument):
    user_id: str
    name: str
    area: str
    total_plots: int
    sold_plots: int = 0
    available_plots: int
    reserved_plots: int = 0
    price_range: str
    layout_approval: str
    completion_date: datetime
    plots: List[Plot] = []

class ProjectCreate(BaseModel):
    name: str
    area: str
    total_plots: int
    available_plots: int
    price_range: str
    layout_approval: str
    completion_date: datetime

# Builder Customer Models
class BuilderCustomer(BaseDocument):
    user_id: str
    name: str
    phone: str
    email: Optional[str] = None
    budget: str
    interest: str
    status: CustomerStatus
    project: Optional[str] = None
    plot_number: Optional[str] = None
    notes: Optional[str] = None

class BuilderCustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    budget: str
    interest: str
    status: CustomerStatus
    project: Optional[str] = None
    plot_number: Optional[str] = None
    notes: Optional[str] = None

# Team Models (for Builders)
class TeamMember(BaseDocument):
    user_id: str
    name: str
    email: EmailStr
    role: str
    phone: str
    join_date: datetime
    permissions: List[str] = []

class TeamMemberCreate(BaseModel):
    name: str
    email: EmailStr
    role: str
    phone: str
    permissions: List[str] = []

# Financial Models
class FinancialRecord(BaseDocument):
    user_id: str
    month: str
    year: int
    revenue: float
    expenses: float
    profit: float
    category: str  # sales, marketing, operations, etc.

class FinancialRecordCreate(BaseModel):
    month: str
    year: int
    revenue: float
    expenses: float
    category: str

# Notification Models
class Notification(BaseDocument):
    user_id: str
    title: str
    message: str
    type: NotificationType
    is_read: bool = False
    related_id: Optional[str] = None  # ID of related entity (customer, property, etc.)

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: NotificationType
    related_id: Optional[str] = None

# Event/Calendar Models
class Event(BaseDocument):
    user_id: str
    title: str
    type: str  # visit, call, meeting, documentation, registry
    date: datetime
    time: str
    customer: str
    phone: str
    location: str
    notes: Optional[str] = None
    status: str = "scheduled"  # scheduled, completed, cancelled

class EventCreate(BaseModel):
    title: str
    type: str
    date: datetime
    time: str
    customer: str
    phone: str
    location: str
    notes: Optional[str] = None

# Analytics Models
class BrokerageAnalytics(BaseModel):
    user_id: str
    month: str
    amount: float
    deals_count: int
    properties_count: int

# Response Models
class MessageResponse(BaseModel):
    message: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Dashboard Stats
class BrokerStats(BaseModel):
    total_properties: int
    total_customers: int
    active_deals: int
    monthly_brokerage: str
    total_brokerage: str

class BuilderStats(BaseModel):
    total_projects: int
    total_plots: int
    sold_plots: int
    monthly_revenue: str
    total_revenue: str