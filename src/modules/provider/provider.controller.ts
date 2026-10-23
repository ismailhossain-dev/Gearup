import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { providerService } from "./provider.service";

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;

    const result = await providerService.createGear(payload, authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear created successfully.",
      data: result,
    });
  },
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;
    const gearId = req.params.id;
    const isProvider =req.user?.role === "PROVIDER";

    const result = await providerService.updateGear(
      payload,
      gearId as string,
      authorId as string,
      isProvider
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear updated successfully",
      data: result,
    });
  },
);
export const providerController = {
  createGear,
  updateGear
};
