from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db_instance = Database()

async def get_database():
    return db_instance.database

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ['MONGO_URL']
    db_instance.client = AsyncIOMotorClient(mongo_url)
    db_instance.database = db_instance.client[os.environ.get('DB_NAME', 'realestate_db')]
    
    # Create indexes for better performance
    await create_indexes()

async def close_mongo_connection():
    """Close database connection"""
    if db_instance.client:
        db_instance.client.close()

async def create_indexes():
    """Create database indexes for better performance"""
    db = db_instance.database
    
    # User indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("role")
    
    # Property indexes
    await db.properties.create_index("user_id")
    await db.properties.create_index("area")
    await db.properties.create_index("type")
    await db.properties.create_index("status")
    
    # Customer indexes
    await db.customers.create_index("user_id")
    await db.customers.create_index("status")
    await db.customers.create_index("phone")
    
    # Deal indexes
    await db.deals.create_index("user_id")
    await db.deals.create_index("status")
    await db.deals.create_index("property_id")
    await db.deals.create_index("customer_id")
    
    # Project indexes
    await db.projects.create_index("user_id")
    await db.projects.create_index("area")
    
    # Builder customer indexes
    await db.builder_customers.create_index("user_id")
    await db.builder_customers.create_index("status")
    
    # Notification indexes
    await db.notifications.create_index("user_id")
    await db.notifications.create_index("is_read")
    
    # Event indexes
    await db.events.create_index("user_id")
    await db.events.create_index("date")
    await db.events.create_index("status")
    
    # Financial record indexes
    await db.financial_records.create_index("user_id")
    await db.financial_records.create_index([("year", 1), ("month", 1)])
    
    # Team member indexes
    await db.team_members.create_index("user_id")
    await db.team_members.create_index("email")

def get_db():
    return db_instance.database