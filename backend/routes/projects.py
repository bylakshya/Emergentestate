from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Project, ProjectCreate, UserResponse, Plot, PlotBuyer, Payment
from auth import get_current_user, require_role
from database import get_db
from utils import serialize_doc, serialize_docs
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[dict])
async def get_projects(
    area: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Get all projects for the current builder"""
    db = get_db()
    
    query = {"user_id": current_user.id}
    
    # Apply filters
    if area:
        query["area"] = area
    
    # Apply search
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"area": {"$regex": search, "$options": "i"}}
        ]
    
    projects = await db.projects.find(query).sort("created_at", -1).to_list(None)
    return serialize_docs(projects)

@router.post("/", response_model=dict)
async def create_project(
    project_data: ProjectCreate,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Create a new project"""
    db = get_db()
    
    project_dict = project_data.dict()
    project_dict["user_id"] = current_user.id
    project_dict["sold_plots"] = 0
    project_dict["reserved_plots"] = 0
    project_dict["plots"] = []
    
    project_obj = Project(**project_dict)
    result = await db.projects.insert_one(project_obj.dict())
    
    created_project = await db.projects.find_one({"_id": result.inserted_id})
    return serialize_doc(created_project)

@router.get("/{project_id}", response_model=dict)
async def get_project(
    project_id: str,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Get a specific project"""
    db = get_db()
    
    project_data = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return serialize_doc(project_data)

@router.put("/{project_id}", response_model=dict)
async def update_project(
    project_id: str,
    project_data: ProjectCreate,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Update a project"""
    db = get_db()
    
    # Check if project exists and belongs to user
    existing_project = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update project
    update_data = project_data.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.projects.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    updated_project = await db.projects.find_one({"id": project_id})
    return serialize_doc(updated_project)

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Delete a project"""
    db = get_db()
    
    # Check if project exists and belongs to user
    existing_project = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    await db.projects.delete_one({"id": project_id})
    return {"message": "Project deleted successfully"}

@router.get("/{project_id}/plots", response_model=List[dict])
async def get_project_plots(
    project_id: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Get all plots for a specific project"""
    db = get_db()
    
    project_data = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    plots = project_data.get("plots", [])
    
    # Apply status filter
    if status_filter:
        plots = [plot for plot in plots if plot.get("status") == status_filter]
    
    return plots

@router.post("/{project_id}/plots", response_model=dict)
async def add_plot_to_project(
    project_id: str,
    plot_data: Plot,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Add a new plot to a project"""
    db = get_db()
    
    project_data = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if plot number already exists
    existing_plots = project_data.get("plots", [])
    if any(plot["plot_number"] == plot_data.plot_number for plot in existing_plots):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plot number already exists"
        )
    
    # Add plot to project
    new_plot = plot_data.dict()
    existing_plots.append(new_plot)
    
    # Update project statistics
    available_plots = len([p for p in existing_plots if p["status"] == "Available"])
    sold_plots = len([p for p in existing_plots if p["status"] == "Sold"])
    reserved_plots = len([p for p in existing_plots if p["status"] == "Reserved"])
    
    await db.projects.update_one(
        {"id": project_id},
        {
            "$set": {
                "plots": existing_plots,
                "available_plots": available_plots,
                "sold_plots": sold_plots,
                "reserved_plots": reserved_plots,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Plot added successfully", "plot": new_plot}

@router.put("/{project_id}/plots/{plot_number}", response_model=dict)
async def update_plot(
    project_id: str,
    plot_number: str,
    plot_data: Plot,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Update a specific plot in a project"""
    db = get_db()
    
    project_data = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    plots = project_data.get("plots", [])
    plot_index = next((i for i, plot in enumerate(plots) if plot["plot_number"] == plot_number), None)
    
    if plot_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plot not found"
        )
    
    # Update the plot
    plots[plot_index] = plot_data.dict()
    
    # Update project statistics
    available_plots = len([p for p in plots if p["status"] == "Available"])
    sold_plots = len([p for p in plots if p["status"] == "Sold"])
    reserved_plots = len([p for p in plots if p["status"] == "Reserved"])
    
    await db.projects.update_one(
        {"id": project_id},
        {
            "$set": {
                "plots": plots,
                "available_plots": available_plots,
                "sold_plots": sold_plots,
                "reserved_plots": reserved_plots,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Plot updated successfully", "plot": plot_data.dict()}

@router.post("/{project_id}/plots/{plot_number}/payments", response_model=dict)
async def add_payment_to_plot(
    project_id: str,
    plot_number: str,
    payment_data: Payment,
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Add a payment to a specific plot"""
    db = get_db()
    
    project_data = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    plots = project_data.get("plots", [])
    plot_index = next((i for i, plot in enumerate(plots) if plot["plot_number"] == plot_number), None)
    
    if plot_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plot not found"
        )
    
    # Add payment to plot
    if "payments" not in plots[plot_index]:
        plots[plot_index]["payments"] = []
    
    plots[plot_index]["payments"].append(payment_data.dict())
    
    await db.projects.update_one(
        {"id": project_id},
        {
            "$set": {
                "plots": plots,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Payment added successfully", "payment": payment_data.dict()}

@router.post("/{project_id}/bulk-upload")
async def bulk_upload_plots(
    project_id: str,
    plots_data: List[Plot],
    current_user: UserResponse = Depends(require_role(["builder"]))
):
    """Bulk upload plots to a project"""
    db = get_db()
    
    project_data = await db.projects.find_one({
        "id": project_id,
        "user_id": current_user.id
    })
    
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Validate plot numbers are unique
    plot_numbers = [plot.plot_number for plot in plots_data]
    if len(plot_numbers) != len(set(plot_numbers)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate plot numbers found"
        )
    
    # Check against existing plots
    existing_plots = project_data.get("plots", [])
    existing_numbers = [plot["plot_number"] for plot in existing_plots]
    
    duplicates = set(plot_numbers) & set(existing_numbers)
    if duplicates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Plot numbers already exist: {list(duplicates)}"
        )
    
    # Add all plots
    new_plots = [plot.dict() for plot in plots_data]
    all_plots = existing_plots + new_plots
    
    # Update project statistics
    available_plots = len([p for p in all_plots if p["status"] == "Available"])
    sold_plots = len([p for p in all_plots if p["status"] == "Sold"])
    reserved_plots = len([p for p in all_plots if p["status"] == "Reserved"])
    
    await db.projects.update_one(
        {"id": project_id},
        {
            "$set": {
                "plots": all_plots,
                "total_plots": len(all_plots),
                "available_plots": available_plots,
                "sold_plots": sold_plots,
                "reserved_plots": reserved_plots,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "message": f"Successfully uploaded {len(new_plots)} plots",
        "total_plots": len(all_plots)
    }