import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, service, clientName, clientEmail, bookingId } = req.body || {};

  console.log('[create-payment-link] called', { amount, service, bookingId });

  if (!service) {
    return res.status(400).json({ error: 'service is required' });
  }

  const stripe = new Stripe(process.env.DAB_STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(amount) * 100),
            product_data: {
              name: service,
              description: clientName ? `Service for ${clientName}` : undefined,
            },
          },
          quantity: 1,
        },
      ],
      ...(clientEmail ? { customer_email: clientEmail } : {}),
      metadata: { bookingId: bookingId || '' },
      success_url: 'https://doitallbros.com/payment-success',
      cancel_url: 'https://doitallbros.com',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-payment-link] Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
