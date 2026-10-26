import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const rentalOrderId = session.metadata?.rentalOrderId;
  const customerId = session.metadata?.customerId;

  if (!rentalOrderId || !customerId) {
    throw new Error("Webhook: Missing rental information");
  }

  if (session.payment_status !== "paid") {
    console.log("Webhook: Payment is not completed yet");
    return;
  }

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!transactionId) {
    throw new Error("Webhook: Payment Intent ID missing");
  }

  await prisma.$transaction(async (tx) => {
    const rental = await tx.rentalOrder.findFirst({
      where: {
        id: rentalOrderId,
        customerId,
      },
    });

    if (!rental) {
      throw new Error("Rental order not found");
    }

    if (rental.status === "CANCELLED") {
      throw new Error("Cannot confirm a cancelled rental");
    }

    if (
      session.currency !== "usd" ||
      session.amount_total !== Math.round(rental.totalPrice * 100)
    ) {
      throw new Error("Payment amount or currency mismatch");
    }

    await tx.payment.upsert({
      where: {
        rentalOrderId,
      },

      create: {
        rentalOrderId,
        amount: rental.totalPrice,
        transactionId,
        paymentMethod: "STRIPE",
        status: "PAID",
      },

      update: {
        transactionId,
        paymentMethod: "STRIPE",
        status: "PAID",
      },
    });

    if (rental.status === "PENDING") {
      await tx.rentalOrder.update({
        where: {
          id: rentalOrderId,
        },
        data: {
          status: "CONFIRMED",
        },
      });
    }
  });
};