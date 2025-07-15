import connect from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {userName, email, password} = reqBody;

        console.log(reqBody);

        if(!userName || !email || !password){
            console.log("Required fields not filled. Please try again!");
            return NextResponse.json({message: "Required filed are missing please try again!"})
        }

        const user = await User.findOne({ email })

        if(user) {
            console.log("User already exists. Please try with another email!");
            return NextResponse.json({message: "User already exists. Please try with another email!"})
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();

        console.log(savedUser);

        await sendMail({email, emailType: "VERIFY", userId: savedUser._id});
        
        return NextResponse.json(
            {message: "User created successfully!", savedUser}, 
            {status: 201}
        );


    } catch (error: any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500})
    }
}