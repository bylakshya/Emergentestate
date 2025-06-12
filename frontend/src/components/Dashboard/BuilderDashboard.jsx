import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building2, Users, TrendingUp, Calendar, 
  MapPin, Phone, Mail, Eye, Edit, Trash2,
  Plus, Filter, Search, Download, Bell,
  Home, DollarSign, Star, Clock, Briefcase
} from 'lucide-react';
import { dashboardStats, mockProjects, mockBuilderCustomers, mockFinancialData, mockTeamMembers } from '../../mockData/mockData';
import ProjectManager from './ProjectManager';
import PlotGrid from './PlotGrid';
import BuilderCustomerManager from './BuilderCustomerManager';
import BuilderFinancials from './BuilderFinancials';
import TeamManagement from './TeamManagement';
import { useToast } from '../../hooks/use-toast';

const BuilderDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Builder Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.fullName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Hindi</span>
              <Button variant="outline" size="sm">EN</Button>
            </div>
            <Button variant="outline">Profile</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="plots">Plot Grid</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.builder.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">Active projects</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Plots</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.builder.totalPlots}</div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sold Plots</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.builder.soldPlots}</div>
                  <p className="text-xs text-muted-foreground">
                    {((dashboardStats.builder.soldPlots / dashboardStats.builder.totalPlots) * 100).toFixed(1)}% sold
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.builder.monthlyRevenue}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.builder.totalRevenue}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Active Projects
                    <Button variant="outline" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.area}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={project.layoutApproval === 'Approved' ? 'default' : 'secondary'}>
                            {project.layoutApproval}
                          </Badge>
                          <span className="text-sm text-gray-500">{project.soldPlots}/{project.totalPlots} sold</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{project.priceRange}</div>
                        <div className="text-xs text-gray-500">{project.completionDate}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Customers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Customers
                    <Button variant="outline" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockBuilderCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.project} - {customer.plotNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={
                            customer.status === 'Closed' ? 'default' :
                            customer.status === 'Reserved' ? 'secondary' : 'outline'
                          }>
                            {customer.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{customer.budget}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Revenue Trend</span>
                </CardTitle>
                <CardDescription>Monthly revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFinancialData.map((item, index) => (
                    <div key={item.month} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium">{item.month}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Revenue</span>
                          <span className="font-medium text-green-600">₹{(item.revenue / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(item.revenue / Math.max(...mockFinancialData.map(d => d.revenue))) * 100}%`,
                              animationDelay: `${index * 100}ms`
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Expenses</span>
                          <span className="font-medium text-red-600">₹{(item.expenses / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="w-full bg-red-100 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(item.expenses / Math.max(...mockFinancialData.map(d => d.expenses))) * 100}%`,
                              animationDelay: `${index * 100}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Team Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{member.joinDate}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Upload Plots
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Payment Reminders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>
          
          <TabsContent value="plots">
            <PlotGrid />
          </TabsContent>
          
          <TabsContent value="customers">
            <BuilderCustomerManager />
          </TabsContent>
          
          <TabsContent value="financials">
            <BuilderFinancials />
          </TabsContent>
          
          <TabsContent value="team">
            <TeamManagement />
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar & Meetings</CardTitle>
                <CardDescription>Schedule and manage your meetings and site visits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Calendar functionality will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Generate comprehensive business reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Sales Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Customer Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Financial Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Plot Status Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Payment Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Legal Documents
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

export default BuilderDashboard;