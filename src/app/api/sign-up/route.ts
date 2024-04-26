import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendverificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try {
        
        const {username,email,password} =  await request.json()

        //checking if user is exist with same username and verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if(existingUserVerifiedByUsername)
            {
                return Response.json({
                    success: false,
                    message: "username already exist",
                }, {status: 400})
            }
        
        //checking if user is exist with entered email and it is verified or not
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

            if(existingUserByEmail)
                {
                    //checking if user is verified or not 
                    //if verified send message user exist
                    //else register user and send verification email
                    if(existingUserByEmail.isVerified)
                        {
                        return Response.json({
                            success: false,
                            message: "user exist with this email",
                        }, { status: 500 })

                        }else{

                            existingUserByEmail.password = await bcrypt.hash(password, 10);
                            existingUserByEmail.verifyCode = verifyCode;
                            existingUserByEmail.VerifyCodeExpiry = new Date(Date.now() + 3600000)

                            await existingUserByEmail.save();

                        }
                }else{
                    //if user does not exist register new user
                    const hashedPassword = await bcrypt.hash(password, 10)

                    const expiryDate = new Date()
                    expiryDate.setHours(expiryDate.getHours() + 1)

                    const newUer = new UserModel({
                        username,
                        email,
                        password: hashedPassword,
                        verifyCode,
                        VerifyCodeExpiry: expiryDate,
                        isVerified: false,
                        isAcceptingMessage: true,
                        messages: []
                    })

                    await newUer.save()

                }

        //send verification email
        const emailResponse = await sendverificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success)
            {
                return Response.json({
                    success: false,
                    message: emailResponse.message,
                }, {status: 500})
            }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email",
        }, { status: 201 })

    } catch (error) {
        console.log('error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}