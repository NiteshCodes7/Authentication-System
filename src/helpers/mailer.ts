import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {

    //create a hashedToken for forgotPassword
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken2 = await bcrypt.hash(rawToken, 10);

    //create a hashed token for isVerified
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 1000000,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedToken2,
          forgotPasswordTokenExpiry: Date.now() + 1000000,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: `${process.env.MAIL_TRAP_DEV_USER_KEY}`,
            pass: `${process.env.MAIL_TRAP_DEV_USER_PASSWORD}`
        }
    });

    const mailOptions = {
        from: "smtp@mailtrap.io",
        to: email,
        subject: emailType === "VERIFY" ? "Verify your Email": "Reset your Password",
        html: `
          <p>Click the link below to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}:</p>
          ${emailType === "VERIFY" ? `<a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}">Click here</a>` : `<a href="${process.env.DOMAIN}/reset?token=${rawToken}">Reset password</a>`}
          <p>or copy this link below and paste in your browser. <br> ${emailType === "VERIFY" ? `${process.env.DOMAIN}/verifyEmail?token=${hashedToken}` : `${process.env.DOMAIN}/reset?token=${rawToken}`}</p>
          <p>This link will expire in 10 minutes.</p>`
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

  } catch (error: any) {
    throw new Error(error.message);
  }
};
