import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const payload = req.body;

    const result = await rentalService.createRental(payload, customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental order created successfully",
      data: result,
    });
  },
);
const getMyRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await rentalService.getMyRentals(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrive my rental orders successfully",
      data: result,
    });
  },
);
const getRentalById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const rentalId = req.params.id as string;
    
    const result = await rentalService.getRentalById(rentalId, customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrive single rental orders successfully",
      data: result,
    });
  },
);

export const rentalController = {
  createRental,
  getMyRentals,
  getRentalById,
};
