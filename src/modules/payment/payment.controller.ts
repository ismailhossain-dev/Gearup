import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const { rentalOrderId } = req.body;
    const result = await paymentService.createCheckoutSession(customerId, rentalOrderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Checkout completed successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (typeof signature !== "string") {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Stripe signature is missing",
    });
  }

  const result = await paymentService.handleWebhook(
    req.body as Buffer,
    signature,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "webhook triggered successfully",
    data: result,
  });

});
export const paymentController = {
  createCheckoutSession,
  handleWebhook,
};
