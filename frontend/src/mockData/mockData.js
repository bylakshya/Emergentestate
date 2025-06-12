export const mockProperties = [
  {
    id: 1,
    title: "Luxury Villa in Baner",
    type: "Villa",
    status: "For Sale",
    price: "₹2.5 Cr",
    size: "3000 sq ft",
    facing: "East",
    address: "Baner, Pune, Maharashtra",
    bedrooms: 4,
    bathrooms: 3,
    isHot: true,
    hasGarden: true,
    isCorner: true,
    vastuCompliant: true,
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400"],
    owner: {
      name: "Raj Sharma",
      phone: "+91 98765 43210",
      email: "raj.sharma@email.com"
    },
    interestedCustomers: [
      { id: 1, name: "Amit Kumar", phone: "+91 98765 43211", budget: "₹2-3 Cr", status: "Interested" },
      { id: 2, name: "Priya Singh", phone: "+91 98765 43212", budget: "₹2.5 Cr", status: "Visit Done" }
    ],
    nextFollowUp: "2025-06-15",
    dealStatus: "Follow-up",
    brokerageAmount: "₹2.5 Lakh",
    area: "Baner"
  },
  {
    id: 2,
    title: "2BHK Apartment in Wakad",
    type: "Apartment",
    status: "For Rent",
    price: "₹25,000/month",
    size: "1200 sq ft",
    facing: "North",
    address: "Wakad, Pune, Maharashtra",
    bedrooms: 2,
    bathrooms: 2,
    isHot: false,
    hasGarden: false,
    isCorner: false,
    vastuCompliant: true,
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"],
    owner: {
      name: "Sneha Patel",
      phone: "+91 98765 43213",
      email: "sneha.patel@email.com"
    },
    interestedCustomers: [
      { id: 3, name: "Rohit Mehta", phone: "+91 98765 43214", budget: "₹20-30k", status: "Call" }
    ],
    nextFollowUp: "2025-06-13",
    dealStatus: "Interested",
    brokerageAmount: "₹25,000",
    area: "Wakad"
  },
  {
    id: 3,
    title: "Commercial Plot in Hinjewadi",
    type: "Plot",
    status: "For Sale",
    price: "₹1.2 Cr",
    size: "2400 sq ft",
    facing: "West",
    address: "Hinjewadi, Pune, Maharashtra",
    bedrooms: 0,
    bathrooms: 0,
    isHot: true,
    hasGarden: false,
    isCorner: true,
    vastuCompliant: false,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    owner: {
      name: "Vikram Desai",
      phone: "+91 98765 43215",
      email: "vikram.desai@email.com"
    },
    interestedCustomers: [],
    nextFollowUp: "2025-06-20",
    dealStatus: "Registry",
    brokerageAmount: "₹1.2 Lakh",
    area: "Hinjewadi"
  }
];

export const mockCustomers = [
  {
    id: 1,
    name: "Amit Kumar",
    phone: "+91 98765 43211",
    email: "amit.kumar@email.com",
    budget: "₹2-3 Cr",
    interest: "Villa, Apartment",
    status: "Interested",
    isImportant: true,
    followUpDate: "2025-06-15",
    notes: "Looking for 3-4 BHK in Baner area",
    addedDate: "2025-06-01"
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "+91 98765 43212",
    email: "priya.singh@email.com",
    budget: "₹2.5 Cr",
    interest: "Villa",
    status: "Visit Done",
    isImportant: false,
    followUpDate: "2025-06-14",
    notes: "Visited Baner villa, needs some time to decide",
    addedDate: "2025-06-02"
  },
  {
    id: 3,
    name: "Rohit Mehta",
    phone: "+91 98765 43214",
    email: "rohit.mehta@email.com",
    budget: "₹20-30k/month",
    interest: "Apartment",
    status: "Call",
    isImportant: false,
    followUpDate: "2025-06-13",
    notes: "Looking for rental apartment in Wakad",
    addedDate: "2025-06-03"
  },
  {
    id: 4,
    name: "Neha Joshi",
    phone: "+91 98765 43216",
    email: "neha.joshi@email.com",
    budget: "₹1-1.5 Cr",
    interest: "Plot",
    status: "Deal Lost",
    isImportant: false,
    followUpDate: null,
    notes: "Decided to buy from another broker",
    addedDate: "2025-05-20"
  },
  {
    id: 5,
    name: "Sanjay Gupta",
    phone: "+91 98765 43217",
    email: "sanjay.gupta@email.com",
    budget: "₹3-4 Cr",
    interest: "Villa",
    status: "Closed",
    isImportant: true,
    followUpDate: null,
    notes: "Deal closed successfully",
    addedDate: "2025-05-15"
  }
];

export const mockDeals = [
  {
    id: 1,
    propertyTitle: "Luxury Villa in Baner",
    customerName: "Sanjay Gupta",
    status: "Closed",
    dealValue: "₹2.5 Cr",
    brokerageAmount: "₹2.5 Lakh",
    startDate: "2025-05-15",
    closeDate: "2025-06-01",
    notes: "Smooth transaction, customer was very cooperative"
  },
  {
    id: 2,
    propertyTitle: "2BHK Apartment in Wakad",
    customerName: "Rohit Mehta",
    status: "Agreement",
    dealValue: "₹25,000/month",
    brokerageAmount: "₹25,000",
    startDate: "2025-06-03",
    closeDate: null,
    notes: "Agreement signed, waiting for registry"
  },
  {
    id: 3,
    propertyTitle: "Commercial Plot in Hinjewadi",
    customerName: "Neha Joshi",
    status: "Cancelled",
    dealValue: "₹1.2 Cr",
    brokerageAmount: "₹0",
    startDate: "2025-05-20",
    closeDate: "2025-06-05",
    notes: "Customer backed out due to budget constraints"
  }
];

