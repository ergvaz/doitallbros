import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// SVG Icons
const Icons = {
  recurring: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M24 12v12l8 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M30 10a14 14 0 0 1 0 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  landscaping: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M24 22v18M16 30l8 8 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  home: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24l16-16 16 16v16a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V24z" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M18 40V28h12v12" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  moving: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="14" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M10 24h28M18 14v10M30 14v10" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  tech: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M14 38h20M24 32v6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  pet: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="28" rx="12" ry="10" stroke="currentColor" strokeWidth="3" fill="white"/>
      <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="3" fill="white"/>
      <circle cx="32" cy="18" r="4" stroke="currentColor" strokeWidth="3" fill="white"/>
      <circle cx="12" cy="26" r="3" stroke="currentColor" strokeWidth="3" fill="white"/>
      <circle cx="36" cy="26" r="3" stroke="currentColor" strokeWidth="3" fill="white"/>
    </svg>
  ),
  business: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M16 16V12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4M8 24h32" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  emergency: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" fill="white"/>
      <path d="M24 16v12M24 32v2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
};

// Service data with all pricing updates
const serviceData = {
  recurring: {
    title: "Recurring Services",
    icon: Icons.recurring,
    color: "#6366F1",
    services: [
      { 
        name: "Basic Lawn Care", 
        price: "$45-$110",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Cozy cottage lawn", price: 45 },
          medium: { label: "Medium Yard", example: "🏠 Standard suburban yard", price: 60 },
          large: { label: "Large Yard", example: "🏘️ Spacious property", price: 80 },
          xl: { label: "Extra Large Yard", example: "🏰 Estate-sized grounds", price: 110 }
        },
        recurring: true,
        relatedServices: ["mulching", "hedgeTrimming", "weedRemoval"]
      },
      { 
        name: "Advanced Lawn Care", 
        price: "$95-$160",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Cozy cottage lawn", price: 95 },
          medium: { label: "Medium Yard", example: "🏠 Standard suburban yard", price: 110 },
          large: { label: "Large Yard", example: "🏘️ Spacious property", price: 130 },
          xl: { label: "Extra Large Yard", example: "🏰 Estate-sized grounds", price: 160 }
        },
        recurring: true,
        materialNote: true
      },
      { 
        name: "Dog Walking", 
        price: "$25/30min (1hr minimum)",
        basePrice: 25,
        recurring: true, 
        isDogWalking: true 
      },
      { 
        name: "Mulching", 
        price: "$100-$325",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Area", example: "🌸 Few flower beds", price: 100 },
          medium: { label: "Medium Area", example: "🌻 Multiple garden beds", price: 150 },
          large: { label: "Large Area", example: "🌳 Extensive landscaping", price: 225 },
          xl: { label: "Extra Large Area", example: "🏞️ Full property coverage", price: 325 }
        },
        recurring: true,
        materialNote: true 
      },
      { 
        name: "Gutter Cleaning", 
        price: "$150-$400",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small House", example: "🏡 Single-story cottage", price: 150 },
          medium: { label: "Medium House", example: "🏠 Two-story home", price: 175 },
          large: { label: "Large House", example: "🏘️ Spacious two-story", price: 250 },
          xl: { label: "Extra Large House", example: "🏰 Multi-story estate", price: 400 }
        },
        recurring: true 
      },
      { 
        name: "Power Washing", 
        price: "$60-$300",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Area", example: "🚶 Walkway", price: 60 },
          medium: { label: "Medium Area", example: "☀️ Patio", price: 120 },
          large: { label: "Large Area", example: "🚗 Driveway", price: 225 },
          xl: { label: "Extra Large Area", example: "🏠 House siding", price: 300 }
        },
        recurring: true 
      }
    ]
  },
  landscaping: {
    title: "Landscaping & Outdoor",
    icon: Icons.landscaping,
    color: "#10B981",
    services: [
      { 
        name: "Lawn Mowing & Edging", 
        price: "$45-$110",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Cozy cottage lawn", price: 45 },
          medium: { label: "Medium Yard", example: "🏠 Standard suburban yard", price: 60 },
          large: { label: "Large Yard", example: "🏘️ Spacious property", price: 80 },
          xl: { label: "Extra Large Yard", example: "🏰 Estate-sized grounds", price: 110 }
        },
        relatedServices: ["weedRemoval", "hedgeTrimming", "leafCleanup"],
        extraOvergrown: true
      },
      { name: "Weed Removal & Prevention", price: "$45", id: "weedRemoval", materialNote: true },
      { 
        name: "Hedge, Bush & Tree Trimming", 
        price: "$60-$225",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Job", example: "🌿 Few small bushes", price: 60 },
          medium: { label: "Medium Job", example: "🌳 Several hedges", price: 85 },
          large: { label: "Large Job", example: "🌲 Multiple large trees", price: 150 },
          xl: { label: "Extra Large Job", example: "🏞️ Extensive trimming", price: 225 }
        },
        id: "hedgeTrimming" 
      },
      { 
        name: "Leaf Cleanup & Yard Debris Removal", 
        price: "$50-$150",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Light cleanup", price: 50 },
          medium: { label: "Medium Yard", example: "🏠 Moderate debris", price: 75 },
          large: { label: "Large Yard", example: "🏘️ Heavy coverage", price: 110 },
          xl: { label: "Extra Large Yard", example: "🏰 Extensive cleanup", price: 150 }
        },
        id: "leafCleanup" 
      },
      { 
        name: "Mulching (beds, trees, walkways)", 
        price: "$100-$325", 
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Area", example: "🌸 Few flower beds", price: 100 },
          medium: { label: "Medium Area", example: "🌻 Multiple garden beds", price: 150 },
          large: { label: "Large Area", example: "🌳 Extensive landscaping", price: 225 },
          xl: { label: "Extra Large Area", example: "🏞️ Full property coverage", price: 325 }
        },
        materialNote: true,
        relatedServices: ["gardenBed", "weedRemoval"]
      },
      { name: "Garden Bed Installation", price: "$150-$450", materialNote: true, id: "gardenBed" },
      { name: "Soil Leveling & Patch Repair", price: "$40", materialNote: true },
      { 
        name: "Snow Shoveling & De-icing", 
        price: "$50-$150",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Area", example: "🚶 Walkway only", price: 50 },
          medium: { label: "Medium Area", example: "🏡 Driveway & walkway", price: 80 },
          large: { label: "Large Area", example: "🏠 Large driveway", price: 110 },
          xl: { label: "Extra Large Area", example: "🏘️ Multiple areas", price: 150 }
        },
        materialNote: true 
      }
    ]
  },
  homeMaintenance: {
    title: "Home Maintenance & Care",
    icon: Icons.home,
    color: "#8B5CF6",
    services: [
      { 
        name: "Power Washing (driveways, sidewalks, patios)", 
        price: "$60-$300",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Area", example: "🚶 Walkway", price: 60 },
          medium: { label: "Medium Area", example: "☀️ Patio", price: 120 },
          large: { label: "Large Area", example: "🚗 Driveway", price: 225 },
          xl: { label: "Extra Large Area", example: "🏠 House siding", price: 300 }
        }
      },
      { name: "Furniture Assembly (IKEA, Wayfair, etc.)", price: "$50 per", perItem: true },
      { name: "Picture Hanging & Wall Mounting", price: "$20 per", perItem: true, materialNote: true },
      { name: "Door Handle & Lock Replacement", price: "$45 per", perItem: true, materialNote: true },
      {
        name: "Light Bulb & Fixture Replacement",
        price: "$10/bulb (min $40) + $45/fixture",
        isLightBulb: true,
        materialNote: true
      },
      { name: "Smoke Detector Installation", price: "$50 per", perItem: true, materialNote: true },
      { 
        name: "Gutter Cleaning", 
        price: "$150-$400",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small House", example: "🏡 Single-story cottage", price: 150 },
          medium: { label: "Medium House", example: "🏠 Two-story home", price: 175 },
          large: { label: "Large House", example: "🏘️ Spacious two-story", price: 250 },
          xl: { label: "Extra Large House", example: "🏰 Multi-story estate", price: 400 }
        }
      },
      { name: "Roof Cleaning", price: "$150-$350" },
      { name: "Minor Drywall Patching", price: "$65", materialNote: true },
      {
        name: "Basic Painting & Touch-ups",
        price: "$65 small / $100 large",
        sizePricing: {
          small: { label: "Small Job", example: "🖌️ Touch-ups & small areas", price: 65 },
          large: { label: "Large Job", example: "🎨 Full room or multiple areas", price: 100 }
        },
        sizeDependent: true,
        materialNote: true
      },
      { name: "Curtain & Blind Installation", price: "$65 per", perItem: true, materialNote: true },
      { 
        name: "Window Cleaning", 
        price: "$160-$450",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small House", example: "🏡 Few windows", price: 160 },
          medium: { label: "Medium House", example: "🏠 Standard home", price: 200 },
          large: { label: "Large House", example: "🏘️ Many windows", price: 300 },
          xl: { label: "Extra Large House", example: "🏰 Extensive windows", price: 450 }
        }
      }
    ]
  },
  movingOrganization: {
    title: "Moving, Organization & Junk Removal",
    icon: Icons.moving,
    color: "#F59E0B",
    services: [
      { name: "Junk Removal", price: "$125/hour (3-hour minimum)", hourly: true, hourlyRate: 125, minHours: 3 },
      { name: "Estate Cleanout", price: "$150/hour (3-hour minimum)", hourly: true, hourlyRate: 150, minHours: 3 },
      { name: "Moving Help", price: "$65/hour (3-hour minimum)", hourly: true, hourlyRate: 65, minHours: 3 },
      { name: "Closet & Storage Organization", price: "$70/hour (2.5-hour minimum)", hourly: true, hourlyRate: 70, minHours: 2.5 },
      { name: "Appliance Cleaning (fridge, oven)", price: "$75 per appliance", perItem: true },
      { name: "Outdoor Trash Bin Cleaning", price: "$40 per bin", perItem: true },
      { name: "Furniture Rearrangement", price: "$60/hour (2-hour minimum)", hourly: true, hourlyRate: 60, minHours: 2 },
      { name: "Heavy Lifting Assistance", price: "$70/hour (2-person crew, 3-hour minimum)", hourly: true, hourlyRate: 70, minHours: 3 },
      { name: "Appliance Moving", price: "Starting at $120" }
    ]
  },
  tech: {
    title: "Tech Help & Smart Home",
    icon: Icons.tech,
    color: "#06B6D4",
    services: [
      { name: "Wi-Fi Setup & Troubleshooting", price: "$75/hour (2-hour minimum)", hourly: true, hourlyRate: 75, minHours: 2 },
      { name: "TV Mounting & Setup", price: "$140 (mount not included)", materialNote: true },
      { name: "Streaming Device Setup", price: "$60/hour (2-hour minimum)", hourly: true, hourlyRate: 60, minHours: 2 },
      { name: "Computer Setup (Mac & Windows)", price: "$45/hour (2-hour minimum)", hourly: true, hourlyRate: 45, minHours: 2 },
      { name: "Software Installs & Updates", price: "$45/hour (2-hour minimum)", hourly: true, hourlyRate: 45, minHours: 2 },
      { name: "Printer Setup & Troubleshooting", price: "$60/hour (2-hour minimum)", hourly: true, hourlyRate: 60, minHours: 2 },
      { name: "Smart Thermostat Installation", price: "$140", materialNote: true },
      { name: "Smart Doorbell & Camera Setup", price: "$150", materialNote: true },
      { name: "Phone Setup & Basic Tech Help", price: "$45/hour (2-hour minimum)", hourly: true, hourlyRate: 45, minHours: 2 },
      { name: "Data Transfer Between Devices", price: "$40/hour (2-hour minimum)", hourly: true, hourlyRate: 40, minHours: 2 }
    ]
  },
  petCare: {
    title: "Pet & Outdoor Care",
    icon: Icons.pet,
    color: "#EC4899",
    services: [
      { name: "Dog Waste Cleanup", price: "$60 per job" },
      { name: "Dog Walking", price: "$25 per 30 minutes (1-hour minimum)", basePrice: 25, isDogWalking: true },
      { name: "Fence Checks & Minor Repairs", price: "$60/hour (2-hour minimum)", hourly: true, hourlyRate: 60, minHours: 2, materialNote: true },
      { name: "Outdoor Pet Shelter Setup", price: "$150", materialNote: true }
    ]
  },
  business: {
    title: "Small Business & Office",
    icon: Icons.business,
    color: "#7C3AED",
    services: [
      { name: "Office Furniture Assembly", price: "$85 per item", perItem: true },
      { name: "Desk & Workstation Setup", price: "$100 per station", perItem: true },
      { name: "Cable Management", price: "$75" },
      { name: "TV & Whiteboard Mounting", price: "$140", materialNote: true },
      { name: "Light Office Cleaning", price: "$50/hour (2-hour minimum)", hourly: true, hourlyRate: 50, minHours: 2 },
      { name: "Inventory Room Organization", price: "$60/hour (3-hour minimum)", hourly: true, hourlyRate: 60, minHours: 3 }
    ]
  },
  emergency: {
    title: "Emergency & Same-Day Help",
    icon: Icons.emergency,
    color: "#EF4444",
    services: [
      { name: "Same-Day Junk Removal", price: "Standard rate × 1.5", isEmergency: true, baseService: "Junk Removal" },
      { name: "Emergency Snow Removal", price: "Standard rate × 1.5", isEmergency: true, baseService: "Snow Shoveling & De-icing" },
      { name: "Urgent Tech Fixes", price: "Standard rate × 1.5", isEmergency: true },
      { name: "Last-Minute Moving Help", price: "Standard rate × 1.5", isEmergency: true, baseService: "Moving Help" },
      { name: "Storm Debris Cleanup", price: "Standard rate × 1.5", isEmergency: true, baseService: "Leaf Cleanup & Yard Debris Removal" }
    ]
  }
};

