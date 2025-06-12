from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Customer, CustomerCreate, UserResponse
from auth import get_current_user, require_role
from database import get_db
from utils import serialize_doc, serialize_docs
from datetime import datetime

router = APIRouter(prefix="/customers", tags=["customers"])

@router.get("/", response_model=List[dict])
async def get_customers(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get all customers for the current broker"""
    db = get_db()
    
    query = {"user_id": current_user.id}
    
    # Apply filters
    if status_filter:
        query["status"] = status_filter
    
    # Apply search
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    
    customers = await db.customers.find(query).sort("created_at", -1).to_list(None)
    return serialize_docs(customers)

@router.post("/", response_model=dict)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Create a new customer"""
    db = get_db()
    
    customer_dict = customer_data.dict()
    customer_dict["user_id"] = current_user.id
    
    customer_obj = Customer(**customer_dict)
    result = await db.customers.insert_one(customer_obj.dict())
    
    created_customer = await db.customers.find_one({"_id": result.inserted_id})
    return serialize_doc(created_customer)

@router.get("/{customer_id}", response_model=dict)
async def get_customer(
    customer_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get a specific customer"""
    db = get_db()
    
    customer_data = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user.id
    })
    
    if not customer_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return serialize_doc(customer_data)

@router.put("/{customer_id}", response_model=dict)
async def update_customer(
    customer_id: str,
    customer_data: CustomerCreate,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Update a customer"""
    db = get_db()
    
    # Check if customer exists and belongs to user
    existing_customer = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user.id
    })
    
    if not existing_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Update customer
    update_data = customer_data.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.customers.update_one(
        {"id": customer_id},
        {"$set": update_data}
    )
    
    updated_customer = await db.customers.find_one({"id": customer_id})
    return serialize_doc(updated_customer)

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Delete a customer"""
    db = get_db()
    
    # Check if customer exists and belongs to user
    existing_customer = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user.id
    })
    
    if not existing_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    await db.customers.delete_one({"id": customer_id})
    return {"message": "Customer deleted successfully"}

@router.patch("/{customer_id}/important", response_model=dict)
async def toggle_important_customer(
    customer_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Toggle important customer status"""
    db = get_db()
    
    customer_data = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user.id
    })
    
    if not customer_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    new_important_status = not customer_data.get("is_important", False)
    
    await db.customers.update_one(
        {"id": customer_id},
        {"$set": {"is_important": new_important_status, "updated_at": datetime.utcnow()}}
    )
    
    updated_customer = await db.customers.find_one({"id": customer_id})
    return serialize_doc(updated_customer)

@router.get("/export/csv")
async def export_customers_csv(
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Export customers as CSV"""
    db = get_db()
    
    customers = await db.customers.find({"user_id": current_user.id}).to_list(None)
    
    # Create CSV content
    csv_headers = ["Name", "Phone", "Email", "Budget", "Status", "Interest", "Notes", "Added Date"]
    csv_rows = []
    
    for customer in customers:
        row = [
            customer.get("name", ""),
            customer.get("phone", ""),
            customer.get("email", ""),
            customer.get("budget", ""),
            customer.get("status", ""),
            customer.get("interest", ""),
            customer.get("notes", ""),
            customer.get("created_at", "")
        ]
        csv_rows.append(",".join([f'"{item}"' for item in row]))
    
    csv_content = ",".join(csv_headers) + "\n" + "\n".join(csv_rows)
    
    return {
        "filename": f"customers_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        "content": csv_content
    }