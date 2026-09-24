import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User register successfully",
      data: result,
    });
  },
);

const loginUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=> {
    const payload = req.body; 
    const {accessToken, refreshToken} = await  authService.loginUser(payload);

    //set token in cokkie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 1days
    })

    //set refresh token 
    res.cookie("refreshToken",refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
    })
    

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfully",
        data: {
            accessToken, 
            refreshToken
        }
    })
})


const refreshToken = catchAsync(async(req:Request, res:Response, next:NextFunction)=> {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshToken(refreshToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Refresh token generated successfully",
        data: result
    })
})


const getMyProfile = catchAsync(async(req:Request, res:Response, next:NextFunction)=> {
    const userId = req.user?.id; 
    const result = await authService.getMyProfileFromDB(userId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My profile retrived successfully",
        data: result
    })
})

export const authController = {
    registerUser, 
    loginUser,
    refreshToken,
    getMyProfile
}