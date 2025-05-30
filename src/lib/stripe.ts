import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});

export const getStripeSession = async ({
  priceId,
  customerId,
  domainUrl,
}: {
  priceId: string;
  customerId: string;
  domainUrl: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: `${domainUrl}/payment/success`,
    cancel_url: `${domainUrl}/payment/cancel`,
  });

  return session.url as string;
};
