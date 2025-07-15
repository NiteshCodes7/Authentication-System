import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    //create a hashed token
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
          forgotPasswordToken: hashedToken,
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
          <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}">Click here</a>
          <p>or copy this link below and paste in your browser. <br> ${process.env.DOMAIN}/verifyEmail?token=${hashedToken}</p>
          <p>This link will expire in 10 minutes.</p>`
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

  } catch (error: any) {
    throw new Error(error.message);
  }
};
