from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Property, PropertyCreate, UserResponse
from auth import get_current_user, require_role
from database import get_db
from utils import serialize_doc, serialize_docs
from datetime import datetime

router = APIRouter(prefix="/properties", tags=["properties"])

@router.get("/", response_model=List[dict])
async def get_properties(
    area: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get all properties for the current broker"""
    db = get_db()
    
    query = {"user_id": current_user.id}
    
    # Apply filters
    if area:
        query["area"] = area
    if property_type:
        query["type"] = property_type
    if status:
        query["status"] = status
    
    # Apply search
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"address": {"$regex": search, "$options": "i"}},
            {"area": {"$regex": search, "$options": "i"}}
        ]
    
    properties = await db.properties.find(query).sort("created_at", -1).to_list(None)
    return serialize_docs(properties)

@router.post("/", response_model=dict)
async def create_property(
    property_data: PropertyCreate,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Create a new property"""
    db = get_db()
    
    property_dict = property_data.dict()
    property_dict["user_id"] = current_user.id
    
    property_obj = Property(**property_dict)
    result = await db.properties.insert_one(property_obj.dict())
    
    created_property = await db.properties.find_one({"_id": result.inserted_id})
    return serialize_doc(created_property)

@router.get("/{property_id}", response_model=dict)
async def get_property(
    property_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get a specific property"""
    db = get_db()
    
    property_data = await db.properties.find_one({
        "id": property_id,
        "user_id": current_user.id
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return serialize_doc(property_data)

@router.put("/{property_id}", response_model=dict)
async def update_property(
    property_id: str,
    property_data: PropertyCreate,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Update a property"""
    db = get_db()
    
    # Check if property exists and belongs to user
    existing_property = await db.properties.find_one({
        "id": property_id,
        "user_id": current_user.id
    })
    
    if not existing_property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Update property
    update_data = property_data.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.properties.update_one(
        {"id": property_id},
        {"$set": update_data}
    )
    
    updated_property = await db.properties.find_one({"id": property_id})
    return serialize_doc(updated_property)

@router.delete("/{property_id}")
async def delete_property(
    property_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Delete a property"""
    db = get_db()
    
    # Check if property exists and belongs to user
    existing_property = await db.properties.find_one({
        "id": property_id,
        "user_id": current_user.id
    })
    
    if not existing_property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    await db.properties.delete_one({"id": property_id})
    return {"message": "Property deleted successfully"}

@router.patch("/{property_id}/hot", response_model=dict)
async def toggle_hot_property(
    property_id: str,
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Toggle hot property status"""
    db = get_db()
    
    property_data = await db.properties.find_one({
        "id": property_id,
        "user_id": current_user.id
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    new_hot_status = not property_data.get("is_hot", False)
    
    await db.properties.update_one(
        {"id": property_id},
        {"$set": {"is_hot": new_hot_status, "updated_at": datetime.utcnow()}}
    )
    
    updated_property = await db.properties.find_one({"id": property_id})
    return serialize_doc(updated_property)

@router.get("/areas/list")
async def get_property_areas(
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get list of all areas where user has properties"""
    db = get_db()
    
    areas = await db.properties.distinct("area", {"user_id": current_user.id})
    return {"areas": areas}

@router.get("/types/list")
async def get_property_types(
    current_user: UserResponse = Depends(require_role(["broker"]))
):
    """Get list of all property types for user"""
    db = get_db()
    
    types = await db.properties.distinct("type", {"user_id": current_user.id})
    return {"types": types}