import {model,Schema} from "mongoose"

// User Schema
const userSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' }
  });

  export const User = model('User', userSchema);

