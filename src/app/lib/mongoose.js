import mongoose from "mongoose";

const connection = {};

export const dbconnect = async () => {
    if (connection.isConnected) {
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState;
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw new Error('Error connecting to the database');
    }
};
