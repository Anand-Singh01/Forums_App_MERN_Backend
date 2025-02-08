import { model,Schema} from "mongoose"
import mongoose  from 'mongoose';
import {Types} from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    dob: { type: Date, required: false },    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' }
  });

  export const User = model('User', userSchema);

