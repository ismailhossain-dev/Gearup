import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { amdinService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await amdinService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrived all users successfully",
    data: result,
  });
});

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const payload = req.body;

    const adminId = req.user?.id as string;

    const result = await amdinService.updateUser(userId, payload, adminId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: result,
    });
  },
);

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await amdinService.getAllGears();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrived all gears successfully",
      data: result,
    });
  },
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await amdinService.getAllRentals();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrived all rentals successfully",
      data: result,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUser,
  getAllGears,
  getAllRentals,
};
