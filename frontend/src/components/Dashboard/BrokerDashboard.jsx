import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building2, Users, TrendingUp, Calendar, 
  MapPin, Phone, Mail, Eye, Edit, Trash2,
  Plus, Filter, Search, Download, Bell,
  Home, DollarSign, Star, Clock
} from 'lucide-react';
import PropertyManager from './PropertyManager';
import CustomerManager from './CustomerManager';
import DealHistory from './DealHistory';
import BrokerageAnalysis from './BrokerageAnalysis';
import CalendarView from './CalendarView';
import CalculatorTools from './CalculatorTools';
import { useToast } from '../../hooks/use-toast';
import { dashboardAPI, propertiesAPI, customersAPI, notificationsAPI } from '../../services/api';

const BrokerDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const statsResponse = await dashboardAPI.getStats();
      setDashboardStats(statsResponse.data);
      
      // Load recent properties
      const propertiesResponse = await propertiesAPI.getAll({ limit: 3 });
      setRecentProperties(propertiesResponse.data.slice(0, 3));
      
      // Load recent customers
      const customersResponse = await customersAPI.getAll({ limit: 3 });
      setRecentCustomers(customersResponse.data.slice(0, 3));
      
      // Load notifications
      const notificationsResponse = await notificationsAPI.getAll({ limit: 5 });
      setNotifications(notificationsResponse.data);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Broker Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.full_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {notifications.filter(n => !n.is_read).length}
                  </Badge>
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Hindi</span>
              <Button variant="outline" size="sm">EN</Button>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                {dashboardStats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.total_properties}</div>
                        <p className="text-xs text-muted-foreground">Active listings</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.total_customers}</div>
                        <p className="text-xs text-muted-foreground">Leads & customers</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.active_deals}</div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Brokerage</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.monthly_brokerage}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.total_brokerage}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Recent Properties
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('properties')}>
                          View All
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentProperties.length > 0 ? (
                        recentProperties.map((property) => (
                          <div key={property.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Home className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{property.title}</h4>
                              <p className="text-sm text-gray-600">{property.address}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={property.status === 'For Sale' ? 'default' : 'secondary'}>
                                  {property.status}
                                </Badge>
                                <span className="text-sm font-medium text-green-600">{property.price}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No properties yet</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Customers */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Recent Customers
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('customers')}>
                          View All
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentCustomers.length > 0 ? (
                        recentCustomers.map((customer) => (
                          <div key={customer.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{customer.name}</h4>
                              <p className="text-sm text-gray-600">{customer.budget}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={
                                  customer.status === 'Closed' ? 'default' :
                                  customer.status === 'Deal Lost' ? 'destructive' : 'secondary'
                                }>
                                  {customer.status}
                                </Badge>
                                {customer.is_important && <Star className="h-4 w-4 text-yellow-500" />}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No customers yet</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Recent Notifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            !notification.is_read ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => handleMarkNotificationRead(notification.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </span>
                              {!notification.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No notifications</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="properties">
            <PropertyManager />
          </TabsContent>
          
          <TabsContent value="customers">
            <CustomerManager />
          </TabsContent>
          
          <TabsContent value="deals">
            <DealHistory />
          </TabsContent>
          
          <TabsContent value="analytics">
            <BrokerageAnalysis />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
          
          <TabsContent value="calculator">
            <CalculatorTools />
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Export</CardTitle>
                <CardDescription>Generate and export your business reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Properties
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Customers
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Deals
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Brokerage Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Monthly Summary
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Tax Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BrokerDashboard;