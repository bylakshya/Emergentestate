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
  Search, Filter, Plus, MapPin, Bed, Bath, Square, 
  Eye, Edit, Trash2, Star, Calendar, Phone, Mail,
  Home, TrendingUp, Clock, CheckCircle
} from 'lucide-react';
import { mockProperties } from '../../mockData/mockData';
import { useToast } from '../../hooks/use-toast';

const PropertyManager = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const { toast } = useToast();

  const [newProperty, setNewProperty] = useState({
    title: '',
    type: '',
    status: 'For Sale',
    price: '',
    size: '',
    facing: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    isHot: false,
    hasGarden: false,
    isCorner: false,
    vastuCompliant: false,
    owner: { name: '', phone: '', email: '' },
    area: '',
    brokerageAmount: ''
  });

  // Filter properties based on search and filters
  React.useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterArea !== 'all') {
      filtered = filtered.filter(property => property.area === filterArea);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(property => property.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(property => property.type === filterType);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filterArea, filterStatus, filterType]);

  const handleAddProperty = () => {
    const property = {
      ...newProperty,
      id: Date.now(),
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"],
      interestedCustomers: [],
      nextFollowUp: new Date().toISOString().split('T')[0],
      dealStatus: 'Interested'
    };

    setProperties([property, ...properties]);
    setNewProperty({
      title: '', type: '', status: 'For Sale', price: '', size: '', facing: '',
      address: '', bedrooms: '', bathrooms: '', isHot: false, hasGarden: false,
      isCorner: false, vastuCompliant: false, owner: { name: '', phone: '', email: '' },
      area: '', brokerageAmount: ''
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Property Added",
      description: "New property has been added successfully",
    });
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: "Property Deleted",
      description: "Property has been removed from your listings",
    });
  };

  const toggleHotProperty = (id) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, isHot: !p.isHot } : p
    ));
    toast({
      title: "Property Updated",
      description: "Hot property status updated",
    });
  };

  const areas = [...new Set(properties.map(p => p.area))];
  const propertyTypes = [...new Set(properties.map(p => p.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Property Manager</h2>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Add a new property to your listings</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={newProperty.title}
                  onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                  placeholder="e.g., Luxury Villa in Baner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select onValueChange={(value) => setNewProperty({...newProperty, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setNewProperty({...newProperty, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={newProperty.price}
                  onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                  placeholder="e.g., ₹2.5 Cr or ₹25,000/month"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={newProperty.size}
                  onChange={(e) => setNewProperty({...newProperty, size: e.target.value})}
                  placeholder="e.g., 3000 sq ft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facing">Facing</Label>
                <Select onValueChange={(value) => setNewProperty({...newProperty, facing: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  placeholder="Full property address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={newProperty.bedrooms}
                  onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                  placeholder="Number of bedrooms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={newProperty.bathrooms}
                  onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                  placeholder="Number of bathrooms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={newProperty.area}
                  onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                  placeholder="e.g., Baner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brokerageAmount">Brokerage Amount</Label>
                <Input
                  id="brokerageAmount"
                  value={newProperty.brokerageAmount}
                  onChange={(e) => setNewProperty({...newProperty, brokerageAmount: e.target.value})}
                  placeholder="e.g., ₹2.5 Lakh"
                />
              </div>
              <div className="col-span-2 space-y-4">
                <h4 className="font-semibold">Owner Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    value={newProperty.owner.name}
                    onChange={(e) => setNewProperty({
                      ...newProperty, 
                      owner: {...newProperty.owner, name: e.target.value}
                    })}
                    placeholder="Owner name"
                  />
                  <Input
                    value={newProperty.owner.phone}
                    onChange={(e) => setNewProperty({
                      ...newProperty, 
                      owner: {...newProperty.owner, phone: e.target.value}
                    })}
                    placeholder="Owner phone"
                  />
                  <Input
                    value={newProperty.owner.email}
                    onChange={(e) => setNewProperty({
                      ...newProperty, 
                      owner: {...newProperty.owner, email: e.target.value}
                    })}
                    placeholder="Owner email"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProperty}>Add Property</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant={property.status === 'For Sale' ? 'default' : 'secondary'}>
                  {property.status}
                </Badge>
                {property.isHot && <Badge variant="destructive">🔥 Hot</Badge>}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => toggleHotProperty(property.id)}
              >
                <Star className={`h-4 w-4 ${property.isHot ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-gray-600 text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">{property.price}</span>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms}
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.size}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {property.hasGarden && <Badge variant="outline" className="text-xs">Garden</Badge>}
                  {property.isCorner && <Badge variant="outline" className="text-xs">Corner</Badge>}
                  {property.vastuCompliant && <Badge variant="outline" className="text-xs">Vastu</Badge>}
                  <Badge variant="outline" className="text-xs">{property.facing} Facing</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Owner:</span>
                    <span className="font-medium">{property.owner.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Interested:</span>
                    <span className="font-medium">{property.interestedCustomers.length} customers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Next Follow-up:</span>
                    <span className="font-medium">{property.nextFollowUp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deal Status:</span>
                    <Badge variant={
                      property.dealStatus === 'Finalized' ? 'default' :
                      property.dealStatus === 'Cancelled' ? 'destructive' : 'secondary'
                    }>
                      {property.dealStatus}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No properties found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyManager;