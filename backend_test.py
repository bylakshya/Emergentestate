import requests
import json
import unittest
import uuid
from datetime import datetime, timedelta

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://9ae3185e-8446-4c71-b43d-9ba74b8def82.preview.emergentagent.com/api"

class RealEstateAPITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.broker_credentials = {
            "email": f"broker_{uuid.uuid4()}@test.com",
            "password": "Test@123",
            "confirm_password": "Test@123",
            "full_name": "Test Broker",
            "phone": "9876543210",
            "role": "broker"
        }
        
        cls.builder_credentials = {
            "email": f"builder_{uuid.uuid4()}@test.com",
            "password": "Test@123",
            "confirm_password": "Test@123",
            "full_name": "Test Builder",
            "phone": "9876543211",
            "role": "builder"
        }
        
        # Register broker user
        response = requests.post(f"{BACKEND_URL}/auth/signup", json=cls.broker_credentials)
        if response.status_code == 200:
            cls.broker_token = response.json()["access_token"]
            cls.broker_user = response.json()["user"]
            print(f"Broker user created: {cls.broker_user['email']}")
        else:
            print(f"Failed to create broker user: {response.text}")
            cls.broker_token = None
            cls.broker_user = None
        
        # Register builder user
        response = requests.post(f"{BACKEND_URL}/auth/signup", json=cls.builder_credentials)
        if response.status_code == 200:
            cls.builder_token = response.json()["access_token"]
            cls.builder_user = response.json()["user"]
            print(f"Builder user created: {cls.builder_user['email']}")
        else:
            print(f"Failed to create builder user: {response.text}")
            cls.builder_token = None
            cls.builder_user = None
        
        # Test data for broker
        if cls.broker_token:
            # Create a test property
            cls.test_property = {
                "title": "Luxury Villa",
                "type": "Villa",
                "status": "For Sale",
                "price": "₹1.5 Cr",
                "size": "3000 sq ft",
                "facing": "East",
                "address": "123 Test Street, Test City",
                "area": "Test Area",
                "bedrooms": 4,
                "bathrooms": 3,
                "is_hot": True,
                "has_garden": True,
                "is_corner": True,
                "vastu_compliant": True,
                "owner": {
                    "name": "John Owner",
                    "phone": "9876543212",
                    "email": "owner@test.com"
                },
                "images": [],
                "brokerage_amount": "₹3 Lakh"
            }
            
            response = requests.post(
                f"{BACKEND_URL}/properties",
                json=cls.test_property,
                headers={"Authorization": f"Bearer {cls.broker_token}"}
            )
            
            if response.status_code == 200:
                cls.created_property = response.json()
                print(f"Test property created: {cls.created_property['id']}")
            else:
                print(f"Failed to create test property: {response.text}")
                cls.created_property = None
            
            # Create a test customer
            cls.test_customer = {
                "name": "Jane Customer",
                "phone": "9876543213",
                "email": "customer@test.com",
                "budget": "₹1.2 Cr",
                "interest": "Villa in Test Area",
                "status": "Interested",
                "is_important": True,
                "follow_up_date": (datetime.now() + timedelta(days=2)).isoformat(),
                "notes": "Looking for a villa with garden"
            }
            
            response = requests.post(
                f"{BACKEND_URL}/customers",
                json=cls.test_customer,
                headers={"Authorization": f"Bearer {cls.broker_token}"}
            )
            
            if response.status_code == 200:
                cls.created_customer = response.json()
                print(f"Test customer created: {cls.created_customer['id']}")
            else:
                print(f"Failed to create test customer: {response.text}")
                cls.created_customer = None
            
            # Create a test deal if both property and customer were created
            if cls.created_property and cls.created_customer:
                cls.test_deal = {
                    "property_id": cls.created_property["id"],
                    "customer_id": cls.created_customer["id"],
                    "property_title": cls.created_property["title"],
                    "customer_name": cls.created_customer["name"],
                    "status": "Interested",
                    "deal_value": "₹1.45 Cr",
                    "brokerage_amount": "₹2.9 Lakh",
                    "notes": "Initial discussion done"
                }
                
                response = requests.post(
                    f"{BACKEND_URL}/deals",
                    json=cls.test_deal,
                    headers={"Authorization": f"Bearer {cls.broker_token}"}
                )
                
                if response.status_code == 200:
                    cls.created_deal = response.json()
                    print(f"Test deal created: {cls.created_deal['id']}")
                else:
                    print(f"Failed to create test deal: {response.text}")
                    cls.created_deal = None
        
        # Test data for builder
        if cls.builder_token:
            # Create a test project
            cls.test_project = {
                "name": "Green Valley",
                "area": "Test Builder Area",
                "total_plots": 50,
                "available_plots": 50,
                "price_range": "₹40-60 Lakh",
                "layout_approval": "RERA Approved",
                "completion_date": (datetime.now() + timedelta(days=365)).isoformat()
            }
            
            response = requests.post(
                f"{BACKEND_URL}/projects",
                json=cls.test_project,
                headers={"Authorization": f"Bearer {cls.builder_token}"}
            )
            
            if response.status_code == 200:
                cls.created_project = response.json()
                print(f"Test project created: {cls.created_project['id']}")
            else:
                print(f"Failed to create test project: {response.text}")
                cls.created_project = None

    def test_01_root_endpoint(self):
        """Test the root API endpoint"""
        response = requests.get(f"{BACKEND_URL}/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        print("✅ Root endpoint test passed")

    # Authentication Tests
    def test_02_login_broker(self):
        """Test broker login"""
        login_data = {
            "email": self.broker_credentials["email"],
            "password": self.broker_credentials["password"]
        }
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        self.assertEqual(response.json()["user"]["role"], "broker")
        print("✅ Broker login test passed")

    def test_03_login_builder(self):
        """Test builder login"""
        login_data = {
            "email": self.builder_credentials["email"],
            "password": self.builder_credentials["password"]
        }
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        self.assertEqual(response.json()["user"]["role"], "builder")
        print("✅ Builder login test passed")

    def test_04_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        }
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data)
        self.assertEqual(response.status_code, 401)
        print("✅ Invalid login test passed")

    def test_05_get_current_user_broker(self):
        """Test getting current broker user info"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/auth/me",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], self.broker_credentials["email"])
        print("✅ Get current broker user test passed")

    def test_06_get_current_user_builder(self):
        """Test getting current builder user info"""
        if not self.builder_token:
            self.skipTest("Builder token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/auth/me",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], self.builder_credentials["email"])
        print("✅ Get current builder user test passed")

    # Dashboard Tests
    def test_07_get_broker_dashboard_stats(self):
        """Test getting broker dashboard statistics"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/dashboard/stats",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_properties", data)
        self.assertIn("total_customers", data)
        self.assertIn("active_deals", data)
        self.assertIn("monthly_brokerage", data)
        self.assertIn("total_brokerage", data)
        print("✅ Broker dashboard stats test passed")

    def test_08_get_builder_dashboard_stats(self):
        """Test getting builder dashboard statistics"""
        if not self.builder_token:
            self.skipTest("Builder token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/dashboard/stats",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_projects", data)
        self.assertIn("total_plots", data)
        self.assertIn("sold_plots", data)
        self.assertIn("monthly_revenue", data)
        self.assertIn("total_revenue", data)
        print("✅ Builder dashboard stats test passed")

    # Properties Tests
    def test_09_get_properties(self):
        """Test getting all properties"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/properties",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        print("✅ Get properties test passed")

    def test_10_get_property_by_id(self):
        """Test getting a specific property"""
        if not self.broker_token or not self.created_property:
            self.skipTest("Broker token or test property not available")
        
        response = requests.get(
            f"{BACKEND_URL}/properties/{self.created_property['id']}",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], self.created_property["id"])
        print("✅ Get property by ID test passed")

    def test_11_update_property(self):
        """Test updating a property"""
        if not self.broker_token or not self.created_property:
            self.skipTest("Broker token or test property not available")
        
        update_data = self.test_property.copy()
        update_data["title"] = "Updated Luxury Villa"
        update_data["price"] = "₹1.6 Cr"
        
        response = requests.put(
            f"{BACKEND_URL}/properties/{self.created_property['id']}",
            json=update_data,
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], "Updated Luxury Villa")
        print("✅ Update property test passed")

    def test_12_toggle_hot_property(self):
        """Test toggling hot property status"""
        if not self.broker_token or not self.created_property:
            self.skipTest("Broker token or test property not available")
        
        response = requests.patch(
            f"{BACKEND_URL}/properties/{self.created_property['id']}/hot",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        # The toggle should flip the value
        self.assertNotEqual(response.json()["is_hot"], self.created_property["is_hot"])
        print("✅ Toggle hot property test passed")

    # Customers Tests
    def test_13_get_customers(self):
        """Test getting all customers"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/customers",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        print("✅ Get customers test passed")

    def test_14_get_customer_by_id(self):
        """Test getting a specific customer"""
        if not self.broker_token or not self.created_customer:
            self.skipTest("Broker token or test customer not available")
        
        response = requests.get(
            f"{BACKEND_URL}/customers/{self.created_customer['id']}",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], self.created_customer["id"])
        print("✅ Get customer by ID test passed")

    def test_15_update_customer(self):
        """Test updating a customer"""
        if not self.broker_token or not self.created_customer:
            self.skipTest("Broker token or test customer not available")
        
        update_data = self.test_customer.copy()
        update_data["name"] = "Updated Jane Customer"
        update_data["budget"] = "₹1.3 Cr"
        
        response = requests.put(
            f"{BACKEND_URL}/customers/{self.created_customer['id']}",
            json=update_data,
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Updated Jane Customer")
        print("✅ Update customer test passed")

    def test_16_toggle_important_customer(self):
        """Test toggling important customer status"""
        if not self.broker_token or not self.created_customer:
            self.skipTest("Broker token or test customer not available")
        
        response = requests.patch(
            f"{BACKEND_URL}/customers/{self.created_customer['id']}/important",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        # The toggle should flip the value
        self.assertNotEqual(response.json()["is_important"], self.created_customer["is_important"])
        print("✅ Toggle important customer test passed")

    # Deals Tests
    def test_17_get_deals(self):
        """Test getting all deals"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/deals",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        print("✅ Get deals test passed")

    def test_18_get_deal_by_id(self):
        """Test getting a specific deal"""
        if not self.broker_token or not self.created_deal:
            self.skipTest("Broker token or test deal not available")
        
        response = requests.get(
            f"{BACKEND_URL}/deals/{self.created_deal['id']}",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], self.created_deal["id"])
        print("✅ Get deal by ID test passed")

    def test_19_update_deal(self):
        """Test updating a deal"""
        if not self.broker_token or not self.created_deal:
            self.skipTest("Broker token or test deal not available")
        
        update_data = self.test_deal.copy()
        update_data["status"] = "Visit Done"
        update_data["notes"] = "Customer visited the property and liked it"
        
        response = requests.put(
            f"{BACKEND_URL}/deals/{self.created_deal['id']}",
            json=update_data,
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "Visit Done")
        print("✅ Update deal test passed")

    # Projects Tests (Builder role)
    def test_20_get_projects(self):
        """Test getting all projects"""
        if not self.builder_token:
            self.skipTest("Builder token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/projects",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        print("✅ Get projects test passed")

    def test_21_get_project_by_id(self):
        """Test getting a specific project"""
        if not self.builder_token or not self.created_project:
            self.skipTest("Builder token or test project not available")
        
        response = requests.get(
            f"{BACKEND_URL}/projects/{self.created_project['id']}",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], self.created_project["id"])
        print("✅ Get project by ID test passed")

    def test_22_update_project(self):
        """Test updating a project"""
        if not self.builder_token or not self.created_project:
            self.skipTest("Builder token or test project not available")
        
        update_data = self.test_project.copy()
        update_data["name"] = "Updated Green Valley"
        update_data["price_range"] = "₹45-65 Lakh"
        
        response = requests.put(
            f"{BACKEND_URL}/projects/{self.created_project['id']}",
            json=update_data,
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Updated Green Valley")
        print("✅ Update project test passed")

    def test_23_get_project_plots(self):
        """Test getting plots for a project"""
        if not self.builder_token or not self.created_project:
            self.skipTest("Builder token or test project not available")
        
        response = requests.get(
            f"{BACKEND_URL}/projects/{self.created_project['id']}/plots",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        print("✅ Get project plots test passed")

    # Events Tests
    def test_24_create_and_get_events(self):
        """Test creating and getting events"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        # Create an event
        event_data = {
            "title": "Property Visit",
            "type": "visit",
            "date": (datetime.now() + timedelta(days=1)).isoformat(),
            "time": "14:00",
            "customer": "Jane Customer",
            "phone": "9876543213",
            "location": "123 Test Street, Test City",
            "notes": "Show the luxury villa"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/events",
            json=event_data,
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        created_event = response.json()
        
        # Get all events
        response = requests.get(
            f"{BACKEND_URL}/events",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Get today's events
        response = requests.get(
            f"{BACKEND_URL}/events/today/list",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        
        # Get upcoming events
        response = requests.get(
            f"{BACKEND_URL}/events/upcoming/list",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        
        print("✅ Events tests passed")

    # Notifications Tests
    def test_25_create_and_get_notifications(self):
        """Test creating and getting notifications"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        # Create a notification
        notification_data = {
            "title": "New Lead",
            "message": "You have a new lead for the luxury villa",
            "type": "inquiry"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/notifications",
            json=notification_data,
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        created_notification = response.json()
        
        # Get all notifications
        response = requests.get(
            f"{BACKEND_URL}/notifications",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Get unread count
        response = requests.get(
            f"{BACKEND_URL}/notifications/unread/count",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("unread_count", response.json())
        
        # Mark notification as read
        response = requests.patch(
            f"{BACKEND_URL}/notifications/{created_notification['id']}/read",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["is_read"])
        
        print("✅ Notifications tests passed")

    # Role-based access control tests
    def test_26_broker_cannot_access_builder_endpoints(self):
        """Test that broker cannot access builder endpoints"""
        if not self.broker_token:
            self.skipTest("Broker token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/projects",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 403)
        print("✅ Broker role restriction test passed")

    def test_27_builder_cannot_access_broker_endpoints(self):
        """Test that builder cannot access broker endpoints"""
        if not self.builder_token:
            self.skipTest("Builder token not available")
        
        response = requests.get(
            f"{BACKEND_URL}/properties",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 403)
        print("✅ Builder role restriction test passed")

    # Cleanup tests
    def test_28_delete_property(self):
        """Test deleting a property"""
        if not self.broker_token or not self.created_property:
            self.skipTest("Broker token or test property not available")
        
        response = requests.delete(
            f"{BACKEND_URL}/properties/{self.created_property['id']}",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        print("✅ Delete property test passed")

    def test_29_delete_customer(self):
        """Test deleting a customer"""
        if not self.broker_token or not self.created_customer:
            self.skipTest("Broker token or test customer not available")
        
        response = requests.delete(
            f"{BACKEND_URL}/customers/{self.created_customer['id']}",
            headers={"Authorization": f"Bearer {self.broker_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        print("✅ Delete customer test passed")

    def test_30_delete_project(self):
        """Test deleting a project"""
        if not self.builder_token or not self.created_project:
            self.skipTest("Builder token or test project not available")
        
        response = requests.delete(
            f"{BACKEND_URL}/projects/{self.created_project['id']}",
            headers={"Authorization": f"Bearer {self.builder_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        print("✅ Delete project test passed")

if __name__ == "__main__":
    unittest.main(verbosity=2)