export const mockBrokerageData = [
  { month: "Jan", amount: 125000 },
  { month: "Feb", amount: 180000 },
  { month: "Mar", amount: 220000 },
  { month: "Apr", amount: 190000 },
  { month: "May", amount: 250000 },
  { month: "Jun", amount: 275000 }
];

export const mockProjects = [
  {
    id: 1,
    name: "Sunset Heights",
    area: "Baner",
    totalPlots: 50,
    soldPlots: 32,
    availablePlots: 15,
    reservedPlots: 3,
    priceRange: "₹80L - ₹1.2Cr",
    layoutApproval: "Approved",
    completionDate: "2025-12-31",
    plots: [
      {
        plotNumber: "A-001",
        size: "1200 sq ft",
        price: "₹80 Lakh",
        facing: "East",
        status: "Sold",
        hasGarden: true,
        isCorner: false,
        isHot: false,
        buyer: {
          name: "Rajesh Kumar",
          phone: "+91 98765 43220",
          govtId: "ABCDE1234F",
          broker: "Amit Broker"
        },
        payments: [
          { date: "2025-01-15", amount: "₹20 Lakh", type: "Booking", status: "Paid" },
          { date: "2025-03-15", amount: "₹30 Lakh", type: "Installment", status: "Paid" },
          { date: "2025-06-15", amount: "₹30 Lakh", type: "Installment", status: "Pending" }
        ]
      },
      {
        plotNumber: "A-002",
        size: "1500 sq ft",
        price: "₹1 Cr",
        facing: "North",
        status: "Available",
        hasGarden: false,
        isCorner: true,
        isHot: true,
        buyer: null,
        payments: []
      },
      {
        plotNumber: "A-003",
        size: "1800 sq ft",
        price: "₹1.2 Cr",
        facing: "West",
        status: "Reserved",
        hasGarden: true,
        isCorner: true,
        isHot: false,
        buyer: {
          name: "Priya Sharma",
          phone: "+91 98765 43221",
          govtId: "FGHIJ5678K",
          broker: null
        },
        payments: [
          { date: "2025-06-01", amount: "₹12 Lakh", type: "Token", status: "Paid" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Green Valley",
    area: "Wakad",
    totalPlots: 30,
    soldPlots: 18,
    availablePlots: 10,
    reservedPlots: 2,
    priceRange: "₹60L - ₹90L",
    layoutApproval: "Pending",
    completionDate: "2026-06-30",
    plots: []
  }
];

export const mockBuilderCustomers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 98765 43220",
    email: "rajesh.kumar@email.com",
    budget: "₹80L - ₹1Cr",
    interest: "Plot",
    status: "Closed",
    project: "Sunset Heights",
    plotNumber: "A-001",
    addedDate: "2025-01-10",
    notes: "Purchased plot A-001 in Sunset Heights"
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "+91 98765 43221",
    email: "priya.sharma@email.com",
    budget: "₹1-1.5Cr",
    interest: "Plot",
    status: "Reserved",
    project: "Sunset Heights",
    plotNumber: "A-003",
    addedDate: "2025-05-20",
    notes: "Reserved plot A-003, pending final payment"
  }
];

export const mockFinancialData = [
  { month: "Jan", revenue: 1600000, expenses: 400000 },
  { month: "Feb", revenue: 2400000, expenses: 600000 },
  { month: "Mar", revenue: 1800000, expenses: 450000 },
  { month: "Apr", revenue: 3200000, expenses: 800000 },
  { month: "May", revenue: 2800000, expenses: 700000 },
  { month: "Jun", revenue: 3600000, expenses: 900000 }
];

export const mockTeamMembers = [
  {
    id: 1,
    name: "Amit Patel",
    email: "amit.patel@company.com",
    role: "Sales Manager",
    phone: "+91 98765 43230",
    joinDate: "2024-01-15",
    permissions: ["view_all", "edit_customers", "edit_plots"]
  },
  {
    id: 2,
    name: "Sunita Desai",
    email: "sunita.desai@company.com",
    role: "Finance Manager",
    phone: "+91 98765 43231",
    joinDate: "2024-03-20",
    permissions: ["view_all", "edit_finance"]
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: "Payment Due",
    message: "Rajesh Kumar - A-001 payment of ₹30 Lakh due on 15th June",
    type: "payment",
    date: "2025-06-12",
    isRead: false
  },
  {
    id: 2,
    title: "Follow-up Reminder",
    message: "Call Priya Singh regarding Baner villa visit",
    type: "followup",
    date: "2025-06-12",
    isRead: false
  },
  {
    id: 3,
    title: "New Inquiry",
    message: "New customer inquiry for 2BHK apartment in Wakad",
    type: "inquiry",
    date: "2025-06-11",
    isRead: true
  }
];

export const dashboardStats = {
  broker: {
    totalProperties: mockProperties.length,
    totalCustomers: mockCustomers.length,
    activeDeals: mockDeals.filter(d => d.status !== 'Closed' && d.status !== 'Cancelled').length,
    monthlyBrokerage: "₹2.75 Lakh",
    totalBrokerage: "₹15.5 Lakh"
  },
  builder: {
    totalProjects: mockProjects.length,
    totalPlots: mockProjects.reduce((acc, project) => acc + project.totalPlots, 0),
    soldPlots: mockProjects.reduce((acc, project) => acc + project.soldPlots, 0),
    monthlyRevenue: "₹36 Lakh",
    totalRevenue: "₹2.4 Cr"
  }
};