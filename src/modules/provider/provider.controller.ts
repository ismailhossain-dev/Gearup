import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { providerService } from "./provider.service";

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const payload = req.body;
    const result = await providerService.createGear(payload, authorId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear created successfully",
      data: result,
    });
  },
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const gearId = req.params.id as string;
    const providerId = req.user?.id as string;
    const result = await providerService.updateGear(
      payload,
      gearId,
      providerId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear Updated successfully",
      data: result,
    });
  },
);

const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.id as string;
    const providerId = req.user?.id as string;
    const result = await providerService.deleteGear(gearId, providerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear delete successfully",
      data: result,
    });
  },
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user!.id;

    const result = await providerService.getProviderOrders(
      providerId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Provider orders retrieved successfully",
      data: result,
    });
  }
);

// Update order status
const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const providerId = req.user!.id;
    const payload = req.body;

    const result = await providerService.updateOrderStatus(
      orderId,
      providerId,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental order status updated successfully",
      data: result,
    });
  }
);

export const providerController = {
  createGear,
  updateGear,
  deleteGear,
  getProviderOrders,
  updateOrderStatus
};
