# DoItAllBros - Service Booking Website

Professional service booking platform for Louisville, KY area.

## 🎯 Features

- 8 service categories with 60+ services
- Mobile-responsive design
- Service booking with date/time selection
- Contact form
- Clean, professional UI
- Easy to customize

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📝 Important Configuration

### 1. Update n8n Webhook URLs
In `src/App.jsx`, replace:
- Line ~240: Booking webhook
- Line ~337: Contact form webhook

### 2. Update Contact Information
In `src/App.jsx`, find and replace:
- `(502) XXX-XXXX` → Your phone number
- `hello@doitallbros.com` → Your email

### 3. Customize Services/Prices
Edit the `serviceData` object in `src/App.jsx` (line 8)

## 📚 Full Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Complete deployment instructions
- Domain & SSL setup
- Payment integration (Stripe)
- Calendar integration (Calendly/Google Calendar)
- Troubleshooting tips

## 🎨 Customization

### Colors
Edit CSS variables in `src/App.css`:
```css
--primary: #FF6B35;    /* Main brand color */
--secondary: #2C3E50;  /* Secondary color */
--accent: #F7B731;     /* Accent color */
```

### Fonts
Current fonts:
- Display: Bebas Neue
- Body: Work Sans

To change, edit the Google Fonts import in `src/App.css`

## 📦 Project Structure

```
doitallbros/
├── src/
│   ├── App.jsx          # Main application & routing
│   ├── App.css          # All styles
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── dist/                # Production build (generated)
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
├── nginx.conf           # Nginx config template
├── deploy.sh            # Deployment script
└── SETUP_GUIDE.md       # Full setup documentation
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + React Router
- **Build Tool**: Vite
- **Styling**: Custom CSS (no framework bloat)
- **Backend**: n8n webhooks
- **Hosting**: Hostinger VPS + Nginx

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Deployment

Quick deploy:
```bash
./deploy.sh
```

Or follow instructions in SETUP_GUIDE.md for detailed steps.

## 📞 Support

For help with:
- **Hosting**: Hostinger support
- **Automation**: n8n.io documentation
- **Payments**: stripe.com/docs

## 📄 License

Private - All Rights Reserved
