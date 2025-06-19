'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()
    if (!email || !password) {
        redirect('/auth/error?error=missing_credentials&error_detail=Email and password are required.&redirect_uri=/auth/login')
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect(`/auth/error?error=loginFail&error_detail=${encodeURIComponent(error.message)}&redirect_uri=/auth/login`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function loginWithGoogle() {
    const supabase = await createClient()

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })

    if (error) {
        redirect(`/auth/error?error=googleLoginFail&error_detail=${encodeURIComponent(error.message)}&redirect_uri=/auth/login`)
    }

    if (data?.url) {
        console.log('Google login URL:', data.url)
        redirect(data.url)
    } else {
        redirect('/auth/error?error=unknown&error_detail=Google login failed, no URL returned.&redirect_uri=/auth/login')
    }
}