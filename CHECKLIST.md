# DoItAllBros - Pre-Launch Checklist

## 🔧 Configuration (Must Complete Before Launch)

### 1. n8n Webhooks Setup
- [ ] Created n8n workflow for bookings
- [ ] Created n8n workflow for contact form
- [ ] Updated booking webhook URL in `src/App.jsx` (line ~240)
- [ ] Updated contact webhook URL in `src/App.jsx` (line ~337)
- [ ] Tested both webhooks with sample data
- [ ] Set up email notifications in n8n
- [ ] (Optional) Connected to Google Sheets for logging

### 2. Contact Information
- [ ] Updated phone number: `(502) XXX-XXXX` → Your actual number
- [ ] Updated email: `hello@doitallbros.com` → Your actual email
- [ ] Verified contact info displays on all pages
- [ ] Tested contact form submission

### 3. Services & Pricing
- [ ] Reviewed all service categories
- [ ] Updated any prices that have changed
- [ ] Removed any services you don't offer
- [ ] Added any missing services
- [ ] Verified all services display correctly

### 4. Domain & Hosting
- [ ] Purchased domain (doitallbros.com or similar)
- [ ] Connected domain to VPS IP address
- [ ] Configured DNS A records
- [ ] Set up SSL certificate (HTTPS)
- [ ] Verified domain loads correctly

### 5. Payment Setup
- [ ] Decided on payment method (manual or Stripe)
- [ ] If Stripe: Created account and got API keys
- [ ] If manual: Added payment instructions to email template
- [ ] Tested payment workflow end-to-end

### 6. Calendar/Scheduling
- [ ] Set up Calendly (recommended) OR
- [ ] Configured Google Calendar API
- [ ] Set your availability hours
- [ ] Tested booking a time slot
- [ ] Verified you receive booking notifications

---

## 🎨 Design Customization (Optional)

### Branding
- [ ] Updated color scheme (if needed)
- [ ] Replaced favicon with custom logo
- [ ] Added business logo to header (if desired)
- [ ] Customized fonts (if needed)

### Content
- [ ] Reviewed all page copy for accuracy
- [ ] Checked for spelling/grammar errors
- [ ] Verified service descriptions are clear
- [ ] Added any additional pages (About, FAQ, etc.)

---

## 🧪 Testing (Critical)

### Functionality
- [ ] Tested on Chrome desktop
- [ ] Tested on Firefox desktop  
- [ ] Tested on Safari desktop
- [ ] Tested on iPhone Safari
- [ ] Tested on Android Chrome
- [ ] All category pages load
- [ ] All service pages load
- [ ] Booking form submits successfully
- [ ] Contact form submits successfully
- [ ] Navigation works on all pages
- [ ] Footer links work

### Forms Validation
- [ ] Required fields show errors when empty
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Date picker prevents past dates
- [ ] Time selection works properly

### Performance
- [ ] Pages load in under 3 seconds
- [ ] Images are optimized
- [ ] No console errors (F12 → Console)
- [ ] Mobile navigation works smoothly

---

## 🚀 Launch Day

### Pre-Launch (Day Before)
- [ ] Final test of all forms
- [ ] Verify n8n workflows are active
- [ ] Check phone/email one more time
- [ ] Test payment process
- [ ] Have emergency contact method ready

### Launch Day
- [ ] Deploy final build to VPS
- [ ] Clear browser cache and test
- [ ] Submit test booking as a customer would
- [ ] Monitor n8n for incoming submissions
- [ ] Check email notifications arrive
- [ ] Post on social media (optional)

### Post-Launch (First Week)
- [ ] Monitor booking submissions daily
- [ ] Respond to all inquiries within 24 hours
- [ ] Fix any bugs that appear
- [ ] Ask first customers for feedback
- [ ] Track which services are most popular

---

## 📊 Analytics & Tracking (Optional but Recommended)

- [ ] Set up Google Analytics
- [ ] Add Facebook Pixel (if running ads)
- [ ] Create Google Business Profile
- [ ] Set up conversion tracking
- [ ] Monitor traffic sources

---

## 🆘 Emergency Contacts

**If something breaks:**

1. **Website Down**: Check VPS status, restart Nginx
2. **Forms Not Working**: Check n8n workflows are running
3. **Domain Issues**: Contact domain registrar
4. **SSL Expired**: Run `sudo certbot renew`
5. **Can't Access VPS**: Contact Hostinger support

**Important Commands:**
```bash
# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t
```

---

## 📈 Growth Ideas (After Launch)

- [ ] Collect customer testimonials
- [ ] Add before/after photos gallery
- [ ] Create blog for SEO
- [ ] Offer first-time customer discount
- [ ] Create email newsletter
- [ ] Run Facebook/Google ads
- [ ] Partner with local real estate agents
- [ ] Offer seasonal packages (spring cleaning, snow removal)
- [ ] Create referral program

---

## 💡 Pro Tips

1. **Respond Fast**: Answer inquiries within 1 hour during business hours
2. **Ask for Reviews**: After every job, request a Google review
3. **Stay Consistent**: Update prices/services regularly
4. **Track Everything**: Log all bookings, cancellations, no-shows
5. **Build Email List**: Use for promotions and repeat business

---

## ✅ Launch Ready?

Once all items in "Configuration" and "Testing" are checked, you're ready to launch! 🎉

**Final reminder:** Test one more time as if you're a real customer. If the booking goes through successfully and you get notified, you're good to go!
