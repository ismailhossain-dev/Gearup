import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (customerId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: customerId,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: config.stripe_product_price_id,
        quantity: 1,
      },
    ],

    mode: "payment",

    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.app_url}/payment/cancel`,

    customer_email: user.email,

    metadata: {
      customerId: user.id,
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};
export const paymentService = {
  createCheckoutSession,
};
