import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, browser } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ALERT_EMAIL,
      subject: "AAFAQ ALMASAR - New Device Login",
      html: `
        <h2>New Device Login Detected</h2>

        <p><strong>User:</strong> ${email}</p>

        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>

        <p><strong>Browser:</strong></p>

        <p>${browser}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}