// Cart Context
const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Date.now() }]);
  };
  
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Homepage Component
function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="homepage">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-main">DoItAllBros</span>
            <span className="title-sub">Louisville's Local Service Pros</span>
          </h1>
          <p className="hero-description">
            From lawn care to tech help, we handle the jobs you don't have time for.
            Professional service, local roots, fair prices.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => navigate('/categories')}>
              Schedule a Service
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Fast Response</h3>
            <p>Same-day service available</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">✓</span>
            <h3>Local & Trusted</h3>
            <p>Serving Louisville, KY</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💰</span>
            <h3>Fair Pricing</h3>
            <p>Transparent rates, no surprises</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Categories Page
function CategoriesPage() {
  const navigate = useNavigate();
  
  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Choose Your Service Category</h1>
        <p>Select a category to view available services</p>
      </div>
      <div className="categories-grid">
        {Object.entries(serviceData).map(([key, category]) => (
          <div 
            key={key}
            className="category-card"
            onClick={() => navigate(`/services/${key}`)}
            style={{'--category-color': category.color}}
          >
            <div className="category-icon" style={{color: category.color}}>{category.icon}</div>
            <h3 className="category-title">{category.title}</h3>
            <div className="category-count">{category.services.length} services</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Services Page
function ServicesPage() {
  const navigate = useNavigate();
  const { cart } = React.useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  useEffect(() => {
    const path = window.location.pathname;
    const categoryKey = path.split('/services/')[1];
    setSelectedCategory(categoryKey);
  }, []);
  
  if (!selectedCategory || !serviceData[selectedCategory]) {
    return <div className="loading">Loading...</div>;
  }
  
  const category = serviceData[selectedCategory];
  
  return (
    <div className="services-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/categories')}>
          ← Back to Categories
        </button>
        <div className="category-header">
          <span className="category-icon-large" style={{color: category.color}}>
            {category.icon}
          </span>
          <h1>{category.title}</h1>
        </div>
      </div>
      
      {cart.length > 0 && (
        <div className="cart-summary">
          <span>{cart.length} service(s) in visit</span>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
            View Visit & Checkout →
          </button>
        </div>
      )}
      
      <div className="services-grid">
        {category.services.map((service, index) => (
          <div 
            key={index}
            className="service-card"
            onClick={() => navigate(`/add-service/${selectedCategory}/${index}`)}
          >
            <h3 className="service-name">{service.name}</h3>
            <div className="service-price">{service.price}</div>
            {service.materialNote && (
              <span className="material-note">Materials not included</span>
            )}
            {service.recurring && <span className="recurring-badge">Recurring Available</span>}
            {service.perItem && <span className="per-item-badge">Per Item</span>}
            {service.isDogWalking && <span className="dog-walking-badge">Custom Duration</span>}
            {service.extraOvergrown && <span className="extra-badge">+$40 if overgrown</span>}
            {service.hourly && <span className="hourly-badge">Hourly Rate</span>}
            {service.isEmergency && <span className="emergency-badge">1.5× Rate</span>}
            <button className="service-btn">Add to Visit →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add Service Page Component
function AddServicePage() {
  const navigate = useNavigate();
  const { addToCart } = React.useContext(CartContext);
  const [categoryKey, setCategoryKey] = useState(null);
  const [serviceIndex, setServiceIndex] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [dogWalkDuration, setDogWalkDuration] = useState(60);
  const [dogCount, setDogCount] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('');
  const [recurringCount, setRecurringCount] = useState(4);
  const [paymentType, setPaymentType] = useState('per-job');
  const [extraOvergrown, setExtraOvergrown] = useState(false);
  const [bulbCount, setBulbCount] = useState(0);
  const [fixtureCount, setFixtureCount] = useState(0);
  const [hours, setHours] = useState(0);
  const [urgencyDescription, setUrgencyDescription] = useState('');
  
  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/add-service/')[1].split('/');
    setCategoryKey(parts[0]);
    setServiceIndex(parseInt(parts[1]));
  }, []);
  
  if (!categoryKey || serviceIndex === null || !serviceData[categoryKey]) {
    return <div className="loading">Loading...</div>;
  }
  
  const service = serviceData[categoryKey].services[serviceIndex];
  const category = serviceData[categoryKey];
  
  // Calculate price preview for recurring services
  const calculateRecurringPreview = () => {
    if (!isRecurring || !service.sizeDependent || !selectedSize) return null;
    
    const basePrice = service.sizePricing[selectedSize].price;
    let total = basePrice * recurringCount;
    
    if (paymentType === 'one-time') {
      total = total * 0.9; // 10% discount
    }
    
    return {
      basePrice,
      count: recurringCount,
      subtotal: basePrice * recurringCount,
      discount: paymentType === 'one-time' ? (basePrice * recurringCount * 0.1) : 0,
      total
    };
  };
  
  const recurringPreview = calculateRecurringPreview();
  
  const handleAddToCart = () => {
    let calculatedPrice = null;
    
    // Size-dependent pricing
    if (service.sizeDependent && selectedSize) {
      calculatedPrice = service.sizePricing[selectedSize].price;
    }
    // Light bulb pricing
    else if (service.isLightBulb) {
      const bulbTotal = bulbCount * 10;
      const fixtureTotal = fixtureCount * 45;
      const total = Math.max(bulbTotal, 40) + fixtureTotal; // Min $40 for bulbs
      calculatedPrice = total;
    }
    // Hourly pricing
    else if (service.hourly && hours) {
      calculatedPrice = service.hourlyRate * hours;
    }
    // Dog walking
    else if (service.isDogWalking) {
      const intervals = dogWalkDuration / 30;
      const basePrice = service.basePrice * intervals;
      const extraDogCost = (dogCount - 1) * 10 * intervals;
      calculatedPrice = basePrice + extraDogCost;
    }
    // Emergency (1.5x multiplier will be applied at checkout)
    else if (service.isEmergency) {
      calculatedPrice = 'emergency'; // Flag for checkout
    }
    
    const cartItem = {
      category: category.title,
      categoryKey,
      serviceIndex,
      serviceName: service.name,
      basePrice: service.price,
      selectedSize: service.sizeDependent ? selectedSize : null,
      calculatedPrice,
      itemQuantity: service.perItem ? itemQuantity : null,
      bulbCount: service.isLightBulb ? bulbCount : null,
      fixtureCount: service.isLightBulb ? fixtureCount : null,
      hours: service.hourly ? hours : null,
      hourlyRate: service.hourly ? service.hourlyRate : null,
      minHours: service.hourly ? service.minHours : null,
      dogWalking: service.isDogWalking ? { duration: dogWalkDuration, dogCount } : null,
      recurring: isRecurring ? { frequency: recurringFrequency, count: recurringCount, paymentType } : null,
      extraOvergrown: service.extraOvergrown && extraOvergrown,
      isEmergency: service.isEmergency,
      urgencyDescription: service.isEmergency ? urgencyDescription : null,
      materialNote: service.materialNote
    };
    
    addToCart(cartItem);
    navigate(`/services/${categoryKey}`);
  };
  
  return (
    <div className="add-service-page">
      <div className="booking-container">
        <button className="back-btn" onClick={() => navigate(`/services/${categoryKey}`)}>
          ← Back to {category.title}
        </button>
        
        <div className="booking-header">
          <span className="category-icon-large" style={{color: category.color}}>
            {category.icon}
          </span>
          <div>
            <h1>{service.name}</h1>
            <div className="service-price-large">{service.price}</div>
          </div>
        </div>
        
        <div className="service-config">
          {service.materialNote && (
            <div className="material-warning">
              <strong>Note:</strong> Customer is responsible for all materials. If we need to purchase materials, there's a +$15 procurement fee.
            </div>
          )}
          
          {service.sizeDependent && (
            <div className="form-section">
              <h3>Select Size</h3>
              <div className="size-grid">
                {Object.entries(service.sizePricing).map(([key, sizeOption]) => (
                  <label 
                    key={key}
                    className={`size-option ${selectedSize === key ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={key}
                      checked={selectedSize === key}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      required
                    />
                    <div className="size-content">
                      <div className="size-example">{sizeOption.example}</div>
                      <span className="size-label">{sizeOption.label}</span>
                      <span className="size-price">${sizeOption.price}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {service.isLightBulb && (
            <div className="form-section">
              <h3>Select Quantity</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Light Bulbs ($10 each, min $40 total)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={bulbCount}
                    onChange={(e) => setBulbCount(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Fixtures ($45 each)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={fixtureCount}
                    onChange={(e) => setFixtureCount(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              {(bulbCount > 0 || fixtureCount > 0) && (
                <div className="price-preview">
                  Total: ${Math.max(bulbCount * 10, bulbCount > 0 ? 40 : 0) + (fixtureCount * 45)}
                </div>
              )}
            </div>
          )}
          
          {service.hourly && (
            <div className="form-section">
              <h3>Select Hours</h3>
              <div className="form-group">
                <label>Number of Hours (Minimum: {service.minHours} hours)</label>
                <input 
                  type="number" 
                  min={service.minHours}
                  step="0.5"
                  value={hours || service.minHours}
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                />
                <div className="price-preview">
                  Total: ${(hours || service.minHours) * service.hourlyRate}
                </div>
              </div>
            </div>
          )}
          
          {service.isEmergency && (
            <div className="form-section">
              <h3>Emergency Service Details</h3>
              <div className="emergency-warning">
                <strong>⚡ Emergency Rate:</strong> 1.5× standard pricing
              </div>
              <div className="form-group">
                <label>Describe Urgency</label>
                <textarea 
                  rows="4"
                  required
                  placeholder="Please describe why you need emergency service..."
                  value={urgencyDescription}
                  onChange={(e) => setUrgencyDescription(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {service.extraOvergrown && (
            <div className="form-section">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={extraOvergrown}
                  onChange={(e) => setExtraOvergrown(e.target.checked)}
                />
                <span>Yard is extra overgrown (+$40)</span>
              </label>
            </div>
          )}
          
          {service.isDogWalking && (
            <div className="form-section">
              <h3>Dog Walking Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minimum 1 hour)</label>
                  <select value={dogWalkDuration} onChange={(e) => setDogWalkDuration(parseInt(e.target.value))}>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Dogs</label>
                  <input 
                    type="number" 
                    min="1"
                    value={dogCount}
                    onChange={(e) => setDogCount(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="pricing-note">
                <strong>Note:</strong> Each additional dog after the first is +$10 per 30 minutes.
              </div>
              <div className="price-preview">
                Total: ${((dogWalkDuration / 30) * 25) + ((dogCount - 1) * (dogWalkDuration / 30) * 10)}
              </div>
            </div>
          )}
          
          {service.perItem && !service.isLightBulb && (
            <div className="form-section">
              <h3>Quantity</h3>
              <div className="form-group">
                <label>How many items?</label>
                <input 
                  type="number" 
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
          
          {service.recurring && !service.isDogWalking && (
            <div className="form-section recurring-section">
              <h3>Service Type</h3>
              <div className="service-type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${!isRecurring ? 'active' : ''}`}
                  onClick={() => setIsRecurring(false)}
                >
                  One-Time
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${isRecurring ? 'active' : ''}`}
                  onClick={() => setIsRecurring(true)}
                >
                  Recurring
                </button>
              </div>
              
              {isRecurring && (
                <div className="recurring-options">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Frequency</label>
                      <select 
                        required
                        value={recurringFrequency}
                        onChange={(e) => setRecurringFrequency(e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="twice-weekly">Twice a Week</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Services (min. 4)</label>
                      <input 
                        type="number" 
                        min="4"
                        value={recurringCount}
                        onChange={(e) => setRecurringCount(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  {service.sizeDependent && selectedSize && (
                    <div className="payment-options">
                      <h4>Payment Options</h4>
                      <div className="payment-toggle">
                        <label className={`payment-option ${paymentType === 'per-job' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="paymentType"
                            value="per-job"
                            checked={paymentType === 'per-job'}
                            onChange={(e) => setPaymentType(e.target.value)}
                          />
                          <div className="option-content">
                            <span className="option-title">Pay Per Job</span>
                            <span className="option-price">${service.sizePricing[selectedSize].price} per service</span>
                          </div>
                        </label>
                        <label className={`payment-option ${paymentType === 'one-time' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="paymentType"
                            value="one-time"
                            checked={paymentType === 'one-time'}
                            onChange={(e) => setPaymentType(e.target.value)}
                          />
                          <div className="option-content">
                            <span className="option-title">One-Time Payment</span>
                            <span className="option-price">10% OFF</span>
                          </div>
                        </label>
                      </div>
                      
                      {recurringPreview && (
                        <div className="pricing-breakdown">
                          <div className="price-row">
                            <span>Base Price per Service:</span>
                            <span>${recurringPreview.basePrice}</span>
                          </div>
                          <div className="price-row">
                            <span>Number of Services:</span>
                            <span>×{recurringPreview.count}</span>
                          </div>
                          <div className="price-row subtotal">
                            <span>Subtotal:</span>
                            <span>${recurringPreview.subtotal}</span>
                          </div>
                          {recurringPreview.discount > 0 && (
                            <div className="price-row discount">
                              <span>10% Discount:</span>
                              <span>-${recurringPreview.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="price-row total">
                            <span>Total:</span>
                            <span>${recurringPreview.total.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <button className="btn btn-primary btn-large" onClick={handleAddToCart}>
            Add to Visit
          </button>
          <button className="btn btn-secondary btn-large" onClick={() => navigate('/checkout')}>
            Review Visit
          </button>
        </div>
      </div>
    </div>
  );
}

// Checkout Page
function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = React.useContext(CartContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isWeekend, setIsWeekend] = useState(false);
  const [isAfter5pm, setIsAfter5pm] = useState(false);
  const [needsMaterialPurchase, setNeedsMaterialPurchase] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [otherMaterialText, setOtherMaterialText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const day = date.getDay();
      setIsWeekend(day === 0 || day === 6);
    }
  }, [selectedDate]);
  
  useEffect(() => {
    if (selectedTime) {
      const hour = parseInt(selectedTime.split(':')[0]);
      setIsAfter5pm(hour >= 17);
    }
  }, [selectedTime]);
  
  const calculateTotalPrice = () => {
    let subtotal = 0;
    const itemizedServices = [];
    
    cart.forEach(item => {
      let itemPrice = 0;
      let itemDescription = item.serviceName;
      
      // Size-dependent pricing
      if (item.calculatedPrice && typeof item.calculatedPrice === 'number') {
        itemPrice = item.calculatedPrice;
        if (item.selectedSize) {
          const service = serviceData[item.categoryKey].services[item.serviceIndex];
          itemDescription += ` (${service.sizePricing[item.selectedSize].label})`;
        }
      }
      // Emergency services (1.5x)
      else if (item.isEmergency) {
        itemPrice = 150; // Placeholder, will be calculated based on base service
        itemDescription += ` (Emergency - 1.5× rate)`;
      }
      // Light bulb pricing
      else if (item.bulbCount !== null || item.fixtureCount !== null) {
        const bulbTotal = (item.bulbCount || 0) * 10;
        const fixtureTotal = (item.fixtureCount || 0) * 45;
        itemPrice = Math.max(bulbTotal, item.bulbCount > 0 ? 40 : 0) + fixtureTotal;
        itemDescription += ` (${item.bulbCount} bulbs, ${item.fixtureCount} fixtures)`;
      }
      // Hourly pricing
      else if (item.hours && item.hourlyRate) {
        itemPrice = item.hourlyRate * item.hours;
        itemDescription += ` (${item.hours} hours)`;
      }
      // Dog walking
      else if (item.dogWalking) {
        const intervals = item.dogWalking.duration / 30;
        const basePrice = 25 * intervals;
        const extraDogCost = (item.dogWalking.dogCount - 1) * 10 * intervals;
        itemPrice = basePrice + extraDogCost;
        itemDescription += ` (${item.dogWalking.duration} min, ${item.dogWalking.dogCount} dogs)`;
      }
      // Per-item pricing
      else if (item.itemQuantity) {
        const match = item.basePrice.match(/\$(\d+)/);
        if (match) {
          itemPrice = parseInt(match[1]) * item.itemQuantity;
          itemDescription += ` (×${item.itemQuantity})`;
        }
      }
      // Fixed/range pricing
      else {
        const priceStr = item.basePrice;
        if (priceStr.includes('Starting at')) {
          const match = priceStr.match(/\$(\d+)/);
          if (match) itemPrice = parseInt(match[1]);
        } else if (priceStr.includes('minimum')) {
          const match = priceStr.match(/\$(\d+)/);
          if (match) itemPrice = parseInt(match[1]);
        } else if (priceStr.match(/^\$\d+$/)) {
          const match = priceStr.match(/\$(\d+)/);
          if (match) itemPrice = parseInt(match[1]);
        } else if (priceStr.includes('-')) {
          const matches = priceStr.match(/\$(\d+)-\$(\d+)/);
          if (matches) {
            const low = parseInt(matches[1]);
            const high = parseInt(matches[2]);
            itemPrice = Math.floor((low + high) / 2);
          }
        }
      }
      
      // Add extra overgrown fee
      if (item.extraOvergrown) {
        itemPrice += 40;
        itemDescription += " + Extra overgrown";
      }
      
      // Handle recurring pricing
      if (item.recurring) {
        const totalJobs = item.recurring.count;
        let recurringTotal = itemPrice * totalJobs;
        
        if (item.recurring.paymentType === 'one-time') {
          recurringTotal = recurringTotal * 0.9;
        }
        
        itemPrice = recurringTotal;
        itemDescription += ` (Recurring ×${totalJobs})`;
      }
      
      itemizedServices.push({
        description: itemDescription,
        price: itemPrice
      });
      
      subtotal += itemPrice;
    });
    
    let total = subtotal;
    const fees = [];
    
    // Weekend markup
    if (isWeekend) {
      const fee = subtotal * 0.10;
      fees.push({ label: 'Weekend (10%)', amount: fee });
      total += fee;
    }
    
    // After 5pm markup
    if (isAfter5pm) {
      const fee = subtotal * 0.20;
      fees.push({ label: 'After 5pm (20%)', amount: fee });
      total += fee;
    }
    
    // Same-day 30% increase
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate === today) {
      const fee = subtotal * 0.30;
      fees.push({ label: 'Same-Day (30%)', amount: fee });
      total += fee;
    }
    
    // 3+ services discount
    let discount = 0;
    if (cart.length >= 3) {
      discount = subtotal * 0.10;
      total -= discount;
    }
    
    // Material procurement fee
    if (needsMaterialPurchase) {
      fees.push({ label: 'Material Procurement', amount: 15 });
      total += 15;
    }
    
    return { subtotal, fees, discount, total, itemizedServices };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const pricing = calculateTotalPrice();
    
    // Sum all fees
    const totalFees = pricing.fees.reduce((sum, fee) => sum + fee.amount, 0);
    
    // Convert service list to single comma-separated string
    const serviceList = cart.map(item => item.serviceName).join(', ');
    
    // Create structured booking data
    const bookingData = {
      customer_name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      address: formData.address,
      date_submitted: new Date().toISOString(),
      service_list: serviceList,
      service_count: cart.length,
      subtotal: pricing.subtotal,
      fees: totalFees,
      total_amount: pricing.total,
      materials_needed: needsMaterialPurchase ? (
        selectedMaterials.includes('Other (specify below)') 
          ? selectedMaterials.filter(m => m !== 'Other (specify below)').concat(otherMaterialText ? `Other: ${otherMaterialText}` : []).join(', ')
          : selectedMaterials.join(', ')
      ) : 'No',
      payment_method: paymentMethod,
      extra_notes: formData.notes || '',
      scheduled_date: `${selectedDate} ${selectedTime}`
    };
    
    try {
      const response = await fetch('/api/submit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (response.ok) {
        clearCart();
        navigate('/confirmation');
      } else {
        alert('Something went wrong. Please try again or call us directly.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Unable to submit booking. Please call us at (502) 387-5462');
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your visit is empty</h2>
          <button className="btn btn-primary" onClick={() => navigate('/categories')}>
            Browse Services
          </button>
        </div>
      </div>
    );
  }
  
  const suggestedAddOns = [];
  cart.forEach(item => {
    const service = serviceData[item.categoryKey]?.services[item.serviceIndex];
    if (service?.relatedServices) {
      service.relatedServices.forEach(relatedId => {
        Object.values(serviceData).forEach(cat => {
          const found = cat.services.find(s => s.id === relatedId);
          if (found && !cart.find(c => c.serviceName === found.name)) {
            const catKey = Object.keys(serviceData).find(k => serviceData[k].services.includes(found));
            if (!suggestedAddOns.find(s => s.name === found.name)) {
              suggestedAddOns.push({ 
                ...found, 
                categoryKey: catKey,
                serviceIndex: serviceData[catKey].services.indexOf(found)
              });
            }
          }
        });
      });
    }
  });
  
  const pricing = calculateTotalPrice();
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Your Visit</h1>
        
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.serviceName}</h3>
                <p>{item.category}</p>
                {item.materialNote && <span className="material-note-sm">Materials not included</span>}
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        
        {suggestedAddOns.length > 0 && (
          <div className="suggested-addons">
            <h3>Suggested Add-Ons</h3>
            <div className="addon-grid">
              {suggestedAddOns.slice(0, 3).map((addon, i) => (
                <div 
                  key={i} 
                  className="addon-card" 
                  onClick={() => navigate(`/add-service/${addon.categoryKey}/${addon.serviceIndex}`)}
                >
                  <h4>{addon.name}</h4>
                  <p>{addon.price}</p>
                  <button className="addon-btn">+ Add</button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {cart.length >= 3 && (
          <div className="bundle-discount">
            <span>🎉 Bundle Discount Active: 10% off!</span>
          </div>
        )}
        
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Schedule Your Visit</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select required value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                  <option value="">Select time</option>
                  <option value="08:00">8:00 AM - 10:00 AM</option>
                  <option value="10:00">10:00 AM - 12:00 PM</option>
                  <option value="12:00">12:00 PM - 2:00 PM</option>
                  <option value="14:00">2:00 PM - 4:00 PM</option>
                  <option value="16:00">4:00 PM - 6:00 PM</option>
                  <option value="18:00">6:00 PM - 8:00 PM</option>
                </select>
              </div>
            </div>
            {cart.some(item => item.materialNote) && (
              <div className="form-section">
                <h3>Do you need DoItAllBros to purchase materials?</h3>
                <p className="materials-note">You'll be charged for materials + $15 procurement fee</p>
                
                <div className="materials-radio-group">
                  <label className={`radio-option ${!needsMaterialPurchase ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="materialsPurchase"
                      value="no"
                      checked={!needsMaterialPurchase}
                      onChange={() => {
                        setNeedsMaterialPurchase(false);
                        setSelectedMaterials([]);
                        setOtherMaterialText('');
                      }}
                    />
                    <span>No</span>
                  </label>
                  
                  <label className={`radio-option ${needsMaterialPurchase ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="materialsPurchase"
                      value="yes"
                      checked={needsMaterialPurchase}
                      onChange={() => setNeedsMaterialPurchase(true)}
                    />
                    <span>Yes</span>
                  </label>
                </div>
                
                {needsMaterialPurchase && (
                  <div className="materials-dropdown">
                    <label>What materials do you need? *</label>
                    <div className="materials-checkboxes">
                      {['Paint', 'Mulch', 'Soil', 'Plants/Flowers', 'Hardware (screws, nails, etc)', 'Light Bulbs', 'Cleaning Supplies', 'De-icing Salt', 'Other (specify below)'].map(material => (
                        <label key={material} className="material-option">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMaterials([...selectedMaterials, material]);
                              } else {
                                setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                                if (material === 'Other (specify below)') {
                                  setOtherMaterialText('');
                                }
                              }
                            }}
                          />
                          <span>{material}</span>
                        </label>
                      ))}
                    </div>
                    
                    {selectedMaterials.includes('Other (specify below)') && (
                      <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label>Please specify other materials needed: *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., screws, batteries, etc."
                          value={otherMaterialText}
                          onChange={(e) => setOtherMaterialText(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-method-toggle">
              <label className={`payment-method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💳 Card</span>
              </label>
              <label className={`payment-method-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💵 Cash</span>
              </label>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Your Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Service Address (Louisville, KY)</label>
              <input 
                type="text" 
                required
                placeholder="123 Main St, Louisville, KY 40202"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Additional Notes (Optional)</label>
              <textarea 
                rows="4"
                placeholder="Any special instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          
          <div className="pricing-summary">
            <h3>Services</h3>
            {pricing.itemizedServices.map((service, i) => (
              <div key={i} className="price-row">
                <span>{service.description}</span>
                <span>${service.price.toFixed(2)}</span>
              </div>
            ))}
            
            <div className="price-row subtotal-row">
              <span>Subtotal:</span>
              <span>${pricing.subtotal.toFixed(2)}</span>
            </div>
            
            {pricing.fees.map((fee, i) => (
              <div key={i} className="price-row fee">
                <span>{fee.label}:</span>
                <span>+${fee.amount.toFixed(2)}</span>
              </div>
            ))}
            
            {pricing.discount > 0 && (
              <div className="price-row discount">
                <span>Bundle Discount (10%):</span>
                <span>-${pricing.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="price-row total">
              <span>Total:</span>
              <span>${pricing.total.toFixed(2)}</span>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            Submit Visit Request
          </button>
        </form>
      </div>
    </div>
  );
}

// Confirmation Page
function ConfirmationPage() {
  const navigate = useNavigate();
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-icon">✅</div>
        <h1>Visit Submitted!</h1>
        <p className="confirmation-message">
          We've received your visit request and will contact you within 24 hours to confirm.
        </p>
        <div className="invoice-notice">
          <strong>📧 Check your email for your invoice.</strong>
          <p>If you don't see the invoice in your email, please contact us:</p>
          <button className="btn btn-secondary" onClick={() => navigate('/contact')}>
            Contact Us
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    </div>
  );
}

// Contact Page
function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://n8n.srv1122720.hstgr.cloud/webhook/ee98ccfc-81d0-45e6-a4be-ea52d4cc46f9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'contact',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        alert('Message sent! We\'ll get back to you soon.');
        navigate('/');
      } else {
        alert('Something went wrong. Please try again or call us directly.');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Unable to send message. Please call us at (502) 387-5462');
    }
  };
  
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Get In Touch</h1>
          <p className="contact-description">
            Have a question or need a custom quote? We're here to help.
          </p>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Phone</h4>
                <p>(502) 387-5462</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Service Area</h4>
                <p>Louisville, KY & Surrounding Areas</p>
              </div>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send Us a Message</h3>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea 
              rows="6"
              required
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-large">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

// Legal Page
function LegalPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Legal Information</h1>
        <p>Content coming soon...</p>
      </div>
    </div>
  );
}

// Header
function Header() {
  const { cart } = React.useContext(CartContext);
  
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-text">DoItAllBros</span>
      </Link>
      <nav className="nav">
        <Link to="/categories" className="nav-link">Services</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/checkout" className="nav-link cart-link">
          Visit {cart.length > 0 && `(${cart.length})`}
        </Link>
        <Link to="/categories" className="nav-link nav-link-primary">Book Now</Link>
      </nav>
    </header>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>DoItAllBros</h4>
          <p>Louisville's trusted local service professionals</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/categories">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/legal">Legal</Link>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>(502) 387-5462</p>
          <p>Louisville, KY</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 DoItAllBros. All rights reserved.</p>
      </div>
    </footer>
  );
}

// Main App
function App() {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/services/:category" element={<ServicesPage />} />
              <Route path="/add-service/:category/:service" element={<AddServicePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/legal" element={<LegalPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
