# DoItAllBros Website - Quick Start 🚀

## Your website is ready! Here's what to do next:

### Step 1: Download & Extract
You've got the complete website. Extract it to your computer.

### Step 2: Install & Run (5 minutes)
```bash
cd doitallbros
npm install
npm run dev
```

Visit http://localhost:3000 to see your site!

### Step 3: Critical Configuration (15 minutes)

#### A. Update n8n Webhooks
1. Open `src/App.jsx`
2. Find `YOUR_N8N_WEBHOOK_URL_HERE` (appears twice)
3. Replace with your n8n webhook URLs:
   - First one (line ~240): Booking submissions
   - Second one (line ~337): Contact form submissions

#### B. Update Contact Info
In `src/App.jsx`, search and replace:
- `(502) XXX-XXXX` → Your phone number
- `hello@doitallbros.com` → Your email address

#### C. Review Services
Check the `serviceData` object (line 8 in App.jsx) and:
- Update any prices
- Remove services you don't offer
- Add any missing services

### Step 4: Test Everything (10 minutes)
- [ ] Browse all service categories
- [ ] Try to book a service
- [ ] Submit contact form
- [ ] Check n8n receives the data
- [ ] Test on your phone

### Step 5: Build & Deploy
```bash
npm run build
```

Upload the `dist` folder to your Hostinger VPS at `/var/www/html/doitallbros/`

---

## 📁 Key Files to Know

- **`src/App.jsx`** - All the functionality (update webhooks & contact info here)
- **`src/App.css`** - All the styling (colors, fonts, etc.)
- **`SETUP_GUIDE.md`** - Complete deployment instructions
- **`CHECKLIST.md`** - Pre-launch checklist
- **`nginx.conf`** - Server configuration template

---

## 🎨 Design Features

Your site has:
- ✅ 8 service categories with 60+ services
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Professional industrial-modern design
- ✅ Service booking with date/time selection
- ✅ Contact form
- ✅ Clean navigation
- ✅ SEO-ready HTML structure

**Color Scheme:**
- Primary Orange: #FF6B35 (CTAs, accents)
- Dark Grey: #1A1A1A (headers, text)
- Gold Accent: #F7B731 (highlights)

**Fonts:**
- Display: Bebas Neue (headers)
- Body: Work Sans (everything else)

---

## 🔗 What You'll Need

### Immediate (Before Launch):
1. **n8n Webhooks** - Create 2 workflows:
   - Booking handler (email notification + log to sheets)
   - Contact form handler (email notification)

2. **Domain** - Purchase and point to your VPS
   - Recommended: doitallbros.com

3. **SSL Certificate** - Free with Let's Encrypt
   ```bash
   sudo certbot --nginx -d doitallbros.com
   ```

### Optional (Can Add Later):
- **Calendly** - For advanced scheduling (free tier available)
- **Stripe** - For online payments (2.9% + 30¢ per transaction)
- **Google Analytics** - Track visitors
- **Facebook Pixel** - If running ads

---

## 💡 Recommendations

### Payment Strategy
**Start simple:** Collect payment after service confirmation
- Have n8n send you booking details
- Call customer to confirm
- Collect payment via Venmo/Zelle/Cash on service day
- Add Stripe later once you have steady business

### Calendar Strategy  
**Option 1 (Easiest):** Use Calendly
- Sign up at calendly.com
- Set your availability
- Embed in booking page

**Option 2:** Keep current manual system
- Customers pick preferred date/time
- You confirm availability
- Schedule in your personal calendar

---

## 🎯 Your Next 24 Hours

**Hour 1-2: Setup**
- Install dependencies
- Update webhooks
- Update contact info
- Test locally

**Hour 3-4: n8n Configuration**
- Create booking workflow
- Create contact workflow
- Test both with real data
- Set up email notifications

**Hour 5-6: Deploy**
- Build production version
- Upload to VPS
- Configure Nginx
- Set up SSL

**Hour 7-8: Testing**
- Test on all devices
- Submit test bookings
- Verify you receive notifications
- Fix any issues

**Ready to launch!** 🎉

---

## 🆘 Need Help?

**Common Issues:**

1. **"npm install" fails**
   - Delete `node_modules` and try again
   - Make sure you have Node.js 18+ installed

2. **Webhooks not working**
   - Check n8n workflows are active
   - Verify URLs are correct (no trailing slashes)
   - Check browser console for errors (F12)

3. **Mobile layout issues**
   - Clear cache (Ctrl+Shift+R)
   - Test in actual device, not just DevTools

4. **Can't deploy to VPS**
   - Verify SSH access works
   - Check file permissions on /var/www/html
   - Make sure Nginx is running

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Full deployment walkthrough
- **CHECKLIST.md** - Pre-launch checklist
- **README.md** - Project overview

---

## ✅ You're All Set!

Everything you need is included. The hardest part (building the site) is done. Now it's just:
1. Update your info (webhooks, phone, email)
2. Test it
3. Deploy it
4. Start taking bookings!

Questions? Check SETUP_GUIDE.md for detailed answers.

Good luck with DoItAllBros! 💪
