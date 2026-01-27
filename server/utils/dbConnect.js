import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function dbConnect() {
  try {
    let uri = process.env.DBURI;
    await mongoose.connect(uri);
    console.log(`database connected`);
  } catch (error) {
    console.log(error);
  }
}

dbConnect()