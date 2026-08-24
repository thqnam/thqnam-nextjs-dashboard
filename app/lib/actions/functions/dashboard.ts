'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut, unstable_update } from '@/auth';
import { getSessionEmail, getSessionID } from '@/app/lib/data/dashboard';
import { getUserByEmail } from '@/app/lib/data/users';
import { getUserByID } from '@/app/lib/utils';
import { AuthError } from 'next-auth';
import { PostgrestError } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import {
  ChangeInforState,
  ChangePassState,
} from '@/app/lib/actions/types/dashboard';
import {
  ChangeInfor,
  ChangePass,
} from '@/app/lib/actions/schemas/dashboard';

export async function resetTarget(target : string) {
  revalidatePath(target);
  redirect(target);
}

export async function resetSession(email: string, name : string, image : string, role : string) {
  await unstable_update({ user: { email: email, name: name, image: image, role: role } })
}

export async function changeUserInfor(prevState: ChangeInforState, formData: FormData){
  
  const validatedFields = ChangeInfor.safeParse({
    name: formData.get('name'),
    image: formData.get('image'),
  });

  if (validatedFields.success) {
    
    const { 
      name, 
      image,
    } = validatedFields.data;
    
    const id = await getSessionID();

    if (id !== ''){

      const userID = await getUserByID(id);

      if (userID !== undefined){

        const { error } = await supabase
          .from('users')
          .update({
            name: name,
            image: image,
          })
          .eq('id', userID.id);
        
        if (error) {
          return {
            message: 'Database Error: Failed to Change Infor. Reason: ' + error.message,
          };
        } else {
          await resetSession(userID.email, name, image, userID.role);
          revalidatePath('/dashboard');
          redirect('/dashboard');
        }

      } else {
        return {
          message: 'User of this id do not see in Database. Failed to Change Infor.',
        };
      }

    } else {
      return {
        message: 'Do not see id in this request. Failed to Change Infor.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Change Infor.',
    };
  }
}

export async function changeUserPass(prevState: ChangePassState, formData: FormData){
  
  const validatedFields = ChangePass.safeParse({
    newpassword: formData.get('newpassword'),
    renewpassword: formData.get('renewpassword'),
  });

  if (validatedFields.success) {
    
    const { newpassword, renewpassword } = validatedFields.data;

    if (newpassword === renewpassword){

      const email = await getSessionEmail();

      if (email !== ''){

        const user = await getUserByEmail(email);

        if (user !== undefined){

          const passwordsMatch = bcrypt.compareSync(newpassword, user.password);

          if (!passwordsMatch){

            const hashedPassword = bcrypt.hashSync(newpassword, 12);

            const { error } = await supabase
              .from('users')
              .update({
                password: hashedPassword,
                status: 'logout',
              })
              .eq('id', user.id);

            if (error) {
              return {
                message: 'Database Error: Failed to Change Password. Reason: ' + error.message,
              };
            } else {
              return {
                message: 'Change Password Successful',
              };
            }

          } else {
            return {
              message: 'New Password look like Old Password. Failed to Change Password.',
            };
          }
          
        } else {
          return {
            message: 'User of this email do not see in Database. Failed to Change Password.',
          };
        }

      } else {
        return {
          message: 'Do not see email in this request. Failed to Change Password.',
        };
      }

    } else {
      return {
        message: 'New Password must be look like Re-New Password. Failed to Change Password.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Change Password.',
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          console.error('Invalid credentials.');
          return 'Invalid credentials.';
        case 'AccessDenied':
          console.error('You have entered too many incorrect attempts. Please try again in 5 minutes.');
          return 'You have entered too many incorrect attempts. Please try again in 5 minutes.';
        case 'EmailSignInError':
          console.error('You need to verify your email before logging in.');
          return 'You need to verify your email before logging in.';
        default:
          console.error('Something went wrong.');
          return 'Something went wrong.';
      }
    } else if (error instanceof PostgrestError) {
      console.error(error.message);
      return error.message;
    } else {
      throw error;
    }
  }
}

export async function GoogleSignIn(){
  await signIn('google');
}

export async function GithubSignIn(){
  await signIn('github');
}

async function changeUserStatusLogout() {
  try {
    const email = await getSessionEmail();
    if (email !== ''){
      const user = await getUserByEmail(email);
      if (user !== undefined){
        const { error } = await supabase
          .from('users')
          .update({
            status: 'logout',
          })
          .eq('email', email)
          
        if (error) {
          throw error;
        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      console.error('Failed to fetch session email.');
      throw new Error("Failed to fetch session email.");
    }
  } catch (error : any) {
    console.error('Failed to fix user logout. Reason: ', error.message);
    throw new Error('Failed to fix user logout. Reason: ' + error.message);
  }
}

export async function logOut() {
  await changeUserStatusLogout();
  await signOut({});
}

export async function LogOut() {
  await signOut({});
}