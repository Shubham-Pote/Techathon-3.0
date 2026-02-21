import { Request, Response } from "express";
import { requestOtp, verifyOtp } from "./auth.service.js";

// Request OTP controller
export async function requestOtpController(req: Request, res: Response) {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required" });
  }

  try {
    const result = await requestOtp(mobile);
    res.status(200).json({ message: "OTP sent successfully", otp: result.otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}

// Verify OTP controller
export async function verifyOtpController(req: Request, res: Response) {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res
      .status(400)
      .json({ message: "Mobile number and OTP are required" });
  }

  try {
    const result = await verifyOtp(mobile, otp);
    res.status(200).json({
      message: "Login successful",
      token: result.token,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
