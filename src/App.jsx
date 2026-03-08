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
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M24 13v11l7 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  landscaping: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 38V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 22c0-6-5-11-11-11 0 6 5 11 11 11z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M24 22c0-6 5-11 11-11 0 6-5 11-11 11z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M24 30c0-4-4-7-8-7 0 4 4 7 8 7z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M8 38h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  home: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 23L24 7l18 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 20v20h10V28h8v12h10V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  moving: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 12h20l4 8H10l4-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <rect x="10" y="20" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M18 20v6M30 20v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="18" cy="40" r="3" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="30" cy="40" r="3" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  ),
  tech: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M15 38h18M24 32v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 20l4 4-4 4M26 24h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pet: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="31" rx="9" ry="8" stroke="currentColor" strokeWidth="2.5"/>
      <ellipse cx="13" cy="21" rx="3.5" ry="4.5" stroke="currentColor" strokeWidth="2.5"/>
      <ellipse cx="20" cy="16" rx="3.5" ry="4.5" stroke="currentColor" strokeWidth="2.5"/>
      <ellipse cx="28" cy="16" rx="3.5" ry="4.5" stroke="currentColor" strokeWidth="2.5"/>
      <ellipse cx="35" cy="21" rx="3.5" ry="4.5" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  ),
  business: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="18" width="36" height="22" rx="3" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M17 18v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 28h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M21 28v4M27 28v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  emergency: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M24 13v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="24" cy="33" r="2" fill="currentColor"/>
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
        description: "Includes lawn mowing and weed eating edges. Perfect for keeping your yard neat and tidy on a regular schedule.",
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
        price: "$85-$175",
        description: "Includes lawn mowing, weed eating edges, pulling weeds, and trimming bushes. A full yard care package that keeps everything looking sharp.",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Cozy cottage lawn", price: 85 },
          medium: { label: "Medium Yard", example: "🏠 Standard suburban yard", price: 110 },
          large: { label: "Large Yard", example: "🏘️ Spacious property", price: 140 },
          xl: { label: "Extra Large Yard", example: "🏰 Estate-sized grounds", price: 175 }
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
      { name: "Mulching", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, recurring: true, materialNote: true, detailsKey: 'mulching' },
      { name: "Gutter Cleaning", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, recurring: true, detailsKey: 'gutterCleaning' },
      { name: "Power Washing", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, recurring: true, isPowerWash: true }
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
        extraOvergrown: true,
        detailsKey: 'lawnMowing'
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
        id: "hedgeTrimming",
        detailsKey: 'hedgeTrimming'
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
      { name: "Mulching (beds, trees, walkways)", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, materialNote: true, id: "mulching", relatedServices: ["gardenBed", "weedRemoval"], detailsKey: 'mulching' },
      { name: "Garden Bed Installation", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, materialNote: true, id: "gardenBed", detailsKey: 'gardenBed' },
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
      { name: "Power Washing (driveways, sidewalks, patios)", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, isPowerWash: true },
      { name: "Furniture Assembly (IKEA, Wayfair, etc.)", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, detailsKey: 'furnitureAssembly' },
      { name: "Picture Hanging & Wall Mounting", price: "$20 per", perItem: true, materialNote: true },
      { name: "Door Handle & Lock Replacement", price: "$45 per", perItem: true, materialNote: true },
      {
        name: "Light Bulb & Fixture Replacement",
        price: "$10/bulb (min $40) + $45/fixture",
        isLightBulb: true,
        materialNote: true
      },
      { name: "Smoke Detector Installation", price: "$50 per", perItem: true, materialNote: true },
      { name: "Gutter Cleaning", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, detailsKey: 'gutterCleaning' },
      { name: "Roof Cleaning", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, detailsKey: 'roofCleaning' },
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
      { name: "Window Cleaning (Exterior)", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, detailsKey: 'windowCleaning' }
    ]
  },
  movingOrganization: {
    title: "Moving, Organization & Junk Removal",
    icon: Icons.moving,
    color: "#F59E0B",
    services: [
      { name: "Junk Removal", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, detailsKey: 'junkRemoval' },
      { name: "Estate Cleanout", price: "$150/hour (3-hour minimum)", hourly: true, hourlyRate: 150, minHours: 3 },
      { name: "Moving Help", price: "$65/hour (3-hour minimum)", hourly: true, hourlyRate: 65, minHours: 3 },
      { name: "Closet & Storage Organization", price: "Dependent Pricing — Free Quote Included", dependentPricing: true, detailsKey: 'storageOrg' },
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
      { name: "Data Transfer Between Devices", price: "$40/hour (2-hour minimum)", hourly: true, hourlyRate: 40, minHours: 2 },
      { name: "General Tech Troubleshooting", price: "$55/hour (2-hour minimum)", hourly: true, hourlyRate: 55, minHours: 2 }
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
  },
  packages: {
    title: "Popular Packages",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4l5.5 11 12 1.7-8.7 8.5 2 12L24 31.5 13.2 37.2l2-12L6.5 16.7l12-1.7z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="white"/>
      </svg>
    ),
    color: "#F59E0B",
    isPackages: true,
    services: [
      {
        name: "Basic Lawn Care",
        price: "$45-$110",
        description: "Lawn mowing + weed eating edges. Keeps your yard looking neat without the hassle.",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Cozy cottage lawn", price: 45 },
          medium: { label: "Medium Yard", example: "🏠 Standard suburban yard", price: 60 },
          large: { label: "Large Yard", example: "🏘️ Spacious property", price: 80 },
          xl: { label: "Extra Large Yard", example: "🏰 Estate-sized grounds", price: 110 }
        },
        recurring: true,
        packageBadge: "Most Popular"
      },
      {
        name: "Advanced Lawn Care",
        price: "$85-$175",
        description: "Mowing, weed eating, pulling weeds, and trimming bushes — a complete yard care package.",
        sizeDependent: true,
        sizePricing: {
          small: { label: "Small Yard", example: "🏡 Cozy cottage lawn", price: 85 },
          medium: { label: "Medium Yard", example: "🏠 Standard suburban yard", price: 110 },
          large: { label: "Large Yard", example: "🏘️ Spacious property", price: 140 },
          xl: { label: "Extra Large Yard", example: "🏰 Estate-sized grounds", price: 175 }
        },
        recurring: true,
        packageBadge: "Best Value"
      },
      {
        name: "House Glowup",
        price: "Dependent Pricing — Free Quote Included",
        dependentPricing: true,
        detailsKey: 'houseGlowup',
        description: "Full exterior refresh: pressure washing (driveway, walkways, siding), exterior window cleaning, roof cleaning, and gutter cleaning. Pricing varies by home size."
      },
      {
        name: "Organize & Junk",
        price: "Dependent Pricing — Free Quote Included",
        dependentPricing: true,
        detailsKey: 'organizeJunk',
        description: "Full area cleanout: junk removal, organization, and cleaning of the space. Tell us the area (garage, basement, room, etc.) and we'll handle the rest."
      }
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
            <span className="title-main">Do It All Bros</span>
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

      {/* Popular Packages CTA */}
      <section className="home-section packages-cta-section">
        <div className="home-section-inner packages-cta-inner">
          <div className="packages-cta-text">
            <h2>Popular Packages</h2>
            <p>Our most-booked service bundles — great value for common needs. From lawn care to full exterior refreshes.</p>
          </div>
          <button className="btn btn-primary packages-cta-btn" onClick={() => navigate('/services/packages')}>
            View Popular Packages →
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="home-section about-section">
        <div className="home-section-inner">
          <h2>About Do It All Bros</h2>
          <p>
            Do It All Bros is a locally owned and operated service company based in Louisville, Kentucky. We handle a wide range of home, lawn, and business tasks so you don't have to. Whether you need your lawn mowed, junk hauled away, furniture assembled, or a TV mounted, our team shows up on time and gets the job done right. We serve homeowners, renters, and small businesses across Louisville and Jefferson County. Our pricing is transparent — you see the cost before you book.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="home-section services-overview-section">
        <div className="home-section-inner">
          <h2>Our Services in Louisville, KY</h2>
          <p className="section-intro">We offer 8 categories of services to cover everything your home or business needs.</p>
          <div className="services-overview-grid">
            <div className="service-overview-card" onClick={() => navigate('/services/recurring')}>
              <h3>Recurring Services</h3>
              <p>Scheduled lawn care, gutter cleaning, power washing, mulching, and dog walking. Starting at $25.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/landscaping')}>
              <h3>Landscaping & Lawn Care</h3>
              <p>Lawn mowing, weed removal, hedge trimming, leaf cleanup, garden beds, and snow removal in Louisville. Starting at $45.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/homeMaintenance')}>
              <h3>Home Maintenance & Handyman</h3>
              <p>Power washing, furniture assembly, picture hanging, door locks, light fixtures, smoke detectors, and more. Starting at $20.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/moving')}>
              <h3>Moving, Organization & Junk Removal</h3>
              <p>Local moving help, junk hauling, furniture rearranging, packing assistance, and donation drop-offs. Starting at $50.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/tech')}>
              <h3>Tech Help & Smart Home</h3>
              <p>TV mounting, WiFi setup, device troubleshooting, smart home installation, and printer setup. Starting at $40.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/pet')}>
              <h3>Pet & Outdoor Care</h3>
              <p>Dog walking, yard cleanup, and outdoor pet area maintenance. Dog walking from $25/30 min.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/business')}>
              <h3>Small Business Services</h3>
              <p>Office furniture assembly, tech setup, light commercial cleaning, and general business maintenance. Starting at $50.</p>
              <span className="overview-link">View Services →</span>
            </div>
            <div className="service-overview-card" onClick={() => navigate('/services/emergency')}>
              <h3>Emergency & Same-Day Help</h3>
              <p>Urgent services available same day in Louisville. Available 7 days a week with priority scheduling.</p>
              <span className="overview-link">View Services →</span>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <button className="btn btn-primary" onClick={() => navigate('/categories')}>Browse All Services</button>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="home-section area-section">
        <div className="home-section-inner">
          <h2>Service Area — Louisville, KY & Surrounding Communities</h2>
          <p>
            We provide services throughout Louisville and Jefferson County, Kentucky, including:
          </p>
          <ul className="area-list">
            <li>Louisville (all neighborhoods)</li>
            <li>Jeffersontown</li>
            <li>St. Matthews</li>
            <li>Shively</li>
            <li>Pleasure Ridge Park</li>
            <li>Valley Station</li>
            <li>Middletown</li>
            <li>Okolona</li>
            <li>Lyndon</li>
            <li>Prospect</li>
          </ul>
          <p>Not sure if we cover your area? <Link to="/contact">Contact us</Link> and we'll let you know.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-section faq-section">
        <div className="home-section-inner">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>How much does lawn mowing cost in Louisville?</h3>
              <p>Basic lawn mowing starts at $45 for small yards, $60 for medium yards, $80 for large yards, and $110 for extra-large yards. Advanced lawn care with additional services starts at $95.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer same-day or emergency services?</h3>
              <p>Yes. We offer same-day and emergency services in Louisville, KY. Same-day bookings include a 30% rush fee. Call (502) 387-5462 to check availability.</p>
            </div>
            <div className="faq-item">
              <h3>How much does junk removal cost?</h3>
              <p>Junk removal starts at $150 for small loads and goes up based on volume. A full truck load is approximately $450+. We haul away furniture, appliances, yard debris, and general clutter.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept cash, Venmo, Cash App, and Zelle. Payment is due after the service is completed.</p>
            </div>
            <div className="faq-item">
              <h3>Do you serve areas outside Louisville?</h3>
              <p>We primarily serve Louisville and Jefferson County, KY. Contact us to check if we cover your specific location.</p>
            </div>
            <div className="faq-item">
              <h3>How do I book a service?</h3>
              <p>Click "Book Now" on our website to select your services, preferred date, and time. You can also call us at (502) 387-5462 or use our contact form.</p>
            </div>
          </div>
        </div>
      </section>
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

      {/* Featured: Popular Packages */}
      <div className="packages-featured-wrap">
        <div className="packages-featured-card" onClick={() => navigate('/services/packages')}>
          <div className="packages-featured-left">
            <span className="packages-featured-badge">⭐ Featured</span>
            <h2>Popular Packages</h2>
            <p>Our most-booked service bundles — great value, curated for common needs.</p>
            <span className="packages-featured-link">View All Packages →</span>
          </div>
          <div className="packages-featured-right">
            <div className="packages-featured-pills">
              <span className="pkg-pill">Basic Lawn Care</span>
              <span className="pkg-pill">Advanced Lawn Care</span>
              <span className="pkg-pill">House Glowup</span>
              <span className="pkg-pill">Organize &amp; Junk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {Object.entries(serviceData)
          .filter(([, cat]) => !cat.isPackages)
          .map(([key, category]) => (
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
            <div className="service-badges">
              {service.packageBadge && <span className="package-badge-sm">{service.packageBadge}</span>}
              {service.materialNote && <span className="material-note">Materials not included</span>}
              {service.recurring && <span className="recurring-badge">Recurring Available</span>}
              {service.perItem && <span className="per-item-badge">Per Item</span>}
              {service.isDogWalking && <span className="dog-walking-badge">Custom Duration</span>}
              {service.extraOvergrown && <span className="extra-badge">+$40 if overgrown</span>}
              {service.hourly && <span className="hourly-badge">Hourly Rate</span>}
              {service.isEmergency && <span className="emergency-badge">1.5× Rate</span>}
            </div>
            <div className={`service-price${service.dependentPricing ? ' service-price-quote' : ''}`}>
              {service.dependentPricing ? 'Free Quote' : service.price}
            </div>
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
  const [recurringCount, setRecurringCount] = useState(2);
  const [paymentType, setPaymentType] = useState('per-job');
  const [extraOvergrown, setExtraOvergrown] = useState(false);
  const [bulbCount, setBulbCount] = useState(0);
  const [fixtureCount, setFixtureCount] = useState(0);
  const [hours, setHours] = useState(0);
  const [urgencyDescription, setUrgencyDescription] = useState('');
  const [powerWashAreas, setPowerWashAreas] = useState([]);
  const [powerWashOther, setPowerWashOther] = useState('');
  const [serviceDetails, setServiceDetails] = useState({});
  const setDetail = (key, val) => setServiceDetails(prev => ({ ...prev, [key]: val }));
  
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
      total = total * 0.9;
    }

    const freqLengthMap = {
      'twice-weekly': { unit: 'weeks', divisor: 2 },
      'weekly': { unit: 'weeks', divisor: 1 },
      'biweekly': { unit: 'weeks', divisor: 0.5 },
      'monthly': { unit: 'months', divisor: 1 },
      'quarterly': { unit: 'months', divisor: 3 },
      'every-6-months': { unit: 'months', divisor: 6 },
      'yearly': { unit: 'years', divisor: 1 }
    };
    let timeSummary = '';
    if (recurringFrequency && freqLengthMap[recurringFrequency]) {
      const { unit, divisor } = freqLengthMap[recurringFrequency];
      const length = unit === 'weeks' ? (recurringCount / (divisor === 2 ? 2 : divisor === 0.5 ? 0.5 : 1))
        : unit === 'years' ? recurringCount : recurringCount * divisor;
      const rounded = Math.round(length * 10) / 10;
      timeSummary = `${rounded} ${unit}`;
    }

    return {
      basePrice,
      count: recurringCount,
      subtotal: basePrice * recurringCount,
      discount: paymentType === 'one-time' ? (basePrice * recurringCount * 0.1) : 0,
      total,
      timeSummary
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
      materialNote: service.materialNote,
      powerWashAreas: service.isPowerWash ? [
        ...powerWashAreas,
        ...(powerWashAreas.includes('Other') && powerWashOther ? [`Other: ${powerWashOther}`] : [])
      ].filter(a => a !== 'Other' || !powerWashOther) : null,
      serviceDetails: service.detailsKey ? serviceDetails : null,
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
          <div className="booking-header-top">
            <span className="category-icon-large" style={{color: category.color}}>
              {category.icon}
            </span>
            <h1>{service.name}</h1>
          </div>
          <div className="service-price-large">{service.price}</div>
          {service.packageBadge && (
            <span className="pkg-badge-inline">{service.packageBadge}</span>
          )}
        </div>

        <div className="service-config">
          {service.dependentPricing && (
            <div className="dependent-pricing-notice">
              <strong>🔖 Dependent Pricing — Free Quote Included</strong>
              <p>This service requires an on-site or photo assessment to provide an accurate quote. Add it to your visit and we'll send you a confirmed price before scheduling.</p>
            </div>
          )}
          {service.isPowerWash && (
            <div className="form-section">
              <h3>What needs power washed?</h3>
                            <div className="powerwash-grid">
                {['Driveway','Walkway','Patio','Porch','Siding','Brick','Sidewalk','Other'].map(area => (
                  <label key={area} className={`powerwash-option ${powerWashAreas.includes(area) ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={powerWashAreas.includes(area)}
                      onChange={e => {
                        if (e.target.checked) setPowerWashAreas([...powerWashAreas, area]);
                        else { setPowerWashAreas(powerWashAreas.filter(a => a !== area)); if (area === 'Other') setPowerWashOther(''); }
                      }}
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
              {powerWashAreas.includes('Other') && (
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label>Describe what needs power washed:</label>
                  <input
                    type="text"
                    placeholder="e.g., pool deck, retaining wall..."
                    value={powerWashOther}
                    onChange={e => setPowerWashOther(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          {/* ── Lawn Mowing: front/back selection ── */}
          {service.detailsKey === 'lawnMowing' && (
            <div className="form-section">
              <h3>Which area?</h3>
              <div className="size-grid">
                {['Front Only', 'Back Only', 'Front & Back'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.area === opt ? 'active' : ''}`}>
                    <input type="radio" name="lawnArea" value={opt} checked={serviceDetails.area === opt} onChange={() => setDetail('area', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Hedge, Bush & Tree Trimming ── */}
          {service.detailsKey === 'hedgeTrimming' && (
            <div className="form-section">
              <h3>What needs trimming?</h3>
              <label style={{display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background: (serviceDetails.trimItems||[]).includes('Everything') ? 'rgba(245,158,11,.15)' : 'rgba(245,158,11,.06)', border:`2px solid ${(serviceDetails.trimItems||[]).includes('Everything') ? '#F59E0B' : 'rgba(245,158,11,.4)'}`, borderRadius:'10px', cursor:'pointer', marginBottom:'10px', fontWeight:700, fontSize:'14px', color:'#D97706'}}>
                <input type="checkbox" checked={(serviceDetails.trimItems||[]).includes('Everything')} onChange={e => { const cur = serviceDetails.trimItems||[]; setDetail('trimItems', e.target.checked ? [...cur, 'Everything'] : cur.filter(a => a !== 'Everything')); }} />
                <span>⭐ Everything</span>
              </label>
              <div className="powerwash-grid">
                {['Hedges', 'Bushes', 'Tree Trimming', 'Stump Removal', 'Haul Away Debris', 'Other'].map(opt => (
                  <label key={opt} className={`powerwash-option ${(serviceDetails.trimItems||[]).includes(opt) ? 'active' : ''}`}>
                    <input type="checkbox" checked={(serviceDetails.trimItems||[]).includes(opt)} onChange={e => { const cur = serviceDetails.trimItems||[]; setDetail('trimItems', e.target.checked ? [...cur, opt] : cur.filter(a => a !== opt)); }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {((serviceDetails.trimItems||[]).includes('Other') || (serviceDetails.trimItems||[]).includes('Everything')) && (
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label>Describe what needs trimming:</label>
                  <input type="text" placeholder="e.g., ornamental grasses, vines..." value={serviceDetails.trimOther||''} onChange={e => setDetail('trimOther', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* ── Mulching ── */}
          {service.detailsKey === 'mulching' && (
            <div className="form-section">
              <h3>Where needs mulching?</h3>
                            <div className="powerwash-grid">
                {['Flower Beds', 'Around Trees', 'Walkways', 'All of the Above'].map(opt => (
                  <label key={opt} className={`powerwash-option ${(serviceDetails.areas||[]).includes(opt) ? 'active' : ''}`}>
                    <input type="checkbox" checked={(serviceDetails.areas||[]).includes(opt)} onChange={e => { const cur = serviceDetails.areas||[]; setDetail('areas', e.target.checked ? [...cur, opt] : cur.filter(a => a !== opt)); }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Approximate area</h3>
              <div className="size-grid">
                {['Small', 'Medium', 'Large'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.size === opt ? 'active' : ''}`}>
                    <input type="radio" name="mulchSize" value={opt} checked={serviceDetails.size === opt} onChange={() => setDetail('size', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Type of mulch</h3>
              <div className="powerwash-grid">
                {['Brown', 'Black', 'Red', 'Natural'].map(opt => (
                  <label key={opt} className={`powerwash-option ${serviceDetails.mulchType === opt ? 'active' : ''}`}>
                    <input type="radio" name="mulchType" checked={serviceDetails.mulchType === opt} onChange={() => setDetail('mulchType', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label>Other details (optional)</label>
                <input type="text" placeholder="Any additional info..." value={serviceDetails.other||''} onChange={e => setDetail('other', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Gutter Cleaning ── */}
          {service.detailsKey === 'gutterCleaning' && (
            <div className="form-section">
              <h3>Number of stories</h3>
              <div className="size-grid">
                {['Single Story', 'Two Story', 'Three Story+'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.stories === opt ? 'active' : ''}`}>
                    <input type="radio" name="gutterStories" checked={serviceDetails.stories === opt} onChange={() => setDetail('stories', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <div style={{marginTop:'1rem'}}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={serviceDetails.downspout||false} onChange={e => setDetail('downspout', e.target.checked)} />
                  <span>Include downspout clearing</span>
                </label>
              </div>
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label>Other details (optional)</label>
                <input type="text" placeholder="Any additional info..." value={serviceDetails.other||''} onChange={e => setDetail('other', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Furniture Assembly ── */}
          {service.detailsKey === 'furnitureAssembly' && (
            <div className="form-section">
              <h3>What needs assembling?</h3>
              {['Desk', 'Table', 'Couch', 'Chair', 'Bed Frame', 'Dresser', 'Bookshelf', 'Other'].map(type => {
                const items = serviceDetails.furnitureItems || [];
                const found = items.find(i => i.type === type);
                return (
                  <div key={type} style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.75rem'}}>
                    <label className="checkbox-label" style={{flex:1}}>
                      <input type="checkbox" checked={!!found} onChange={e => { if (e.target.checked) setDetail('furnitureItems', [...items, {type, qty:1}]); else setDetail('furnitureItems', items.filter(i => i.type !== type)); }} />
                      <span>{type}</span>
                    </label>
                    {found && (
                      <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                        <label style={{fontSize:'0.85rem', color:'#64748B'}}>Qty:</label>
                        <input type="number" min="1" value={found.qty} style={{width:'60px'}} onChange={e => setDetail('furnitureItems', items.map(i => i.type === type ? {...i, qty: parseInt(e.target.value)||1} : i))} />
                      </div>
                    )}
                  </div>
                );
              })}
              {(serviceDetails.furnitureItems||[]).some(i => i.type === 'Other') && (
                <div className="form-group" style={{marginTop:'0.5rem'}}>
                  <label>Describe the other item(s):</label>
                  <input type="text" placeholder="e.g., shelving unit, entertainment center..." value={serviceDetails.otherDesc||''} onChange={e => setDetail('otherDesc', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* ── Garden Bed Installation ── */}
          {service.detailsKey === 'gardenBed' && (
            <div className="form-section">
              <h3>Installation type</h3>
              <div className="size-grid">
                {['New Installation', 'Existing Bed Refresh'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.installType === opt ? 'active' : ''}`}>
                    <input type="radio" name="installType" checked={serviceDetails.installType === opt} onChange={() => setDetail('installType', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Number of beds</h3>
              <div className="size-grid">
                {['Small (1-2 beds)', 'Medium (3-5 beds)', 'Large (6+ beds)'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.bedCount === opt ? 'active' : ''}`}>
                    <input type="radio" name="bedCount" checked={serviceDetails.bedCount === opt} onChange={() => setDetail('bedCount', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Add-ons (optional)</h3>
              <div className="powerwash-grid">
                {['Add Plants/Flowers', 'Add Mulch', 'Add Edging'].map(opt => (
                  <label key={opt} className={`powerwash-option ${(serviceDetails.addons||[]).includes(opt) ? 'active' : ''}`}>
                    <input type="checkbox" checked={(serviceDetails.addons||[]).includes(opt)} onChange={e => { const cur = serviceDetails.addons||[]; setDetail('addons', e.target.checked ? [...cur, opt] : cur.filter(a => a !== opt)); }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label>Other details (optional)</label>
                <input type="text" placeholder="Any additional info..." value={serviceDetails.other||''} onChange={e => setDetail('other', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Roof Cleaning ── */}
          {service.detailsKey === 'roofCleaning' && (
            <div className="form-section">
              <h3>Number of stories</h3>
              <div className="size-grid">
                {['Single Story', 'Two Story', 'Three Story+'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.stories === opt ? 'active' : ''}`}>
                    <input type="radio" name="roofStories" checked={serviceDetails.stories === opt} onChange={() => setDetail('stories', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Roof condition</h3>
              <div className="size-grid">
                {['Light Buildup (minor staining)', 'Moderate Buildup (visible moss/algae)', 'Heavy Buildup (thick moss/algae coverage)'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.condition === opt ? 'active' : ''}`}>
                    <input type="radio" name="roofCondition" checked={serviceDetails.condition === opt} onChange={() => setDetail('condition', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Window Cleaning ── */}
          {service.detailsKey === 'windowCleaning' && (
            <div className="form-section">
              <h3>Number of stories</h3>
              <div className="size-grid">
                {['Single Story', 'Two Story', 'Three Story+'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.stories === opt ? 'active' : ''}`}>
                    <input type="radio" name="winStories" checked={serviceDetails.stories === opt} onChange={() => setDetail('stories', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Number of windows</h3>
              <div className="size-grid">
                {['1-5 windows', '6-10 windows', '11-20 windows', '20+ windows'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.windowCount === opt ? 'active' : ''}`}>
                    <input type="radio" name="windowCount" checked={serviceDetails.windowCount === opt} onChange={() => setDetail('windowCount', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Junk Removal ── */}
          {service.detailsKey === 'junkRemoval' && (
            <div className="form-section">
              <h3>How much junk?</h3>
              <div className="size-grid">
                {['Single Item', 'Small Load (few items)', 'Medium Load (partial truck)', 'Large Load (full truck)'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.loadSize === opt ? 'active' : ''}`}>
                    <input type="radio" name="loadSize" checked={serviceDetails.loadSize === opt} onChange={() => setDetail('loadSize', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <div className="form-group" style={{marginTop:'1.5rem'}}>
                <label>What are we removing? (optional)</label>
                <textarea rows="3" placeholder="e.g., old couch, appliances, boxes..." value={serviceDetails.description||''} onChange={e => setDetail('description', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Closet & Storage Organization ── */}
          {service.detailsKey === 'storageOrg' && (
            <div className="form-section">
              <h3>What area(s) need organizing?</h3>
              {[{type:'Closet',hasQty:true},{type:'Garage',hasQty:false},{type:'Basement',hasQty:false},{type:'Storage Unit',hasQty:true},{type:'Room',hasQty:true},{type:'Other',hasQty:false}].map(({type, hasQty}) => {
                const items = serviceDetails.orgAreas || [];
                const found = items.find(i => i.type === type);
                return (
                  <div key={type} style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.75rem'}}>
                    <label className="checkbox-label" style={{flex:1}}>
                      <input type="checkbox" checked={!!found} onChange={e => { if (e.target.checked) setDetail('orgAreas', [...items, {type, qty: hasQty ? 1 : null}]); else setDetail('orgAreas', items.filter(i => i.type !== type)); }} />
                      <span>{type}</span>
                    </label>
                    {found && hasQty && (
                      <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                        <label style={{fontSize:'0.85rem', color:'#64748B'}}>Qty:</label>
                        <input type="number" min="1" value={found.qty||1} style={{width:'60px'}} onChange={e => setDetail('orgAreas', items.map(i => i.type === type ? {...i, qty: parseInt(e.target.value)||1} : i))} />
                      </div>
                    )}
                  </div>
                );
              })}
              <h3 style={{marginTop:'1.5rem'}}>Size</h3>
              <div className="size-grid">
                {['Small', 'Medium', 'Large', 'Extra Large'].map(opt => (
                  <label key={opt} className={`size-option ${serviceDetails.size === opt ? 'active' : ''}`}>
                    <input type="radio" name="orgSize" checked={serviceDetails.size === opt} onChange={() => setDetail('size', opt)} />
                    <div className="size-content"><span className="size-label">{opt}</span></div>
                  </label>
                ))}
              </div>
              <h3 style={{marginTop:'1.5rem'}}>Type of organization</h3>
              <div className="powerwash-grid">
                {['Basic Cleanup', 'Full Organization', 'Labeling', 'Other'].map(opt => (
                  <label key={opt} className={`powerwash-option ${(serviceDetails.orgType||[]).includes(opt) ? 'active' : ''}`}>
                    <input type="checkbox" checked={(serviceDetails.orgType||[]).includes(opt)} onChange={e => { const cur = serviceDetails.orgType||[]; setDetail('orgType', e.target.checked ? [...cur, opt] : cur.filter(a => a !== opt)); }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {(serviceDetails.orgType||[]).includes('Other') && (
                <div className="form-group" style={{marginTop:'0.5rem'}}>
                  <input type="text" placeholder="Describe..." value={serviceDetails.orgTypeOther||''} onChange={e => setDetail('orgTypeOther', e.target.value)} />
                </div>
              )}
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label>Additional details (optional)</label>
                <input type="text" placeholder="Any other info..." value={serviceDetails.other||''} onChange={e => setDetail('other', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── House Glowup ── */}
          {service.detailsKey === 'houseGlowup' && (
            <div className="form-section">
              <h3>What services do you need?</h3>
                            <label style={{display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background: (serviceDetails.glowupServices||[]).includes('Everything') ? 'rgba(245,158,11,.15)' : 'rgba(245,158,11,.06)', border:`2px solid ${(serviceDetails.glowupServices||[]).includes('Everything') ? '#F59E0B' : 'rgba(245,158,11,.4)'}`, borderRadius:'10px', cursor:'pointer', marginBottom:'10px', fontWeight:700, fontSize:'14px', color:'#D97706'}}>
                <input type="checkbox" checked={(serviceDetails.glowupServices||[]).includes('Everything')} onChange={e => { const cur = serviceDetails.glowupServices||[]; setDetail('glowupServices', e.target.checked ? [...cur, 'Everything'] : cur.filter(a => a !== 'Everything')); }} />
                <span>⭐ Everything (Full Package)</span>
              </label>
              <div className="powerwash-grid">
                {['Power Washing', 'Window Washing', 'Gutter Cleaning', 'Roof Cleaning', 'Other'].map(opt => (
                  <label key={opt} className={`powerwash-option ${(serviceDetails.glowupServices||[]).includes(opt) ? 'active' : ''}`}>
                    <input type="checkbox" checked={(serviceDetails.glowupServices||[]).includes(opt)} onChange={e => { const cur = serviceDetails.glowupServices||[]; setDetail('glowupServices', e.target.checked ? [...cur, opt] : cur.filter(a => a !== opt)); }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {((serviceDetails.glowupServices||[]).includes('Power Washing') || (serviceDetails.glowupServices||[]).includes('Everything')) && (
                <div style={{marginTop:'1.5rem'}}>
                  <h3>Power washing — what areas?</h3>
                  <div className="powerwash-grid">
                    {['Driveway', 'Walkway', 'Patio', 'Porch', 'Siding', 'Brick', 'Sidewalk', 'Other'].map(area => (
                      <label key={area} className={`powerwash-option ${(serviceDetails.glowupPWAreas||[]).includes(area) ? 'active' : ''}`}>
                        <input type="checkbox" checked={(serviceDetails.glowupPWAreas||[]).includes(area)} onChange={e => { const cur = serviceDetails.glowupPWAreas||[]; setDetail('glowupPWAreas', e.target.checked ? [...cur, area] : cur.filter(a => a !== area)); }} />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {(serviceDetails.glowupServices||[]).includes('Other') && (
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label>Describe the other service(s):</label>
                  <input type="text" placeholder="e.g., deck staining..." value={serviceDetails.glowupOther||''} onChange={e => setDetail('glowupOther', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* ── Organize & Junk ── */}
          {service.detailsKey === 'organizeJunk' && (
            <div className="form-section">
              <h3>What do you need done?</h3>
              <label style={{display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background: (serviceDetails.ojServices||[]).includes('Everything') ? 'rgba(245,158,11,.15)' : 'rgba(245,158,11,.06)', border:`2px solid ${(serviceDetails.ojServices||[]).includes('Everything') ? '#F59E0B' : 'rgba(245,158,11,.4)'}`, borderRadius:'10px', cursor:'pointer', marginBottom:'10px', fontWeight:700, fontSize:'14px', color:'#D97706'}}>
                <input type="checkbox" checked={(serviceDetails.ojServices||[]).includes('Everything')} onChange={e => { const cur = serviceDetails.ojServices||[]; setDetail('ojServices', e.target.checked ? [...cur, 'Everything'] : cur.filter(a => a !== 'Everything')); }} />
                <span>⭐ Everything</span>
              </label>
              <div className="powerwash-grid">
                {['Moving', 'Junk Removal', 'Organization'].map(opt => (
                  <label key={opt} className={`powerwash-option ${(serviceDetails.ojServices||[]).includes(opt) ? 'active' : ''}`}>
                    <input type="checkbox" checked={(serviceDetails.ojServices||[]).includes(opt)} onChange={e => { const cur = serviceDetails.ojServices||[]; setDetail('ojServices', e.target.checked ? [...cur, opt] : cur.filter(a => a !== opt)); }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {((serviceDetails.ojServices||[]).includes('Moving') || (serviceDetails.ojServices||[]).includes('Everything')) && (
                <div style={{marginTop:'1.5rem'}}>
                  <h3>Moving — how much?</h3>
                  <div className="size-grid">
                    {['Small Load', 'Medium Load', 'Large Load', 'Full Home'].map(opt => (
                      <label key={opt} className={`size-option ${serviceDetails.movingSize === opt ? 'active' : ''}`}>
                        <input type="radio" name="movingSize" checked={serviceDetails.movingSize === opt} onChange={() => setDetail('movingSize', opt)} />
                        <div className="size-content"><span className="size-label">{opt}</span></div>
                      </label>
                    ))}
                  </div>
                  <div className="form-group" style={{marginTop:'1rem'}}>
                    <label>Additional details (optional)</label>
                    <textarea rows="2" placeholder="Describe what we're moving..." value={serviceDetails.movingDesc||''} onChange={e => setDetail('movingDesc', e.target.value)} />
                  </div>
                </div>
              )}
              {((serviceDetails.ojServices||[]).includes('Junk Removal') || (serviceDetails.ojServices||[]).includes('Everything')) && (
                <div style={{marginTop:'1.5rem'}}>
                  <h3>Junk Removal — how much?</h3>
                  <div className="size-grid">
                    {['Single Item', 'Small Load', 'Medium Load', 'Large Load'].map(opt => (
                      <label key={opt} className={`size-option ${serviceDetails.junkSize === opt ? 'active' : ''}`}>
                        <input type="radio" name="junkSize" checked={serviceDetails.junkSize === opt} onChange={() => setDetail('junkSize', opt)} />
                        <div className="size-content"><span className="size-label">{opt}</span></div>
                      </label>
                    ))}
                  </div>
                  <div className="form-group" style={{marginTop:'1rem'}}>
                    <label>What are we removing? (optional)</label>
                    <textarea rows="2" placeholder="e.g., old furniture, appliances..." value={serviceDetails.junkDesc||''} onChange={e => setDetail('junkDesc', e.target.value)} />
                  </div>
                </div>
              )}
              {((serviceDetails.ojServices||[]).includes('Organization') || (serviceDetails.ojServices||[]).includes('Everything')) && (
                <div style={{marginTop:'1.5rem'}}>
                  <h3>Organization — what type?</h3>
                  <div className="size-grid">
                    {['Basic Cleanup', 'Full Organization', 'Labeling', 'Other'].map(opt => (
                      <label key={opt} className={`size-option ${serviceDetails.orgType === opt ? 'active' : ''}`}>
                        <input type="radio" name="orgType" checked={serviceDetails.orgType === opt} onChange={() => setDetail('orgType', opt)} />
                        <div className="size-content"><span className="size-label">{opt}</span></div>
                      </label>
                    ))}
                  </div>
                  {serviceDetails.orgType === 'Other' && (
                    <div className="form-group" style={{marginTop:'0.5rem'}}>
                      <input type="text" placeholder="Describe the type of organization..." value={serviceDetails.orgDesc||''} onChange={e => setDetail('orgDesc', e.target.value)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {service.description && (
            <div className="service-description-box">
              <p>{service.description}</p>
            </div>
          )}
          {service.materialNote && !service.dependentPricing && (
            <div className="material-warning">
              <strong>Note:</strong> Customer is responsible for all materials. If we need to purchase materials, there's a +$45 procurement fee.
            </div>
          )}
          
          {service.sizeDependent && !service.dependentPricing && (
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
          
          {service.hourly && !service.dependentPricing && (
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
          
          {service.perItem && !service.isLightBulb && !service.dependentPricing && (
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
                        <option value="biweekly">Bi-Weekly (Every 2 Weeks)</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly (Every 3 Months)</option>
                        <option value="every-6-months">Every 6 Months</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Terms (min. 2)</label>
                      <input
                        type="number"
                        min="2"
                        value={recurringCount}
                        onChange={(e) => setRecurringCount(Math.max(2, parseInt(e.target.value) || 2))}
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
                            <span>Base Price per Term:</span>
                            <span>${recurringPreview.basePrice}</span>
                          </div>
                          <div className="price-row">
                            <span>Number of Terms:</span>
                            <span>×{recurringPreview.count}</span>
                          </div>
                          {recurringPreview.timeSummary && (
                            <div className="price-row">
                              <span>Total Duration:</span>
                              <span>~{recurringPreview.timeSummary}</span>
                            </div>
                          )}
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
  const [backupDate, setBackupDate] = useState('');
  const [backupTime, setBackupTime] = useState('');
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
  const [referralCode, setReferralCode] = useState('');
  const [referralStatus, setReferralStatus] = useState(null); // null | 'valid' | 'invalid'
  const [referralMessage, setReferralMessage] = useState('');
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [existingCode, setExistingCode] = useState(null); // their own code from KV
  const [previewCode, setPreviewCode] = useState(null); // generated preview for new customers
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const day = date.getDay();
      setIsWeekend(day === 0 || day === 6);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (existingCode) { setPreviewCode(null); return; }
    const base = (formData.name || '').trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
    if (!base) { setPreviewCode(null); return; }
    setPreviewCode(prev => {
      const prevBase = prev ? prev.replace(/\d+$/, '') : '';
      if (prevBase === base) return prev; // keep same code if name base unchanged
      return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    });
  }, [formData.name, existingCode]);

  useEffect(() => {
    const email = formData.email.trim();
    if (!email || !email.includes('@')) { setExistingCode(null); return; }
    const timer = setTimeout(async () => {
      try {
        const r = await fetch('/api/referral-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await r.json();
        setExistingCode(data.found ? data : null);
      } catch { setExistingCode(null); }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.email]);
  
  useEffect(() => {
    if (selectedTime) {
      const hour = parseInt(selectedTime.split(':')[0]);
      setIsAfter5pm(hour >= 17);
    }
  }, [selectedTime]);
  
  const hasDependentItems = cart.some(item => {
    const svc = serviceData[item.categoryKey]?.services[item.serviceIndex];
    return svc?.dependentPricing;
  });
  const allDependent = cart.every(item => {
    const svc = serviceData[item.categoryKey]?.services[item.serviceIndex];
    return svc?.dependentPricing;
  });

  const calculateTotalPrice = () => {
    let subtotal = 0;
    const itemizedServices = [];
    
    cart.forEach(item => {
      let itemPrice = 0;
      let itemDescription = item.serviceName;
      const svc = serviceData[item.categoryKey]?.services[item.serviceIndex];

      // Dependent pricing — skip price calculation
      if (svc?.dependentPricing) {
        itemizedServices.push({ description: itemDescription + ' (Free Quote — Price TBD)', price: 0, isDependent: true });
        return;
      }

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
      fees.push({ label: 'Material Procurement', amount: 45 });
      total += 45;
    }
    
    return { subtotal, fees, discount, total, itemizedServices };
  };
  
  const emailMyCode = async () => {
    const code = existingCode?.code || previewCode;
    if (!code || !formData.email || emailCodeSending || emailCodeSent) return;
    setEmailCodeSending(true);
    try {
      await fetch('https://n8n.srv1122720.hstgr.cloud/webhook/4f5f6fa4-0661-4006-8685-357e43bc3501', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isExisting: !!existingCode,
          creditsEarned: existingCode?.creditsEarned || 0,
          totalCompleted: existingCode?.totalCompleted || 0,
        }),
      });
      setEmailCodeSent(true);
    } catch (e) {
      console.error('Email code error:', e);
    }
    setEmailCodeSending(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pricing = calculateTotalPrice();
    
    // Sum all fees
    const totalFees = pricing.fees.reduce((sum, fee) => sum + fee.amount, 0);
    
    // Convert service list to single comma-separated string
    const serviceList = cart.map(item => item.serviceName).join(', ');
    const dependentServices = cart
      .filter(item => serviceData[item.categoryKey]?.services[item.serviceIndex]?.dependentPricing)
      .map(item => item.serviceName);
    
    // Build structured cart items for the tracker
    const cartItemsStructured = cart.map(item => {
      const svc = serviceData[item.categoryKey]?.services[item.serviceIndex];
      const isQuote = svc?.dependentPricing || false;
      let sizeLabel = null;
      if (item.selectedSize && svc?.sizePricing) {
        sizeLabel = svc.sizePricing[item.selectedSize]?.label || item.selectedSize;
      }
      return {
        serviceName: item.serviceName,
        category: item.category,
        isQuote,
        fixedPrice: isQuote ? null : (item.calculatedPrice || 0),
        sizeLabel,
        powerWashAreas: item.powerWashAreas || null,
        serviceDetails: item.serviceDetails || null,
        isRecurring: !!item.recurring,
        recurringLabel: item.recurring?.frequency || null,
      };
    });

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
      has_quoted_services: dependentServices.length > 0,
      quoted_service_names: dependentServices,
      cart_items: cartItemsStructured,
      materials_needed: needsMaterialPurchase ? (
        selectedMaterials.includes('Other (specify below)')
          ? selectedMaterials.filter(m => m !== 'Other (specify below)').concat(otherMaterialText ? `Other: ${otherMaterialText}` : []).join(', ')
          : selectedMaterials.join(', ')
      ) : 'No',
      payment_method: paymentMethod,
      extra_notes: formData.notes || '',
      referralCode: referralStatus === 'valid' ? referralCode.trim().toUpperCase() : null,
      suggestedCode: !existingCode ? previewCode : null,
      preferred_date: selectedDate,
      preferred_time: selectedTime,
      backup_date: backupDate || null,
      backup_time: backupTime || null,
      scheduled_date: `${selectedDate} ${selectedTime}`,
    };
    
    try {
      const response = await fetch('/api/submit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (response.ok) {
        if (dependentServices.length > 0) {
          sessionStorage.setItem('pendingQuoteServices', dependentServices.join(', '));
        } else {
          sessionStorage.removeItem('pendingQuoteServices');
        }
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
                <label>Preferred Date</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <select required value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                  <option value="">Select time</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="07:30">7:30 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="08:30">8:30 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="09:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="14:30">2:30 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="15:30">3:30 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="16:30">4:30 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="17:30">5:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                </select>
              </div>
            </div>
            {selectedDate === new Date().toISOString().split('T')[0] && (
              <div className="same-day-note">
                <strong>📞 Same-Day Request:</strong> For the best chance of getting seen today, we recommend calling us directly at <a href="tel:+15023875462">(502) 387-5462</a>. Same-day bookings include a 30% rush fee.
              </div>
            )}
            <div className="form-row" style={{marginTop:'1rem'}}>
              <div className="form-group">
                <label>Backup Date <span style={{fontWeight:400, fontSize:'0.85rem', color:'#64748B'}}>(in case first isn't available)</span></label>
                <input
                  type="date"
                  value={backupDate}
                  onChange={(e) => setBackupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Backup Time</label>
                <select value={backupTime} onChange={(e) => setBackupTime(e.target.value)}>
                  <option value="">Select time</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="07:30">7:30 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="08:30">8:30 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="09:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="14:30">2:30 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="15:30">3:30 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="16:30">4:30 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="17:30">5:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                </select>
              </div>
            </div>
            {cart.some(item => item.materialNote) && (
              <div className="form-section">
                <h3>Do you need DoItAllBros to purchase materials?</h3>
                <p className="materials-note">You'll be charged for materials + $45 procurement fee</p>
                
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
                {existingCode && (
                  <div style={{marginTop:'8px', padding:'10px 14px', background:'rgba(99,102,241,.08)', border:'1.5px solid rgba(99,102,241,.3)', borderRadius:'8px', fontSize:'13px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'2px', flexWrap:'wrap'}}>
                      <div style={{fontWeight:700, color:'#6366F1'}}>🎟 Your Referral Code: <span style={{letterSpacing:'.1em'}}>{existingCode.code}</span></div>
                      <button type="button" onClick={emailMyCode} disabled={emailCodeSending || emailCodeSent} style={{fontSize:'11px', padding:'3px 10px', borderRadius:'6px', border:'1.5px solid #6366F1', background: emailCodeSent ? '#6366F1' : 'transparent', color: emailCodeSent ? '#fff' : '#6366F1', cursor: emailCodeSent ? 'default' : 'pointer', fontWeight:600, whiteSpace:'nowrap'}}>
                        {emailCodeSent ? '✓ Sent!' : emailCodeSending ? 'Sending…' : '📧 Email Me My Code'}
                      </button>
                    </div>
                    <div style={{color:'#64748B', fontSize:'12px'}}>Share this code with friends — they get 10% off, you get 20% off your next visit.</div>
                    <div style={{color:'#94A3B8', fontSize:'11px', marginTop:'3px', fontStyle:'italic'}}>Code becomes active once your visit is confirmed and completed.</div>
                    {existingCode.totalCompleted > 0 && <div style={{color:'#10B981', fontSize:'12px', marginTop:'4px', fontWeight:600}}>✓ {existingCode.totalCompleted} successful referral{existingCode.totalCompleted !== 1 ? 's' : ''} · {existingCode.creditsEarned} credit{existingCode.creditsEarned !== 1 ? 's' : ''} earned</div>}
                  </div>
                )}
                {formData.email.includes('@') && !existingCode && (
                  <div style={{marginTop:'8px', padding:'10px 14px', background:'rgba(16,185,129,.06)', border:'1.5px solid rgba(16,185,129,.25)', borderRadius:'8px', fontSize:'13px'}}>
                    {previewCode ? (
                      <>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'2px', flexWrap:'wrap'}}>
                          <div style={{fontWeight:700, color:'#10B981'}}>🎟 Your Referral Code: <span style={{letterSpacing:'.1em'}}>{previewCode}</span></div>
                          <button type="button" onClick={emailMyCode} disabled={emailCodeSending || emailCodeSent || !formData.email} style={{fontSize:'11px', padding:'3px 10px', borderRadius:'6px', border:'1.5px solid #10B981', background: emailCodeSent ? '#10B981' : 'transparent', color: emailCodeSent ? '#fff' : '#10B981', cursor: emailCodeSent ? 'default' : 'pointer', fontWeight:600, whiteSpace:'nowrap'}}>
                            {emailCodeSent ? '✓ Sent!' : emailCodeSending ? 'Sending…' : '📧 Email Me My Code'}
                          </button>
                        </div>
                        <div style={{color:'#64748B', fontSize:'12px'}}>Share this code with friends — they get 10% off, you get 20% off your next visit.</div>
                        <div style={{color:'#F59E0B', fontSize:'11px', marginTop:'3px', fontWeight:600}}>⚠ Not active until your first visit is confirmed and completed.</div>
                      </>
                    ) : (
                      <div style={{color:'#64748B'}}>🎟 Enter your name above to preview your referral code. It becomes active after your first completed visit.</div>
                    )}
                  </div>
                )}
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
            <div className="form-group">
              <label>Referral Code (Optional)</label>
              <div style={{display:'flex', gap:'10px'}}>
                <input
                  type="text"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={e => { setReferralCode(e.target.value.toUpperCase()); setReferralStatus(null); setReferralMessage(''); setReferralDiscount(0); }}
                  style={{flex:1, textTransform:'uppercase'}}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={!referralCode.trim() || !formData.email}
                  onClick={async () => {
                    try {
                      const r = await fetch('/api/referral-validate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: referralCode.trim(), email: formData.email, phone: formData.phone }),
                      });
                      const data = await r.json();
                      if (data.valid) {
                        setReferralStatus('valid');
                        setReferralDiscount(data.discount);
                        setReferralMessage(`✓ Code applied! ${data.discount}% off your first visit — referred by ${data.referrerName}`);
                      } else {
                        setReferralStatus('invalid');
                        setReferralMessage(data.error || 'Invalid code');
                      }
                    } catch {
                      setReferralStatus('invalid');
                      setReferralMessage('Could not validate code. Try again.');
                    }
                  }}
                >
                  Apply
                </button>
              </div>
              {referralMessage && (
                <p style={{marginTop:'6px', fontSize:'0.85rem', color: referralStatus === 'valid' ? '#10B981' : '#EF4444', fontWeight:600}}>
                  {referralMessage}
                </p>
              )}
            </div>
          </div>
          
          <div className="pricing-summary">
            <h3>Services</h3>
            {pricing.itemizedServices.map((service, i) => (
              <div key={i} className={`price-row ${service.isDependent ? 'dependent-row' : ''}`}>
                <span>{service.description}</span>
                <span>{service.isDependent ? '—' : `$${service.price.toFixed(2)}`}</span>
              </div>
            ))}

            {allDependent ? (
              <div className="tbd-total-notice">
                <div className="tbd-badge">Price TBD</div>
                <p>All services in your visit require an on-site assessment. You'll receive a confirmed quote before we schedule.</p>
              </div>
            ) : (
              <>
                {hasDependentItems && (
                  <div className="dependent-pricing-note" style={{marginBottom:'0.75rem'}}>
                    <strong>Note:</strong> Quote items (marked above as "Price TBD") are not included in the total below.
                  </div>
                )}
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

                {referralStatus === 'valid' && referralDiscount > 0 && (
                  <div className="price-row discount">
                    <span>Referral Discount ({referralDiscount}%):</span>
                    <span>-${(pricing.total * referralDiscount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>{hasDependentItems ? 'Fixed Items Total:' : 'Total:'}</span>
                  <span>${(referralStatus === 'valid' && referralDiscount > 0 ? pricing.total * (1 - referralDiscount / 100) : pricing.total).toFixed(2)}</span>
                </div>

                {hasDependentItems && (
                  <div className="dependent-pricing-note" style={{marginTop:'0.75rem'}}>
                    <strong>📧 Free Quote Included:</strong> You'll receive a quoted price for the marked service(s) via email before we schedule.
                  </div>
                )}
              </>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            {allDependent ? 'Request Free Quote' : 'Submit Visit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Confirmation Page
function ConfirmationPage() {
  const navigate = useNavigate();
  const pendingQuotes = sessionStorage.getItem('pendingQuoteServices');

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-icon">✅</div>
        <h1>Visit Submitted!</h1>
        <p className="confirmation-message">
          We've received your visit request and will contact you within 24 hours to confirm.
        </p>
        {pendingQuotes && (
          <div className="quote-notice">
            <strong>📋 Free Quote Coming:</strong> You'll receive a quoted price for <em>{pendingQuotes}</em> via email. We'll confirm everything before scheduling.
          </div>
        )}
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
      const response = await fetch('/api/submit-contact', {
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

// Custom Service Request Modal
function CustomRequestModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    date: '', time: '', description: '', materialsNeeded: '', otherNotes: '', paymentMethod: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/submit-custom-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'custom_request', timestamp: new Date().toISOString() })
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again or call (502) 387-5462.');
      }
    } catch {
      alert('Unable to submit. Please call us at (502) 387-5462.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div style={{textAlign:'center', padding:'2rem'}}>
            <div style={{fontSize:'3rem'}}>✅</div>
            <h2>Request Submitted!</h2>
            <p>We'll review your request and reach out to confirm pricing and scheduling.</p>
            <button className="btn btn-primary" onClick={onClose} style={{marginTop:'1rem'}}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Custom Service Request</h2>
        <p style={{color:'#64748B', marginBottom:'1.5rem'}}>Tell us what you need and we'll get back to you with pricing and availability.</p>
        <form onSubmit={handleSubmit} className="custom-request-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Service Address *</label>
              <input type="text" required placeholder="123 Main St, Louisville, KY" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date *</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>Preferred Time *</label>
              <select required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                <option value="">Select a time</option>
                {Array.from({length: 96}, (_, i) => {
                  const h = Math.floor(i / 4);
                  const m = (i % 4) * 15;
                  if (h < 8 || (h === 19 && m > 30) || h > 19) return null;
                  const val = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                  const ampm = h < 12 ? 'AM' : 'PM';
                  const h12 = h > 12 ? h - 12 : h;
                  const label = `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
                  return <option key={val} value={val}>{label}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Describe What You Need Done *</label>
            <textarea required rows="4" placeholder="Please describe the job in detail — what needs to be done, size of the area, any access info, etc." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Do We Need to Purchase Materials?</label>
            <textarea rows="2" placeholder="e.g. paint, mulch, hardware — or write 'No' if not applicable" value={formData.materialsNeeded} onChange={e => setFormData({...formData, materialsNeeded: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Anything Else Important?</label>
            <textarea rows="2" placeholder="Gate codes, pets, parking, special instructions..." value={formData.otherNotes} onChange={e => setFormData({...formData, otherNotes: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Preferred Payment Method *</label>
            <div className="payment-method-toggle">
              {['cash', 'card'].map(method => (
                <label key={method} className={`payment-method-option ${formData.paymentMethod === method ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="customPaymentMethod"
                    value={method}
                    required
                    checked={formData.paymentMethod === method}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  />
                  <span>{method === 'cash' ? '💵 Cash' : '💳 Card'}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Header
function Header() {
  const { cart } = React.useContext(CartContext);
  const [showCustomRequest, setShowCustomRequest] = useState(false);

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-text">DoItAllBros</span>
        </Link>
        <nav className="nav">
          <Link to="/services/packages" className="nav-link">Packages</Link>
          <Link to="/categories" className="nav-link">Services</Link>
          <Link to="/referral" className="nav-link">Referrals</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <button className="nav-link nav-link-custom" onClick={() => setShowCustomRequest(true)}>Custom Request</button>
          <Link to="/checkout" className="nav-link cart-link">
            Visit {cart.length > 0 && `(${cart.length})`}
          </Link>
          <Link to="/categories" className="nav-link nav-link-primary">Book Now</Link>
        </nav>
      </header>
      {showCustomRequest && <CustomRequestModal onClose={() => setShowCustomRequest(false)} />}
    </>
  );
}

// ── Referral Page ──────────────────────────────────────────
function ReferralPage() {
  const [email, setEmail] = useState('');
  const [looking, setLooking] = useState(false);
  const [result, setResult] = useState(null); // null | { found, code, creditsEarned, totalCompleted }
  const [lookupError, setLookupError] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || looking) return;
    setLooking(true);
    setLookupError('');
    setResult(null);
    setEmailSent(false);
    try {
      const r = await fetch('/api/referral-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await r.json();
      setResult(data);
    } catch {
      setLookupError('Something went wrong. Please try again.');
    }
    setLooking(false);
  };

  const handleEmailCode = async () => {
    if (emailSending || emailSent || !result) return;
    setEmailSending(true);
    try {
      await fetch('https://n8n.srv1122720.hstgr.cloud/webhook/4f5f6fa4-0661-4006-8685-357e43bc3501', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: result.found ? result.code : null,
          creditsEarned: result.creditsEarned || 0,
          totalCompleted: result.totalCompleted || 0,
          isExisting: result.found,
          source: 'referral_page',
        }),
      });
      setEmailSent(true);
    } catch {/* silent */}
    setEmailSending(false);
  };

  return (
    <div style={{maxWidth:'780px', margin:'0 auto', padding:'48px 24px'}}>
      {/* Hero */}
      <div style={{textAlign:'center', marginBottom:'48px'}}>
        <div style={{fontSize:'48px', marginBottom:'12px'}}>🎟</div>
        <h1 style={{fontSize:'2.2rem', fontWeight:800, color:'#1E293B', marginBottom:'12px'}}>Refer a Friend, Both Save</h1>
        <p style={{fontSize:'1.1rem', color:'#64748B', maxWidth:'520px', margin:'0 auto'}}>Share Do It All Bros with people you know. When they book their first service, you both get a discount — it's that simple.</p>
      </div>

      {/* How it works */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', marginBottom:'48px'}}>
        {[
          { icon:'📩', step:'1', title:'Get Your Code', desc:'Every customer gets a unique referral code after their first booking is confirmed.' },
          { icon:'📣', step:'2', title:'Share It', desc:'Send your code to friends, family, or anyone who could use a reliable handyman.' },
          { icon:'💸', step:'3', title:'They Save 10%', desc:'Your referral gets 10% off their first service when they enter your code at checkout.' },
          { icon:'🎉', step:'4', title:'You Save 20%', desc:'Once their first visit is completed, you earn a 20% discount on your next service.' },
        ].map(({ icon, step, title, desc }) => (
          <div key={step} style={{background:'#F8FAFC', borderRadius:'16px', padding:'24px', border:'1.5px solid #E2E8F0', textAlign:'center'}}>
            <div style={{fontSize:'32px', marginBottom:'8px'}}>{icon}</div>
            <div style={{fontSize:'11px', fontWeight:700, color:'#6366F1', letterSpacing:'.08em', marginBottom:'6px'}}>STEP {step}</div>
            <div style={{fontWeight:700, color:'#1E293B', marginBottom:'6px'}}>{title}</div>
            <div style={{fontSize:'13px', color:'#64748B'}}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Terms callout */}
      <div style={{background:'rgba(99,102,241,.06)', border:'1.5px solid rgba(99,102,241,.2)', borderRadius:'12px', padding:'20px 24px', marginBottom:'48px'}}>
        <h3 style={{fontWeight:700, color:'#6366F1', marginBottom:'10px', fontSize:'1rem'}}>The Fine Print</h3>
        <ul style={{margin:0, padding:'0 0 0 18px', color:'#475569', fontSize:'14px', lineHeight:'1.8'}}>
          <li>Your code is not active until your <strong>first visit is confirmed and completed</strong>.</li>
          <li>Referral discounts apply to the referred person's <strong>first service only</strong>.</li>
          <li>Your 20% credit applies to your <strong>next scheduled visit</strong> after the referral is completed.</li>
          <li>Codes cannot be used for self-referral or shared accounts.</li>
          <li>Do It All Bros reserves the right to void codes used in bad faith.</li>
        </ul>
      </div>

      {/* Lookup card */}
      <div style={{background:'#fff', border:'2px solid #E2E8F0', borderRadius:'16px', padding:'32px', textAlign:'center'}}>
        <h2 style={{fontWeight:800, color:'#1E293B', marginBottom:'8px', fontSize:'1.4rem'}}>Find Your Referral Code</h2>
        <p style={{color:'#64748B', fontSize:'14px', marginBottom:'24px'}}>Enter the email you used to book with us to view your code and stats.</p>

        <form onSubmit={handleLookup} style={{display:'flex', gap:'10px', maxWidth:'440px', margin:'0 auto', flexWrap:'wrap', justifyContent:'center'}}>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setResult(null); setEmailSent(false); }}
            style={{flex:'1', minWidth:'220px', padding:'12px 16px', borderRadius:'10px', border:'1.5px solid #CBD5E1', fontSize:'15px', outline:'none'}}
          />
          <button
            type="submit"
            disabled={looking}
            style={{padding:'12px 22px', borderRadius:'10px', background:'#6366F1', color:'#fff', fontWeight:700, fontSize:'15px', border:'none', cursor: looking ? 'default' : 'pointer', opacity: looking ? 0.7 : 1, whiteSpace:'nowrap'}}
          >
            {looking ? 'Looking…' : 'Look Up'}
          </button>
          {lookupError && <div style={{width:'100%', color:'#EF4444', fontSize:'13px'}}>{lookupError}</div>}
        </form>

        {/* Result */}
        {result && (
          <div style={{marginTop:'24px', textAlign:'left', maxWidth:'440px', margin:'24px auto 0'}}>
            {result.found ? (
              <div style={{padding:'20px 24px', background:'rgba(99,102,241,.07)', border:'1.5px solid rgba(99,102,241,.3)', borderRadius:'12px'}}>
                <div style={{fontSize:'13px', color:'#6366F1', fontWeight:700, letterSpacing:'.06em', marginBottom:'4px'}}>YOUR REFERRAL CODE</div>
                <div style={{fontSize:'2rem', fontWeight:900, color:'#1E293B', letterSpacing:'.12em', marginBottom:'12px'}}>{result.code}</div>
                <div style={{display:'flex', gap:'20px', marginBottom:'14px', flexWrap:'wrap'}}>
                  <div style={{background:'#F1F5F9', borderRadius:'8px', padding:'10px 16px', flex:'1', minWidth:'100px', textAlign:'center'}}>
                    <div style={{fontSize:'22px', fontWeight:800, color:'#6366F1'}}>{result.totalCompleted}</div>
                    <div style={{fontSize:'12px', color:'#64748B'}}>Successful Referrals</div>
                  </div>
                  <div style={{background:'#F1F5F9', borderRadius:'8px', padding:'10px 16px', flex:'1', minWidth:'100px', textAlign:'center'}}>
                    <div style={{fontSize:'22px', fontWeight:800, color:'#10B981'}}>{result.creditsEarned}</div>
                    <div style={{fontSize:'12px', color:'#64748B'}}>Credits Earned</div>
                  </div>
                </div>
                <div style={{fontSize:'12px', color:'#94A3B8', marginBottom:'14px', fontStyle:'italic'}}>Code becomes active once your first visit is confirmed and completed.</div>
                <button
                  onClick={handleEmailCode}
                  disabled={emailSending || emailSent}
                  style={{width:'100%', padding:'11px', borderRadius:'10px', border:'1.5px solid #6366F1', background: emailSent ? '#6366F1' : 'transparent', color: emailSent ? '#fff' : '#6366F1', fontWeight:700, fontSize:'14px', cursor: emailSent ? 'default' : 'pointer'}}
                >
                  {emailSent ? '✓ Code sent to your inbox!' : emailSending ? 'Sending…' : '📧 Send Me My Code'}
                </button>
              </div>
            ) : (
              <div style={{padding:'20px 24px', background:'rgba(245,158,11,.07)', border:'1.5px solid rgba(245,158,11,.3)', borderRadius:'12px', textAlign:'center'}}>
                <div style={{fontSize:'22px', marginBottom:'8px'}}>🤔</div>
                <div style={{fontWeight:700, color:'#92400E', marginBottom:'6px'}}>No code found for that email.</div>
                <div style={{fontSize:'13px', color:'#64748B'}}>Make sure you used the same email from your booking. If you haven't booked yet, your code will be created when you do.</div>
                <Link to="/checkout" style={{display:'inline-block', marginTop:'14px', padding:'10px 20px', borderRadius:'10px', background:'#F59E0B', color:'#fff', fontWeight:700, fontSize:'14px', textDecoration:'none'}}>Book Now</Link>
              </div>
            )}
          </div>
        )}

        <p style={{marginTop:'20px', fontSize:'13px', color:'#94A3B8'}}>Don't have a code yet? <Link to="/checkout" style={{color:'#6366F1', fontWeight:600}}>Book a service</Link> and one will be created for you automatically.</p>
      </div>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Do It All Bros</h4>
          <p>Louisville's trusted local service professionals. Handyman, lawn care, junk removal, moving, tech help, and more.</p>
        </div>
        <div className="footer-section">
          <h4>Services</h4>
          <Link to="/services/landscaping">Lawn Care & Landscaping</Link>
          <Link to="/services/homeMaintenance">Home Maintenance</Link>
          <Link to="/services/moving">Moving & Junk Removal</Link>
          <Link to="/services/tech">Tech Help</Link>
          <Link to="/services/emergency">Emergency Services</Link>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/categories">All Services</Link>
          <Link to="/referral">Referral Program</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/legal">Legal</Link>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p itemScope itemType="https://schema.org/LocalBusiness">
            <span itemProp="name">Do It All Bros</span><br />
            <a href="tel:+15023875462" itemProp="telephone">(502) 387-5462</a><br />
            <span itemProp="addressLocality">Louisville</span>, <span itemProp="addressRegion">KY</span>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Do It All Bros. All rights reserved. | Louisville, KY Home &amp; Business Services</p>
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
              <Route path="/referral" element={<ReferralPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
