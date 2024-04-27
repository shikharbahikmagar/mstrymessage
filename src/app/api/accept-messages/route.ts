import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user)
        {
        return Response.json({
            success: false,
            message: "Not Authenticate"
        }, { status: 401 })
        }

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {
        
       const updatedUser =  await UserModel.findByIdAndDelete(
            userId,
            { isAcceptingMessage: acceptMessages }
        )

        if(!updatedUser)
            {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
            }
        
        return Response.json({
            success: true,
            message: "Message Acceptance status updated successfully",
            updatedUser
        }, { status: 200 })

    } catch (error) {
        console.log("failed to update user status to accept messages", error);

        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }

        
    }

export async function GET(request: Request){

    dbConnect()

    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User

        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not Authenticate"
            }, { status: 401 })
        }

        const userId = user._id;

        const foundUser = await UserModel.findById(userId)

        if(!foundUser)
            {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
            }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
        }, { status: 200 })
        
        
    } catch (error) {
        console.log("failed to get users accepting message status", error);

        return Response.json({
            success: false,
            message: "failed to get users accepting message status"
        }, { status: 500 })
    }

}
