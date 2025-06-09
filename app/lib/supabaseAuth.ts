'use client'
import { supabase } from '@/app/lib/supabaseClient';
import { getUserByEmail, insertUser, updateUser } from '@/app/lib/utils';

export async function OAuthPasswordSignIn(email: string, password: string, phone: string) {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        phone,
        password,
    });
    if (error){
        throw error;
    } else {
        await OAuthGetUser();
    }
}

export async function OAuthGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error){
        throw error;
    } else {
        //await OAuthGetUser();
    }
}

export async function OAuthGithubSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error){
        throw error;
    } else {
        //await OAuthGetUser();
    }
}

export async function OAuthGlobalSignOut() {
    await supabase.auth.signOut({scope: 'global'});
}

export async function OAuthLocalSignOut() {
    await supabase.auth.signOut({scope: 'local'});
}

export async function OAuthSignUp(email: string, password: string, phone: string, name: string, image: string) {
    const { error } = await supabase.auth.signUp({
        email,
        phone,
        password,
        options: {
            data: { name: name, image: image },
        }
    });
    if (error){
        throw error;
    } else {
        await OAuthGetUser();
    }
}

export async function OAuthUpdateUser(email: string, password: string, phone: string, name: string, image: string) {
    const { error } = await supabase.auth.updateUser({
        email,
        phone,
        password,
        data: { name: name, image: image },
    });
    if (error){
        throw error;
    } else {
        await OAuthGetUser();
    }
}

async function OAuthGetUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error){
        throw error;
    } else {
        const email = user?.email || '';
        const name = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
        const image = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '';
        const dbUser = await getUserByEmail(email);
        if (dbUser){
            await updateUser(dbUser.id, email, name, image);
        } else {
            await insertUser(email, name, image);
        }
    }
}