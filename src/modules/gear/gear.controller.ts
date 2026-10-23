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

export const gearController = {
  getAllGear,
};
