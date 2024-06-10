import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
};
