import prisma from "../../config/db.js";
import { signJwt } from "../../utils/jwt.js";

// 1. Request OTP
export async function requestOtp(mobile: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Remove any previous OTP for this mobile
  await prisma.otp.deleteMany({
    where: { mobile },
  });

  // Store new OTP
  await prisma.otp.create({
    data: {
      mobile,
      code: otp,
      expiresAt,
    },
  });

  // Mock SMS
  console.log(`🔐 OTP for ${mobile} is: ${otp}`);

  return { success: true, otp };
}

// 2. Verify OTP
export async function verifyOtp(mobile: string, otp: string) {
  const record = await prisma.otp.findFirst({
    where: { mobile },
  });

  if (!record) {
    throw new Error("OTP not found");
  }

  if (record.code !== otp) {
    throw new Error("Invalid OTP");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  // Find or create farmer
  let farmer = await prisma.farmer.findUnique({
    where: { mobile },
  });

  if (!farmer) {
    farmer = await prisma.farmer.create({
      data: { mobile },
    });
  }

  // Delete OTP after successful verification
  await prisma.otp.deleteMany({
    where: { mobile },
  });

  // Generate JWT
  const token = signJwt({
    farmerId: farmer.id,
    mobile: farmer.mobile,
  });

  return { token };
}
