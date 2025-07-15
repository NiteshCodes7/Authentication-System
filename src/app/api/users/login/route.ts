import axios from "axios";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import connect from "@/app/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        //check if user existed
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json(
                {error: "User does not exist"},
                {status: 400}
            )
        }

        //check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json(
                {error: "Invalid Password"},
                {status: 400}
            )
        }

        //create token data
        const tokenData = {
            id: user._id,
            userName: user.userName,
            email: user.email
        }

        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, 
            {expiresIn: "1d"});
        
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })

        response.cookies.set("token", token,
            {
                httpOnly: true,
                secure: true
            })

        return response;

    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}