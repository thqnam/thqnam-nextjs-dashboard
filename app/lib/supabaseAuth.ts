'use client'
import { supabase } from '@/app/lib/supabaseClient';
import { getUserByEmail, insertUser, updateUser } from '@/app/lib/utils';
import { resetTarget } from '@/app/lib/actions';

export async function OAuthPasswordSignIn(email: string, password: string, phone: string) {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        phone,
        password,
    });
    if (error){
        throw error;
    } else {
        //await OAuthGetUser();
        resetTarget('/dashboard');
    }
}

export async function OAuthGoogleSignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://qned.vercel.app/dashboard',
        skipBrowserRedirect: true,
      }
    });
    if (error){
        throw error;
    } else {
        //await OAuthGetUser();
        resetTarget(data.url);
    }
}

export async function OAuthGithubSignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://qned.vercel.app/dashboard',
        skipBrowserRedirect: true,
      }
    });
    if (error){
        throw error;
    } else {
        //await OAuthGetUser();
        resetTarget(data.url);
    }
}

export async function OAuthGlobalSignOut() {
    await supabase.auth.signOut({scope: 'global'});
    resetTarget('/');
}

export async function OAuthLocalSignOut() {
    await supabase.auth.signOut({scope: 'local'});
    resetTarget('/');
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