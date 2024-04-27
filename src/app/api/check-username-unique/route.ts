import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod'

import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    // localhost/api/check-username-unique?username = shikhar

    try {

        //get all url 
        const { searchParams } = new URL(request.url);

        //get username from url
        const queryParams = {
            username: searchParams.get('username'),
        };

        //validating username 
        const result = UsernameQuerySchema.safeParse(queryParams);
        //remove 
        console.log(result);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameError.length > 0
                    ? usernameError.join(', ') : 'Invalid query parameter.',
            }, { status: 400 });
        }

        // extracting result data
        const { username } = result.data;

        //searching in database if username is already taken or not
        const existingUsername = await UserModel.findOne({ username, isVerified: true })
        if (existingUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }
            return Response.json({
                success: true,
                message: "username available"
            }, { status: 400 })


    } catch (error) {
        console.log("error checking username", error);

        return Response.json({
            success: false,
            message: "error checking username"
        }, { status: 500 })

    }
}