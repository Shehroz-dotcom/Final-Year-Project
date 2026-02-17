import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PaymentController = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const parsedPrice = Number(totalPrice);

    if (!parsedPrice || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Invalid totalPrice value' });
    }

    const amountInPaise = Math.round(parsedPrice * 100); // PKR in paise

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'pkr',
      payment_method_types: ['card'],
      description: 'Order Payment',
    });

    // Return client_secret to frontend
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export { PaymentController };
