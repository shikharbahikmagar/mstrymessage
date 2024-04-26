import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            })
        }

        const isCodeValid = user?.verifyCode === code
        const isCodeNotExpired = new Date(user.
            VerifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {status: 200})
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code date expired, Please Signup again to get new code"
            }, {status: 400})
        }
        else (!isCodeValid)
        {
            return Response.json({
                success: false,
                message: "Incorrect Verification code"
            }, {status: 400})
        }

    } catch (error) {
        console.log("Error verifying code", error);

        return Response.json({
            success: false,
            message: "error verifying message"
        })

    }
}