import mongoose from "mongoose";
import { DB_NAME } from "@/constant/constant.js"

export default async function connect() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected Successfully!");
        })

        connection.on('error', (err) => {
            console.log("MongoDB connection error. Please make sure MongoDb is running", err);
            process.exit();
        })


    } catch (error) {
        console.log("Something went wrong!\n", error);
    }
}