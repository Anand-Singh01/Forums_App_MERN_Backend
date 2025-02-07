import mongoose from 'mongoose';
import config from '../config/config';

export const connectToDatabase = async()=>
{
    try
    {
        await mongoose.connect(config.mongo.url!);
    }
    catch(error)
    {
        console.log(error);
        throw new Error("error connecting to mongo database.");
    }
}

export const disconnectDatabase = async()=>
{
    try
    {
        await mongoose.disconnect();
        console.log("disconnected to database");
    }
    catch(error)
    {
        console.log(error);
        throw new Error("error disconnecting mongo database.");
    }
}