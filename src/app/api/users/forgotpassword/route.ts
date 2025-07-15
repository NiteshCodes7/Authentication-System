import connect from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        await sendMail({
            email,
            emailType: "RESET",
            userId: user._id,
        })

        return NextResponse.json({ message: "Reset email sent" }, { status: 200 });


    } catch (error: any) {
        return NextResponse.json(
            { error: error.message }, 
            { status: 500 }
        );
    }
}