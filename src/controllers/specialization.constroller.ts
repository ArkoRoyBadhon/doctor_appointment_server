import catchAsyncError from "../middlewares/catchAsyncErrors";
import Specialization from "../models/specialization.model";

export const getAllSpecialization = catchAsyncError(async (req, res) => {
  const result = await Specialization.find();
  res.send({
    success: true,
    data: result,
    message: "Successfully get all specializations",
  });
});
