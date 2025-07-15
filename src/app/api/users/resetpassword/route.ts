import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import connect from "@/app/dbConfig/dbConfig";

connect();

export async function POST(req: NextRequest) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "Missing token, email, or password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    console.log("Incoming:", { token, email, newPassword });
console.log("User from DB:", user);


    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(token, user.forgotPasswordToken);
    console.log(isValid)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}