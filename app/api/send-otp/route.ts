import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveOtp } from "@/lib/otpStore";

export async function POST(
  req: NextRequest
) {
  try {

    const { email } =
      await req.json();

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    saveOtp(
      email,
      otp
    );

    const transporter =
      nodemailer.createTransport({
        host:
          process.env.SMTP_HOST,
        port: Number(
          process.env.SMTP_PORT
        ),
        secure: true,
        auth: {
          user:
            process.env.SMTP_USER,
          pass:
            process.env.SMTP_PASS,
        },
      });

    const info =
      await transporter.sendMail({
        from:
          process.env.SMTP_USER,
        to: email,
        subject:
          "AAFAQ ALMASAR OTP Code",
        html: `
          <h2>Verification Code</h2>

          <p>Your OTP code is:</p>

          <h1>${otp}</h1>

          <p>
            This code expires in
            10 minutes.
          </p>
        `,
      });

    console.log(
      "================================"
    );
    console.log(
      "OTP EMAIL SENT"
    );
    console.log(
      "TO:",
      email
    );
    console.log(
      "OTP:",
      otp
    );
    console.log(
      "MESSAGE ID:",
      info.messageId
    );
    console.log(
      "SMTP RESPONSE:",
      info.response
    );
    console.log(
      "================================"
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    console.error(
      "OTP EMAIL ERROR:"
    );
    console.error(error);

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