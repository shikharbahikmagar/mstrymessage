import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from '@/model/User'

export async function POST(request: Request){

    await dbConnect()

    try {
          const{username, content} =   await request.json()

          const user = await UserModel.findOne({username})
        if(!user)
            {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 400 })
            }
          if(!user.isAcceptingMessage)
            {
              return Response.json({
                  success: false,
                  message: "user is not accepting message"
              }, { status: 401 })
            }

        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "message sent successfully"
        }, { status: 401 })
    } catch (error) {
        
    }

}
