import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, Filter, Download, TrendingUp, 
  Clock, CheckCircle, XCircle, FileText,
  Calendar, DollarSign, User, Home
} from 'lucide-react';
import { mockDeals } from '../../mockData/mockData';

const DealHistory = () => {
  const [deals, setDeals] = useState(mockDeals);
  const [filteredDeals, setFilteredDeals] = useState(mockDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter deals based on search and filters
  React.useEffect(() => {
    let filtered = deals;

    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(deal => deal.status === filterStatus);
    }

    setFilteredDeals(filtered);
  }, [deals, searchTerm, filterStatus]);

  const statusColors = {
    'Closed': 'bg-green-100 text-green-800',
    'Agreement': 'bg-blue-100 text-blue-800',
    'Registry': 'bg-purple-100 text-purple-800',
    'Follow-up': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    'Closed': CheckCircle,
    'Agreement': FileText,
    'Registry': FileText,
    'Follow-up': Clock,
    'Cancelled': XCircle
  };

  const totalDeals = deals.length;
  const closedDeals = deals.filter(deal => deal.status === 'Closed').length;
  const activeDeals = deals.filter(deal => !['Closed', 'Cancelled'].includes(deal.status)).length;
  const cancelledDeals = deals.filter(deal => deal.status === 'Cancelled').length;

  const handleExport = () => {
    // Mock export functionality
    const csvContent = deals.map(deal => 
      `${deal.propertyTitle},${deal.customerName},${deal.status},${deal.dealValue},${deal.brokerageAmount}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deals.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Deal History</h2>
          <p className="text-gray-600">Track all your property deals and transactions</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Deals
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Deals</p>
                <p className="text-2xl font-bold text-blue-900">{totalDeals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Closed Deals</p>
                <p className="text-2xl font-bold text-green-900">{closedDeals}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Active Deals</p>
                <p className="text-2xl font-bold text-yellow-900">{activeDeals}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Cancelled</p>
                <p className="text-2xl font-bold text-red-900">{cancelledDeals}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
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
                  placeholder="Search deals..."
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
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Agreement">Agreement</SelectItem>
                <SelectItem value="Registry">Registry</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
          <CardDescription>Complete history of your property transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Property</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Deal Value</th>
                  <th className="text-left py-2">Brokerage</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Timeline</th>
                  <th className="text-left py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => {
                  const StatusIcon = statusIcons[deal.status];
                  return (
                    <tr key={deal.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Home className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{deal.propertyTitle}</div>
                            <div className="text-sm text-gray-500">ID: {deal.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{deal.customerName}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">{deal.dealValue}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-medium text-blue-600">{deal.brokerageAmount}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge className={statusColors[deal.status] || 'bg-gray-100 text-gray-800'}>
                            {deal.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>Started: {deal.startDate}</span>
                          </div>
                          {deal.closeDate && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>Closed: {deal.closeDate}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="max-w-48 text-sm text-gray-600 truncate">
                          {deal.notes}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredDeals.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No deals found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deal Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deal Activity</CardTitle>
          <CardDescription>Timeline of your recent deal activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deals.slice(0, 5).map((deal, index) => (
              <div key={deal.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  deal.status === 'Closed' ? 'bg-green-100' :
                  deal.status === 'Cancelled' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {React.createElement(statusIcons[deal.status], { 
                    className: `h-5 w-5 ${
                      deal.status === 'Closed' ? 'text-green-600' :
                      deal.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'
                    }` 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{deal.propertyTitle}</h4>
                    <span className="text-sm text-gray-500">
                      {deal.closeDate || deal.startDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Deal with {deal.customerName} - {deal.status.toLowerCase()}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className={statusColors[deal.status] || 'bg-gray-100 text-gray-800'}>
                      {deal.status}
                    </Badge>
                    <span className="text-sm font-medium text-green-600">{deal.dealValue}</span>
                    <span className="text-sm text-blue-600">{deal.brokerageAmount} commission</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealHistory;