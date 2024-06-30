import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorhandler";

export const isAuthenticatedUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");
    // console.log(getToken);
    // console.log(getToken);
    if (!getToken)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const token = getToken.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );
    // console.log("desss", decoded);

    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await User.findOne({ _id: decoded?.user?.userId }).select(
      "-password"
    );
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    // console.log("user =======", user);

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

export const authorizeRoles = (...roles: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `User type: ${req.user?.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};
