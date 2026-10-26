import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const { rentalOrderId } = req.body;
    const result = await paymentService.createCheckoutSession(
      customerId,
      rentalOrderId,
    );

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
    statusCode: httpStatus.CREATED,
    message: "webhook triggered successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const result = await paymentService.getMyPayments(customerId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);


const getSinglePayment = catchAsync(
  async (req: Request, res: Response) => {
    const paymentId = req.params.id as string;
    const customerId = req.user!.id;

    const result = await paymentService.getSinglePayment(
      paymentId,
      customerId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  }
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getSinglePayment
  
};
