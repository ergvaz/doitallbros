# DoItAllBros Website - Setup & Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd doitallbros
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### 3. Build for Production
```bash
npm run build
```

---

## 📋 Configuration Steps

### Step 1: Set Up n8n Webhooks

You need to create TWO webhooks in n8n:

#### Webhook 1: Booking Submissions
1. In n8n, create a new webhook node
2. Copy the webhook URL
3. Open `src/App.jsx`
4. Find line ~240 and replace `YOUR_N8N_WEBHOOK_URL_HERE` with your booking webhook URL

#### Webhook 2: Contact Form Submissions  
1. Create another webhook node in n8n
2. Copy the webhook URL
3. In `src/App.jsx`, find line ~337 and replace the second `YOUR_N8N_WEBHOOK_URL_HERE`

**Example n8n Workflow for Bookings:**
```
Webhook → Filter → Email/SMS Notification → Google Sheets Logger
```

---

### Step 2: Connect Domain & SSL

#### Option A: Using Hostinger (Recommended)
1. Go to Hostinger control panel
2. Navigate to "Domains" → "Add Domain"
3. Point your domain to your VPS IP address
4. Set up SSL certificate (Let's Encrypt - free)

#### Option B: Manual DNS Setup
1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Create an A record pointing to your VPS IP:
   ```
   Type: A
   Name: @
   Value: YOUR_VPS_IP
   TTL: 3600
   ```
3. Create a CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: yourdomain.com
   ```

---

### Step 3: Payment Integration (Stripe)

You have two options for collecting payments:

#### Option A: Manual Payment Collection (Simplest - Start Here)
1. In the booking confirmation email, include your Venmo/Zelle/payment link
2. Have customers pay after service is confirmed
3. Track payments in a spreadsheet

#### Option B: Stripe Integration (Advanced)
1. Sign up at stripe.com
2. Install Stripe package: `npm install @stripe/stripe-js`
3. Add this to your booking page:

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// In your booking submit handler:
const handlePayment = async () => {
  const stripe = await stripePromise;
  // Redirect to Stripe checkout
  const response = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service, price })
  });
  
  const session = await response.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
};
```

**My Recommendation:** Start with Option A (manual), add Stripe later once you have steady bookings.

---

### Step 4: Calendar Integration

#### Option A: Simple - Use Calendly Embed (Easiest)
1. Sign up at calendly.com (free)
2. Set your availability 
3. Get your Calendly link
4. Replace the booking form date/time inputs with:

```javascript
// In BookingPage component, replace the form with:
<div className="calendly-embed">
  <iframe 
    src="https://calendly.com/your-username/service-booking?hide_gdpr_banner=1"
    width="100%"
    height="700"
    frameborder="0"
  />
</div>
```

#### Option B: Google Calendar API (Advanced)
Requires backend setup - recommend starting with Calendly.

---

## 🖥️ Deployment to Hostinger VPS

### Step 1: Build the Site
```bash
npm run build
```
This creates a `dist` folder with your production files.

### Step 2: Upload to VPS

#### Method A: FileZilla (Easiest)
1. Download FileZilla
2. Connect to your VPS:
   - Host: your-vps-ip
   - Username: your-username
   - Password: your-password
   - Port: 22
3. Navigate to `/var/www/html/` (or your web root)
4. Upload everything from `dist` folder

#### Method B: rsync (Command Line)
```bash
rsync -avz --delete dist/ username@your-vps-ip:/var/www/html/doitallbros/
```

### Step 3: Configure Nginx (Web Server)

SSH into your VPS and create this config:

```bash
sudo nano /etc/nginx/sites-available/doitallbros
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name doitallbros.com www.doitallbros.com;
    
    root /var/www/html/doitallbros;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/doitallbros /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL Certificate (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d doitallbros.com -d www.doitallbros.com
```

Follow the prompts. Certbot will automatically configure SSL.

---

## 🎨 Customization

### Change Colors
Edit `src/App.css` at the top (CSS variables):
```css
:root {
  --primary: #FF6B35;  /* Change this to your brand color */
  --secondary: #2C3E50;
  --accent: #F7B731;
}
```

### Update Contact Info
In `src/App.jsx`, search for:
- `(502) XXX-XXXX` - Replace with your phone
- `hello@doitallbros.com` - Replace with your email

### Modify Services or Prices
Edit the `serviceData` object in `src/App.jsx` (starts around line 8)

---

## 📱 Testing Checklist

Before going live:
- [ ] Test all service categories load correctly
- [ ] Test booking form submits to n8n webhook
- [ ] Test contact form submits to n8n webhook
- [ ] Test on mobile devices (Chrome DevTools → Device Toolbar)
- [ ] Verify your phone/email displays correctly
- [ ] Check all links work
- [ ] Test with real booking data
- [ ] Set up n8n to send you email/SMS notifications

---

## 🔧 Maintenance

### Update Services/Prices
1. Edit `src/App.jsx`
2. Run `npm run build`
3. Upload new `dist` folder to VPS

### View Bookings
Check your n8n workflow execution history or connect it to:
- Google Sheets (automatic logging)
- Airtable
- Email notifications

---

## 🆘 Troubleshooting

### "Page not found" on refresh
Your Nginx config needs the `try_files` directive (see Step 3 above)

### Booking form not submitting
Check browser console (F12) for errors. Verify n8n webhook URLs are correct.

### Mobile layout broken
Clear cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### SSL certificate issues
Run: `sudo certbot renew --dry-run` to test renewal

---

## 📞 Support Resources

- **Hostinger VPS Support**: Available in your hosting panel
- **n8n Documentation**: https://docs.n8n.io
- **Stripe Documentation**: https://stripe.com/docs
- **React Router**: https://reactrouter.com

---

## 🎯 Next Steps After Launch

1. Set up Google Analytics or Plausible for tracking
2. Add testimonials section
3. Implement online booking calendar
4. Add before/after photo gallery
5. Create automated email sequences for follow-ups
6. Set up Facebook Pixel for ads
7. Build out a blog for SEO

---

## 💡 Pro Tips

1. **Start Simple**: Use manual payment and Calendly first, add complexity later
2. **Test on Real Devices**: Don't just use browser dev tools
3. **Backup Everything**: Before making changes, copy your `dist` folder
4. **Monitor n8n**: Check your workflows daily the first week
5. **Ask for Reviews**: Add Google Business link after service completion

---

Need help? Feel free to ask! 🚀
