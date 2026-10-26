import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const result = await paymentService.createCheckoutSession(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Checkout completed successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
};
