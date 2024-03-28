const express = require('express');
const passport = require('passport');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const stripePayment = async (req, res) => {
    const product = req.body;
    const lineItems=product.cart.map((items)=>({
      price_data:{
        currency:"inr",
        product_data:{
          name:items.title
        },
        unit_amount:items.price*100,
      },
      quantity:items.count
    }));
    const session=await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:lineItems,
      mode:'payment',
      success_url:'http://localhost:3000/orders',
      cancel_url:'http://localhost:3000/Cart'
    });

    res.json({id:session.id})
};

router.post(
    "/payment",
    passport.authenticate("jwt", { session: false }),
    stripePayment 
);

module.exports = router;
