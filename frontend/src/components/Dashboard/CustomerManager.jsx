import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Search, Plus, Users, Phone, Mail, Calendar, 
  Star, Edit, Trash2, Download, Filter, Clock
} from 'lucide-react';
import { mockCustomers } from '../../mockData/mockData';
import { useToast } from '../../hooks/use-toast';

const CustomerManager = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    interest: '',
    status: 'Interested',
    isImportant: false,
    followUpDate: '',
    notes: ''
  });

  // Filter customers based on search and filters
  React.useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === filterStatus);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, filterStatus]);

  const handleAddCustomer = () => {
    const customer = {
      ...newCustomer,
      id: Date.now(),
      addedDate: new Date().toISOString().split('T')[0]
    };

    setCustomers([customer, ...customers]);
    setNewCustomer({
      name: '', phone: '', email: '', budget: '', interest: '', 
      status: 'Interested', isImportant: false, followUpDate: '', notes: ''
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Customer Added",
      description: "New customer has been added successfully",
    });
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast({
      title: "Customer Deleted",
      description: "Customer has been removed from your list",
    });
  };

  const toggleImportant = (id) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, isImportant: !c.isImportant } : c
    ));
    toast({
      title: "Customer Updated",
      description: "Important status updated",
    });
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = customers.map(customer => 
      `${customer.name},${customer.phone},${customer.email},${customer.budget},${customer.status}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    
    toast({
      title: "Export Successful",
      description: "Customer data exported to CSV",
    });
  };

  const statusColors = {
    'Interested': 'bg-blue-100 text-blue-800',
    'Call': 'bg-yellow-100 text-yellow-800',
    'Visit': 'bg-purple-100 text-purple-800',
    'Visit Done': 'bg-green-100 text-green-800',
    'Follow-up': 'bg-orange-100 text-orange-800',
    'Deal Lost': 'bg-red-100 text-red-800',
    'Closed': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Customer Manager</h2>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Add a new customer to your database</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      placeholder="customer@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      value={newCustomer.budget}
                      onChange={(e) => setNewCustomer({...newCustomer, budget: e.target.value})}
                      placeholder="₹2-3 Cr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest">Interest</Label>
                    <Input
                      id="interest"
                      value={newCustomer.interest}
                      onChange={(e) => setNewCustomer({...newCustomer, interest: e.target.value})}
                      placeholder="Villa, Apartment"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => setNewCustomer({...newCustomer, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interested">Interested</SelectItem>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Visit">Visit</SelectItem>
                        <SelectItem value="Visit Done">Visit Done</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Deal Lost">Deal Lost</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={newCustomer.followUpDate}
                      onChange={(e) => setNewCustomer({...newCustomer, followUpDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    placeholder="Any additional notes about the customer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="important"
                    checked={newCustomer.isImportant}
                    onChange={(e) => setNewCustomer({...newCustomer, isImportant: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="important">Mark as Important Customer</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCustomer}>Add Customer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => ['Interested', 'Call', 'Visit', 'Visit Done', 'Follow-up'].includes(c.status)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed Deals</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.status === 'Closed').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Important</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.isImportant).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Visit">Visit</SelectItem>
                <SelectItem value="Visit Done">Visit Done</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Deal Lost">Deal Lost</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customer relationships and track their journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Contact</th>
                  <th className="text-left py-2">Budget</th>
                  <th className="text-left py-2">Interest</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Follow-up</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{customer.name}</span>
                            {customer.isImportant && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <span className="text-sm text-gray-500">Added: {customer.addedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-green-600">{customer.budget}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm">{customer.interest}</span>
                    </td>
                    <td className="py-3">
                      <Badge className={statusColors[customer.status] || 'bg-gray-100 text-gray-800'}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {customer.followUpDate && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{customer.followUpDate}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleImportant(customer.id)}
                        >
                          <Star className={`h-4 w-4 ${customer.isImportant ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No customers found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.filter(c => c.notes && c.notes.trim()).slice(0, 5).map((customer) => (
              <div key={customer.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{customer.name}</span>
                    <Badge className={statusColors[customer.status] || 'bg-gray-100 text-gray-800'}>
                      {customer.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{customer.addedDate}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{customer.notes}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManager;