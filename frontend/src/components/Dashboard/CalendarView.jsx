import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calendar, Clock, Plus, Bell, MapPin, 
  User, Phone, Video, Coffee, Home
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { toast } = useToast();

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Site Visit - Baner Villa",
      type: "visit",
      date: "2025-06-15",
      time: "10:00 AM",
      customer: "Amit Kumar",
      phone: "+91 98765 43211",
      location: "Baner, Pune",
      notes: "Show the garden and parking space",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Follow-up Call - Priya Singh",
      type: "call",
      date: "2025-06-14",
      time: "2:00 PM",
      customer: "Priya Singh",
      phone: "+91 98765 43212",
      location: "Phone Call",
      notes: "Discuss final price negotiation",
      status: "scheduled"
    },
    {
      id: 3,
      title: "Property Documentation",
      type: "documentation",
      date: "2025-06-16",
      time: "11:00 AM",
      customer: "Rohit Mehta",
      phone: "+91 98765 43214",
      location: "Office",
      notes: "Prepare rental agreement",
      status: "scheduled"
    },
    {
      id: 4,
      title: "Registry Meeting",
      type: "registry",
      date: "2025-06-18",
      time: "9:00 AM",
      customer: "Sanjay Gupta",
      phone: "+91 98765 43217",
      location: "Registrar Office",
      notes: "Final registration for Baner villa",
      status: "scheduled"
    },
    {
      id: 5,
      title: "New Lead Meeting",
      type: "meeting",
      date: "2025-06-13",
      time: "4:00 PM",
      customer: "Neha Sharma",
      phone: "+91 98765 43218",
      location: "Coffee Shop, Koregaon Park",
      notes: "Initial discussion for 3BHK requirement",
      status: "completed"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'call',
    date: '',
    time: '',
    customer: '',
    phone: '',
    location: '',
    notes: ''
  });

  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now(),
      status: 'scheduled'
    };

    setEvents([event, ...events]);
    setNewEvent({
      title: '', type: 'call', date: '', time: '', customer: '', phone: '', location: '', notes: ''
    });
    setIsAddEventOpen(false);
    toast({
      title: "Event Added",
      description: "New event has been scheduled successfully",
    });
  };

  const markAsCompleted = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, status: 'completed' } : event
    ));
    toast({
      title: "Event Completed",
      description: "Event marked as completed",
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'visit': return Home;
      case 'call': return Phone;
      case 'meeting': return Coffee;
      case 'documentation': return Calendar;
      case 'registry': return Calendar;
      default: return Calendar;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'visit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call': return 'bg-green-100 text-green-800 border-green-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'documentation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'registry': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingEvents = events.filter(event => 
    new Date(event.date) >= new Date() && event.status === 'scheduled'
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const todayEvents = events.filter(event => 
    event.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Calendar & Reminders</h2>
          <p className="text-gray-600">Manage your site visits, follow-ups, and meetings</p>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
              <DialogDescription>Add a new event to your calendar</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g., Site Visit - Baner Villa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">Site Visit</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="registry">Registry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={newEvent.customer}
                    onChange={(e) => setNewEvent({...newEvent, customer: e.target.value})}
                    placeholder="Customer name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEvent.phone}
                    onChange={(e) => setNewEvent({...newEvent, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Meeting location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                  placeholder="Additional notes for this event"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEvent}>Schedule Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Today's Schedule</span>
          </CardTitle>
          <CardDescription>Your events for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div key={event.id} className={`p-4 rounded-lg border ${getEventColor(event.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <EventIcon className="h-5 w-5 mt-1" />
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{event.customer}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          {event.notes && (
                            <p className="text-sm mt-2 opacity-80">{event.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        {event.status === 'scheduled' && (
                          <Button size="sm" onClick={() => markAsCompleted(event.id)}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Upcoming Events</span>
          </CardTitle>
          <CardDescription>Your upcoming schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 10).map((event) => {
              const EventIcon = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                    <EventIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{event.customer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{event.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {event.notes && (
                      <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Types Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {['visit', 'call', 'meeting', 'documentation', 'registry'].map((type) => {
          const count = events.filter(event => event.type === type && event.status === 'scheduled').length;
          const EventIcon = getEventIcon(type);
          return (
            <Card key={type} className="text-center">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${getEventColor(type)}`}>
                  <EventIcon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{type}s</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;