import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


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

const getAllGearCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await gearService.getAllGearCategory();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retrived all category successfully",
      data: result,
    });
  },
);

export const gearController = {
  getAllGear,
  getGearById,
  getAllGearCategory
};
