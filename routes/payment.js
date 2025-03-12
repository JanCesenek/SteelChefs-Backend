const express = require("express");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51QkTk9Hv8IdCrU9JUpnwujk618FKjJbkHtDN1M1wDkitXalnSFE8dIRZJd8Mna0qYQjEZowlBvtQktYtSvzUSltb00PGAZPLPM"
);

const router = express.Router();

router.get("/config", (_, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
