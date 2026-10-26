import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./subscription.utils";

const createCheckoutSession = async (
  customerId: string,
  rentalOrderId: string
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: customerId,
    },
  });

  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalOrderId,
      customerId,
      status: "PENDING",
    },
    include: {
      gear: true,
    },
  });

  if (!rental) {
    throw new Error("Rental order not found");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    // Logged-in customer's email
    customer_email: user.email,

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${rental.gear.name} Rental`,
          },
          unit_amount: Math.round(rental.totalPrice * 100),
        },
        quantity: 1,
      },
    ],

    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,

    metadata: {
      customerId: user.id,
      rentalOrderId: rental.id,
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};
//save payment data
const handleWebhook = async (
  payload: Buffer,
  signature: string
) => {
  const endpointSecret = config.stripe_webhook_secret;

  if (!endpointSecret) {
    throw new Error("Stripe webhook secret is missing");
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      await handleCheckoutCompleted(session);

      break;
    }

    case "checkout.session.async_payment_succeeded": {
      await handleCheckoutCompleted(event.data.object);

      break;
    }

    case "checkout.session.async_payment_failed": {
      console.log(
        "Stripe payment failed:",
        event.data.object.id
      );

      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return {
    received: true,
  };
};


export const paymentService = {
  createCheckoutSession,
  handleWebhook
};
