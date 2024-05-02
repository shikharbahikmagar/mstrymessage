import mongoose, {Schema, Document} from "mongoose";

//defining data types for message
export interface Message extends Document{
    content: String;
    createdAt: Date;

}

const MessageSchema: Schema<Message> = new Schema({
        content: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
})

//defining data types for user
export interface User extends Document {
    username: String;
    email: String;
    password: string;
    verifyCode: String;
    VerifyCodeExpiry: Date;
    isVerified: Boolean;
    isAcceptingMessage: Boolean;
    messages: Message[]

}

const UserSchema: Schema<User> = new Schema({

    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true,

    },

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, 'please use a valid email address'],
    },

    password: {
        type: String,
        required: [true, "password is required"],

    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"]
    },
    VerifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },

    messages: [MessageSchema]


})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;