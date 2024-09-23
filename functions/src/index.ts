import * as functions from "firebase-functions";
import * as cors from "cors";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_live_51PNu3xFjdpaeR3cx9nQPkrxITRLgR5zkWRnZvdH" +
    "FYN8j5AmEMdgOX6vPETJBbYHBymuWvygOLAt23skK65SFOi8300fFYL4ls4"
);

const corsHandler = cors({origin: true});

export const createCheckoutSession = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const amount = parseFloat(req.query.amount as string);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Beyond Profiler",
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/dashboard/survey/${
          req.query.id as string
        }`,
        cancel_url: `${req.headers.origin}/dashbard/user`,
      });

      return res.json({id: session.id});
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
      return;
    }
  });
});
