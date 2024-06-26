import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from '@/types/ApiResponse';

export async function sendverificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'no-reply@shikharbahik.com.np',
            to: email,
            subject: 'Mystry message | Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: "verification email sent successfully" }

    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { success: false, message: "failed to send verification email" }
    }
}