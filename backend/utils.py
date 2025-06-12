from typing import Dict, Any, List
from datetime import datetime
import base64
import uuid
import os

def serialize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB document to JSON serializable format."""
    if doc is None:
        return None
    
    # Convert ObjectId to string if present
    if '_id' in doc:
        doc.pop('_id')
    
    # Convert datetime objects to ISO format strings
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, list):
            doc[key] = [serialize_doc(item) if isinstance(item, dict) else item for item in value]
        elif isinstance(value, dict):
            doc[key] = serialize_doc(value)
    
    return doc

def serialize_docs(docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Convert list of MongoDB documents to JSON serializable format."""
    return [serialize_doc(doc) for doc in docs]

def save_base64_image(base64_string: str, folder: str = "uploads") -> str:
    """Save base64 image to file and return file path."""
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs(folder, exist_ok=True)
        
        # Extract the base64 data (remove data:image/png;base64, part)
        if ',' in base64_string:
            header, data = base64_string.split(',', 1)
        else:
            data = base64_string
        
        # Decode base64
        image_data = base64.b64decode(data)
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.png"
        file_path = os.path.join(folder, filename)
        
        # Save file
        with open(file_path, 'wb') as f:
            f.write(image_data)
        
        return file_path
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

def load_image_as_base64(file_path: str) -> str:
    """Load image file and convert to base64."""
    try:
        with open(file_path, 'rb') as f:
            image_data = f.read()
        
        base64_string = base64.b64encode(image_data).decode('utf-8')
        return f"data:image/png;base64,{base64_string}"
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def calculate_dashboard_stats(user_id: str, role: str, db) -> Dict[str, Any]:
    """Calculate dashboard statistics for a user."""
    # This will be implemented with actual database queries
    # For now, return mock data structure
    
    if role == "broker":
        return {
            "total_properties": 0,
            "total_customers": 0,
            "active_deals": 0,
            "monthly_brokerage": "₹0",
            "total_brokerage": "₹0"
        }
    else:  # builder
        return {
            "total_projects": 0,
            "total_plots": 0,
            "sold_plots": 0,
            "monthly_revenue": "₹0",
            "total_revenue": "₹0"
        }

def format_currency(amount: float) -> str:
    """Format amount as Indian currency."""
    if amount >= 10000000:  # 1 Crore
        return f"₹{amount / 10000000:.2f} Cr"
    elif amount >= 100000:  # 1 Lakh
        return f"₹{amount / 100000:.2f} Lakh"
    else:
        return f"₹{amount:,.0f}"

def validate_phone(phone: str) -> bool:
    """Validate Indian phone number format."""
    import re
    pattern = r'^(\+91|91)?[6-9]\d{9}$'
    return bool(re.match(pattern, phone.replace(' ', '').replace('-', '')))

def validate_email(email: str) -> bool:
    """Validate email format."""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

class HTTPException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail