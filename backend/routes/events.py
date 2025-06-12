from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Event, EventCreate, UserResponse
from auth import get_current_user
from database import get_db
from utils import serialize_doc, serialize_docs
from datetime import datetime, date

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[dict])
async def get_events(
    date_filter: Optional[str] = Query(None),
    type_filter: Optional[str] = Query(None, alias="type"),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get events for the current user"""
    db = get_db()
    
    query = {"user_id": current_user.id}
    
    # Apply filters
    if date_filter:
        try:
            filter_date = datetime.strptime(date_filter, "%Y-%m-%d").date()
            start_datetime = datetime.combine(filter_date, datetime.min.time())
            end_datetime = datetime.combine(filter_date, datetime.max.time())
            query["date"] = {"$gte": start_datetime, "$lte": end_datetime}
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use YYYY-MM-DD"
            )
    
    if type_filter:
        query["type"] = type_filter
    if status_filter:
        query["status"] = status_filter
    
    events = await db.events.find(query).sort("date", 1).to_list(None)
    return serialize_docs(events)

@router.post("/", response_model=dict)
async def create_event(
    event_data: EventCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new event"""
    db = get_db()
    
    event_dict = event_data.dict()
    event_dict["user_id"] = current_user.id
    
    event_obj = Event(**event_dict)
    result = await db.events.insert_one(event_obj.dict())
    
    created_event = await db.events.find_one({"_id": result.inserted_id})
    return serialize_doc(created_event)

@router.get("/{event_id}", response_model=dict)
async def get_event(
    event_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific event"""
    db = get_db()
    
    event_data = await db.events.find_one({
        "id": event_id,
        "user_id": current_user.id
    })
    
    if not event_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return serialize_doc(event_data)

@router.put("/{event_id}", response_model=dict)
async def update_event(
    event_id: str,
    event_data: EventCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update an event"""
    db = get_db()
    
    # Check if event exists and belongs to user
    existing_event = await db.events.find_one({
        "id": event_id,
        "user_id": current_user.id
    })
    
    if not existing_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Update event
    update_data = event_data.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.events.update_one(
        {"id": event_id},
        {"$set": update_data}
    )
    
    updated_event = await db.events.find_one({"id": event_id})
    return serialize_doc(updated_event)

@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete an event"""
    db = get_db()
    
    # Check if event exists and belongs to user
    existing_event = await db.events.find_one({
        "id": event_id,
        "user_id": current_user.id
    })
    
    if not existing_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    await db.events.delete_one({"id": event_id})
    return {"message": "Event deleted successfully"}

@router.patch("/{event_id}/complete", response_model=dict)
async def mark_event_completed(
    event_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Mark an event as completed"""
    db = get_db()
    
    event_data = await db.events.find_one({
        "id": event_id,
        "user_id": current_user.id
    })
    
    if not event_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    await db.events.update_one(
        {"id": event_id},
        {"$set": {"status": "completed", "updated_at": datetime.utcnow()}}
    )
    
    updated_event = await db.events.find_one({"id": event_id})
    return serialize_doc(updated_event)

@router.get("/today/list")
async def get_today_events(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get today's events"""
    db = get_db()
    
    today = date.today()
    start_datetime = datetime.combine(today, datetime.min.time())
    end_datetime = datetime.combine(today, datetime.max.time())
    
    events = await db.events.find({
        "user_id": current_user.id,
        "date": {"$gte": start_datetime, "$lte": end_datetime}
    }).sort("time", 1).to_list(None)
    
    return serialize_docs(events)

@router.get("/upcoming/list")
async def get_upcoming_events(
    limit: int = Query(10, le=50),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get upcoming events"""
    db = get_db()
    
    now = datetime.utcnow()
    
    events = await db.events.find({
        "user_id": current_user.id,
        "date": {"$gte": now},
        "status": "scheduled"
    }).sort("date", 1).limit(limit).to_list(None)
    
    return serialize_docs(events)