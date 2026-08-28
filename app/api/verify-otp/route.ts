import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otpStore";

export async function POST(
  req: NextRequest
) {
  try {

    const {
      email,
      otp
    } = await req.json();

    const valid =
      verifyOtp(
        email,
        otp
      );

    if (!valid) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid or expired OTP",
        },
        {
          status: 400,
        }
      );

    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error:
          error.message,
      },
      {
        status: 500,
      }
    );

  }
}