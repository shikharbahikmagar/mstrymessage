'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schemas/signInSchema";
import { useToast } from "@/components/ui/use-toast";
import {useForm} from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react";
import  {signIn} from "next-auth/react";


export default function signInForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof signInSchema >>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })
    
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        setIsSubmitting(true)

        try {
                const result = await signIn('credentials', {
                    redirect: false,
                    identifier: data.identifier,
                    password: data.password
                })

                if(result?.error)
                    {
                    if (result.error === "CredentialsSignin"){
                        toast({
                            title: 'Failed SignIn',
                            description: "Invalid username or password",
                            variant: "destructive"
                        })
                    }else {
                        toast({
                            title: 'Failed SignIn',
                            description: result.error,
                            variant: "destructive"
                        })
                    }
                    }

                    if(result?.url)
                        {
                            router.replace('/dashboard')
                        }

            router.replace('/dashboard')

        } catch (error) {
            console.log("error signing in", error)
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: 'Failed SignIn',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })

        }
    }
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to True Feedback
                    </h1>
                    <p className="mb-4">Sign in to continue your secret conversations</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <Input placeholder="email" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" placeholder="enter password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='w-full' type="submit">Sign In</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

