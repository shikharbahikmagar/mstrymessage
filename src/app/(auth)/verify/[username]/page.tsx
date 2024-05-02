'use client'
import { useRouter, useParams } from "next/navigation"    
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifySchema } from "@/schemas/verifySchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const verifyAccount = () => {

    const params = useParams<{username: string}>()
    const router = useRouter()
    const {toast} = useToast()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
        }
    )

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code

            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')

        } catch (error) {
         
            console.log("error signing up user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
            toast({
                title: 'Verification failed',
                description: errorMessage,
                variant: "destructive"
            })
            
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="verification code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
            </div>
    )
}

export default verifyAccount;
