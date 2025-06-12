from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Notification, NotificationCreate, UserResponse
from auth import get_current_user
from database import get_db
from utils import serialize_doc, serialize_docs
from datetime import datetime

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[dict])
async def get_notifications(
    is_read: Optional[bool] = Query(None),
    type_filter: Optional[str] = Query(None, alias="type"),
    limit: int = Query(50, le=100),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get notifications for the current user"""
    db = get_db()
    
    query = {"user_id": current_user.id}
    
    # Apply filters
    if is_read is not None:
        query["is_read"] = is_read
    if type_filter:
        query["type"] = type_filter
    
    notifications = await db.notifications.find(query)\
        .sort("created_at", -1)\
        .limit(limit)\
        .to_list(None)
    
    return serialize_docs(notifications)

@router.post("/", response_model=dict)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new notification"""
    db = get_db()
    
    notification_dict = notification_data.dict()
    notification_dict["user_id"] = current_user.id
    
    notification_obj = Notification(**notification_dict)
    result = await db.notifications.insert_one(notification_obj.dict())
    
    created_notification = await db.notifications.find_one({"_id": result.inserted_id})
    return serialize_doc(created_notification)

@router.patch("/{notification_id}/read", response_model=dict)
async def mark_notification_read(
    notification_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Mark a notification as read"""
    db = get_db()
    
    notification_data = await db.notifications.find_one({
        "id": notification_id,
        "user_id": current_user.id
    })
    
    if not notification_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    await db.notifications.update_one(
        {"id": notification_id},
        {"$set": {"is_read": True, "updated_at": datetime.utcnow()}}
    )
    
    updated_notification = await db.notifications.find_one({"id": notification_id})
    return serialize_doc(updated_notification)

@router.patch("/mark-all-read")
async def mark_all_notifications_read(
    current_user: UserResponse = Depends(get_current_user)
):
    """Mark all notifications as read for the current user"""
    db = get_db()
    
    result = await db.notifications.update_many(
        {"user_id": current_user.id, "is_read": False},
        {"$set": {"is_read": True, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": f"Marked {result.modified_count} notifications as read"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a notification"""
    db = get_db()
    
    notification_data = await db.notifications.find_one({
        "id": notification_id,
        "user_id": current_user.id
    })
    
    if not notification_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    await db.notifications.delete_one({"id": notification_id})
    return {"message": "Notification deleted successfully"}

@router.get("/unread/count")
async def get_unread_notifications_count(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get count of unread notifications"""
    db = get_db()
    
    count = await db.notifications.count_documents({
        "user_id": current_user.id,
        "is_read": False
    })
    
    return {"unread_count": count}