import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calculator, Home, DollarSign, TrendingUp, 
  Percent, MapPin, Calendar
} from 'lucide-react';

const CalculatorTools = () => {
  const [plotCalculator, setPlotCalculator] = useState({
    length: '',
    width: '',
    unit: 'feet',
    result: 0
  });

  const [stampDutyCalculator, setStampDutyCalculator] = useState({
    propertyValue: '',
    state: 'Maharashtra',
    propertyType: 'residential',
    stampDuty: 0,
    registrationFee: 0,
    total: 0
  });

  const [brokerageCalculator, setBrokerageCalculator] = useState({
    propertyValue: '',
    brokeragePercent: '',
    brokerageAmount: 0
  });

  const [appreciationCalculator, setAppreciationCalculator] = useState({
    currentValue: '',
    appreciationRate: '',
    years: '',
    futureValue: 0,
    totalAppreciation: 0
  });

  const calculatePlotSize = () => {
    const length = parseFloat(plotCalculator.length);
    const width = parseFloat(plotCalculator.width);
    
    if (length && width) {
      let area = length * width;
      
      // Convert to square feet if in meters
      if (plotCalculator.unit === 'meters') {
        area = area * 10.764; // 1 sq meter = 10.764 sq feet
      }
      
      setPlotCalculator(prev => ({ ...prev, result: area }));
    }
  };

  const calculateStampDuty = () => {
    const value = parseFloat(stampDutyCalculator.propertyValue);
    
    if (value) {
      // Maharashtra stamp duty rates (approximate)
      let stampDutyRate = 0.05; // 5% for residential
      if (stampDutyCalculator.propertyType === 'commercial') {
        stampDutyRate = 0.06; // 6% for commercial
      }
      
      const stampDuty = value * stampDutyRate;
      const registrationFee = value * 0.01; // 1% registration fee
      const total = stampDuty + registrationFee;
      
      setStampDutyCalculator(prev => ({
        ...prev,
        stampDuty,
        registrationFee,
        total
      }));
    }
  };

  const calculateBrokerage = () => {
    const value = parseFloat(brokerageCalculator.propertyValue);
    const percent = parseFloat(brokerageCalculator.brokeragePercent);
    
    if (value && percent) {
      const amount = (value * percent) / 100;
      setBrokerageCalculator(prev => ({ ...prev, brokerageAmount: amount }));
    }
  };

  const calculateAppreciation = () => {
    const current = parseFloat(appreciationCalculator.currentValue);
    const rate = parseFloat(appreciationCalculator.appreciationRate);
    const years = parseInt(appreciationCalculator.years);
    
    if (current && rate && years) {
      const futureValue = current * Math.pow(1 + (rate / 100), years);
      const totalAppreciation = futureValue - current;
      
      setAppreciationCalculator(prev => ({
        ...prev,
        futureValue,
        totalAppreciation
      }));
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Calculator Tools</h2>
          <p className="text-gray-600">Property calculation tools for your business</p>
        </div>
        <Calculator className="h-8 w-8 text-blue-600" />
      </div>

      <Tabs defaultValue="plot" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plot">Plot Size</TabsTrigger>
          <TabsTrigger value="stamp">Stamp Duty</TabsTrigger>
          <TabsTrigger value="brokerage">Brokerage</TabsTrigger>
          <TabsTrigger value="appreciation">Appreciation</TabsTrigger>
        </TabsList>

        {/* Plot Size Calculator */}
        <TabsContent value="plot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Plot Size Calculator</span>
              </CardTitle>
              <CardDescription>Calculate the area of a plot in square feet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="Enter length"
                    value={plotCalculator.length}
                    onChange={(e) => setPlotCalculator(prev => ({ ...prev, length: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Enter width"
                    value={plotCalculator.width}
                    onChange={(e) => setPlotCalculator(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={plotCalculator.unit} 
                    onValueChange={(value) => setPlotCalculator(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feet">Feet</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={calculatePlotSize} className="w-full md:w-auto">
                Calculate Area
              </Button>
              
              {plotCalculator.result > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Calculation Result</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">Total Area</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {plotCalculator.result.toLocaleString()} sq ft
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">In Square Meters</p>
                      <p className="text-xl font-semibold text-blue-800">
                        {(plotCalculator.result / 10.764).toFixed(2)} sq m
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stamp Duty Calculator */}
        <TabsContent value="stamp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Stamp Duty & Registration Calculator</span>
              </CardTitle>
              <CardDescription>Calculate stamp duty and registration fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Value (₹)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="Enter property value"
                    value={stampDutyCalculator.propertyValue}
                    onChange={(e) => setStampDutyCalculator(prev => ({ ...prev, propertyValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={stampDutyCalculator.state} 
                    onValueChange={(value) => setStampDutyCalculator(prev => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select 
                    value={stampDutyCalculator.propertyType} 
                    onValueChange={(value) => setStampDutyCalculator(prev => ({ ...prev, propertyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={calculateStampDuty} className="w-full md:w-auto">
                Calculate Fees
              </Button>
              
              {stampDutyCalculator.total > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-4">Fee Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-green-600">Stamp Duty</p>
                      <p className="text-xl font-bold text-green-900">
                        {formatCurrency(stampDutyCalculator.stampDuty)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Registration Fee</p>
                      <p className="text-xl font-bold text-green-900">
                        {formatCurrency(stampDutyCalculator.registrationFee)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Total Amount</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(stampDutyCalculator.total)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brokerage Calculator */}
        <TabsContent value="brokerage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Percent className="h-5 w-5" />
                <span>Brokerage Calculator</span>
              </CardTitle>
              <CardDescription>Calculate your brokerage amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brokeragePropertyValue">Property Value (₹)</Label>
                  <Input
                    id="brokeragePropertyValue"
                    type="number"
                    placeholder="Enter property value"
                    value={brokerageCalculator.propertyValue}
                    onChange={(e) => setBrokerageCalculator(prev => ({ ...prev, propertyValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brokeragePercent">Brokerage Percentage (%)</Label>
                  <Input
                    id="brokeragePercent"
                    type="number"
                    step="0.1"
                    placeholder="Enter percentage"
                    value={brokerageCalculator.brokeragePercent}
                    onChange={(e) => setBrokerageCalculator(prev => ({ ...prev, brokeragePercent: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculateBrokerage} className="w-full md:w-auto">
                Calculate Brokerage
              </Button>
              
              {brokerageCalculator.brokerageAmount > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Brokerage Amount</h3>
                  <p className="text-3xl font-bold text-purple-900">
                    {formatCurrency(brokerageCalculator.brokerageAmount)}
                  </p>
                  <p className="text-sm text-purple-600 mt-2">
                    {brokerageCalculator.brokeragePercent}% of {formatCurrency(parseFloat(brokerageCalculator.propertyValue))}
                  </p>
                </div>
              )}

              {/* Quick Brokerage Rates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Standard Brokerage Rates</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="font-medium">Sale</p>
                    <p className="text-blue-600">1-2%</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="font-medium">Rent</p>
                    <p className="text-green-600">1 Month</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="font-medium">Commercial</p>
                    <p className="text-purple-600">2-3%</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="font-medium">Plot</p>
                    <p className="text-orange-600">1-1.5%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Appreciation Calculator */}
        <TabsContent value="appreciation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Property Appreciation Calculator</span>
              </CardTitle>
              <CardDescription>Calculate future property value with appreciation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Value (₹)</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    placeholder="Enter current value"
                    value={appreciationCalculator.currentValue}
                    onChange={(e) => setAppreciationCalculator(prev => ({ ...prev, currentValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appreciationRate">Annual Appreciation Rate (%)</Label>
                  <Input
                    id="appreciationRate"
                    type="number"
                    step="0.1"
                    placeholder="Enter rate"
                    value={appreciationCalculator.appreciationRate}
                    onChange={(e) => setAppreciationCalculator(prev => ({ ...prev, appreciationRate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years">Number of Years</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="Enter years"
                    value={appreciationCalculator.years}
                    onChange={(e) => setAppreciationCalculator(prev => ({ ...prev, years: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculateAppreciation} className="w-full md:w-auto">
                Calculate Future Value
              </Button>
              
              {appreciationCalculator.futureValue > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-4">Appreciation Projection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-orange-600">Future Value</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatCurrency(appreciationCalculator.futureValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-orange-600">Total Appreciation</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(appreciationCalculator.totalAppreciation)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-orange-600">
                    <p>
                      With {appreciationCalculator.appreciationRate}% annual growth over {appreciationCalculator.years} years
                    </p>
                  </div>
                </div>
              )}

              {/* Market Insights */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Market Appreciation Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-3 bg-white rounded border">
                    <p className="font-medium">Metro Cities</p>
                    <p className="text-blue-600">8-12% annually</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <p className="font-medium">Tier 2 Cities</p>
                    <p className="text-green-600">6-10% annually</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <p className="font-medium">Emerging Areas</p>
                    <p className="text-purple-600">10-15% annually</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalculatorTools;