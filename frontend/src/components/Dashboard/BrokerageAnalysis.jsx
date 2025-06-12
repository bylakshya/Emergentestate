import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TrendingUp, DollarSign, BarChart3, PieChart, 
  Calendar, Filter, Download, Target
} from 'lucide-react';
import { mockBrokerageData, mockDeals } from '../../mockData/mockData';

const BrokerageAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('amount');

  // Calculate analytics
  const totalEarnings = mockBrokerageData.reduce((sum, item) => sum + item.amount, 0);
  const avgMonthlyEarnings = totalEarnings / mockBrokerageData.length;
  const bestMonth = mockBrokerageData.reduce((max, item) => 
    max.amount > item.amount ? max : item
  );
  const growthRate = ((mockBrokerageData[mockBrokerageData.length - 1].amount - mockBrokerageData[0].amount) / mockBrokerageData[0].amount) * 100;

  const closedDeals = mockDeals.filter(deal => deal.status === 'Closed');
  const totalDealValue = closedDeals.reduce((sum, deal) => {
    const value = parseFloat(deal.dealValue.replace(/[^\d.]/g, ''));
    return sum + value;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Brokerage Analysis</h2>
          <p className="text-gray-600">Track your earnings and commission performance</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-900">₹{(totalEarnings / 100000).toFixed(1)}L</p>
                <p className="text-xs text-blue-600">+{growthRate.toFixed(1)}% growth</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Avg Monthly</p>
                <p className="text-2xl font-bold text-green-900">₹{(avgMonthlyEarnings / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-600">Per month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Best Month</p>
                <p className="text-2xl font-bold text-purple-900">{bestMonth.month}</p>
                <p className="text-xs text-purple-600">₹{(bestMonth.amount / 100000).toFixed(1)}L earned</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Closed Deals</p>
                <p className="text-2xl font-bold text-orange-900">{closedDeals.length}</p>
                <p className="text-xs text-orange-600">₹{(totalDealValue / 10000000).toFixed(1)}Cr value</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Monthly Earnings Trend</span>
            </CardTitle>
            <CardDescription>Your brokerage earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBrokerageData.map((item, index) => (
                <div key={item.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium">{item.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.amount / Math.max(...mockBrokerageData.map(d => d.amount))) * 100}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm font-medium text-right">
                    ₹{(item.amount / 100000).toFixed(1)}L
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Deal Status Distribution</span>
            </CardTitle>
            <CardDescription>Breakdown of your deals by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Closed', 'Agreement', 'Registry', 'Follow-up', 'Cancelled'].map((status, index) => {
                const count = mockDeals.filter(deal => deal.status === status).length;
                const percentage = (count / mockDeals.length) * 100;
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
                
                return (
                  <div key={status} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${colors[index]}`}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{status}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{count} deals</span>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Properties</CardTitle>
          <CardDescription>Properties that generated the highest brokerage</CardDescription>
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
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockDeals.filter(deal => deal.status === 'Closed').map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium">{deal.propertyTitle}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">{deal.customerName}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-green-600">{deal.dealValue}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-blue-600">{deal.brokerageAmount}</div>
                    </td>
                    <td className="py-3">
                      <Badge className="bg-green-100 text-green-800">
                        {deal.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="text-sm text-gray-600">{deal.closeDate}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Performance Goals</span>
          </CardTitle>
          <CardDescription>Track your progress towards monthly and yearly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Target</span>
                <span className="text-sm text-gray-600">₹2.75L / ₹3L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">92% Complete</span>
                <span className="text-xs text-green-600">₹25K to go</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Yearly Target</span>
                <span className="text-sm text-gray-600">₹15.5L / ₹25L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '62%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">62% Complete</span>
                <span className="text-xs text-blue-600">₹9.5L to go</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Deals Closed</span>
                <span className="text-sm text-gray-600">1 / 5 (Monthly)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">20% Complete</span>
                <span className="text-xs text-purple-600">4 deals to go</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerageAnalysis;