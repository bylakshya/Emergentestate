from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Deal, DealCreate, UserResponse
from auth import get_current_user, require_role
from database import get_db
from utils import serialize_doc, serialize_docs
from datetime import datetime

router = APIRouter(prefix="/deals", tags=["deals"])

@router.get("/", response_model=List[dict])
async def get_deals(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get all deals for the current broker"""
    db = get_db()
    
    query = {"user_id": current_user.id}
    
    # Apply filters
    if status_filter:
        query["status"] = status_filter
    
    # Apply search
    if search:
        query["$or"] = [
            {"property_title": {"$regex": search, "$options": "i"}},
            {"customer_name": {"$regex": search, "$options": "i"}}
        ]
    
    deals = await db.deals.find(query).sort("created_at", -1).to_list(None)
    return serialize_docs(deals)

@router.post("/", response_model=dict)
async def create_deal(
    deal_data: DealCreate,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Create a new deal"""
    db = get_db()
    
    deal_dict = deal_data.dict()
    deal_dict["user_id"] = current_user.id
    deal_dict["start_date"] = datetime.utcnow()
    
    deal_obj = Deal(**deal_dict)
    result = await db.deals.insert_one(deal_obj.dict())
    
    created_deal = await db.deals.find_one({"_id": result.inserted_id})
    return serialize_doc(created_deal)

@router.get("/{deal_id}", response_model=dict)
async def get_deal(
    deal_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get a specific deal"""
    db = get_db()
    
    deal_data = await db.deals.find_one({
        "id": deal_id,
        "user_id": current_user.id
    })
    
    if not deal_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    return serialize_doc(deal_data)

@router.put("/{deal_id}", response_model=dict)
async def update_deal(
    deal_id: str,
    deal_data: DealCreate,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Update a deal"""
    db = get_db()
    
    # Check if deal exists and belongs to user
    existing_deal = await db.deals.find_one({
        "id": deal_id,
        "user_id": current_user.id
    })
    
    if not existing_deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    # Update deal
    update_data = deal_data.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    # If status is being changed to "Closed", set close_date
    if update_data.get("status") == "Closed" and not existing_deal.get("close_date"):
        update_data["close_date"] = datetime.utcnow()
    
    await db.deals.update_one(
        {"id": deal_id},
        {"$set": update_data}
    )
    
    updated_deal = await db.deals.find_one({"id": deal_id})
    return serialize_doc(updated_deal)

@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Delete a deal"""
    db = get_db()
    
    # Check if deal exists and belongs to user
    existing_deal = await db.deals.find_one({
        "id": deal_id,
        "user_id": current_user.id
    })
    
    if not existing_deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    await db.deals.delete_one({"id": deal_id})
    return {"message": "Deal deleted successfully"}

@router.get("/analytics/brokerage")
async def get_brokerage_analytics(
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get brokerage analytics data"""
    db = get_db()
    
    # Get monthly brokerage data for the last 6 months
    pipeline = [
        {"$match": {"user_id": current_user.id, "status": "Closed"}},
        {"$group": {
            "_id": {
                "year": {"$year": "$close_date"},
                "month": {"$month": "$close_date"}
            },
            "total_brokerage": {"$sum": {"$toDouble": {"$replaceAll": {
                "input": {"$replaceAll": {"input": "$brokerage_amount", "find": "₹", "replacement": ""}},
                "find": "Lakh", "replacement": ""
            }}}},
            "deals_count": {"$sum": 1}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}},
        {"$limit": 6}
    ]
    
    try:
        brokerage_data = await db.deals.aggregate(pipeline).to_list(None)
        
        # Format the data
        formatted_data = []
        for data in brokerage_data:
            month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            formatted_data.append({
                "month": month_names[data["_id"]["month"]],
                "amount": data["total_brokerage"] * 100000,  # Convert back to actual amount
                "deals_count": data["deals_count"]
            })
        
        return {"brokerage_data": formatted_data}
    except Exception as e:
        # Fallback to simple query if aggregation fails
        deals = await db.deals.find({
            "user_id": current_user.id,
            "status": "Closed"
        }).to_list(None)
        
        # Simple monthly calculation
        monthly_data = {}
        for deal in deals:
            if deal.get("close_date"):
                month_key = deal["close_date"].strftime("%b")
                if month_key not in monthly_data:
                    monthly_data[month_key] = {"amount": 0, "deals_count": 0}
                
                # Extract amount (simplified)
                brokerage_str = deal.get("brokerage_amount", "₹0")
                amount = float(brokerage_str.replace("₹", "").replace("Lakh", "").replace(",", "")) * 100000
                monthly_data[month_key]["amount"] += amount
                monthly_data[month_key]["deals_count"] += 1
        
        formatted_data = [{"month": k, **v} for k, v in monthly_data.items()]
        return {"brokerage_data": formatted_data}

@router.get("/export/csv")
async def export_deals_csv(
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Export deals as CSV"""
    db = get_db()
    
    deals = await db.deals.find({"user_id": current_user.id}).to_list(None)
    
    # Create CSV content
    csv_headers = ["Property Title", "Customer Name", "Status", "Deal Value", "Brokerage Amount", "Start Date", "Close Date", "Notes"]
    csv_rows = []
    
    for deal in deals:
        row = [
            deal.get("property_title", ""),
            deal.get("customer_name", ""),
            deal.get("status", ""),
            deal.get("deal_value", ""),
            deal.get("brokerage_amount", ""),
            deal.get("start_date", ""),
            deal.get("close_date", ""),
            deal.get("notes", "")
        ]
        csv_rows.append(",".join([f'"{item}"' for item in row]))
    
    csv_content = ",".join(csv_headers) + "\n" + "\n".join(csv_rows)
    
    return {
        "filename": f"deals_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        "content": csv_content
    }