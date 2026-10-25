import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const payload = req.body;
    const result = await gearService.createGear(payload, authorId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear created successfully",
      data: result,
    });
  },
);

const getAllGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await gearService.getAllGear(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All gear retrived successfully",
      data: result,
    });
  },
);

const getGearById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.id;

    const result = await gearService.getGearById(gearId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single gear retrived successfully",
      data: result,
    });
  },
);

export const gearController = {
  getAllGear,
  getGearById,
  createGear,
};
