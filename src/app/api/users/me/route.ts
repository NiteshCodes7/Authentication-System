import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connect from "@/app/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);

        const user = await User.findById({_id: userId}).select("-password");
        console.log(user);

        return NextResponse.json(
            {
                data: user,
                message: "User Found"
            },
            {status: 200}
        )
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}