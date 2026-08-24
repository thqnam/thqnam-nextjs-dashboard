'use server';

import {
  User
} from '@/app/lib/definitions/users';
import {
  UserSession,
} from '@/app/lib/definitions/dashboard';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/app/lib/supabaseClient';

export async function getUserSessionByID(id: string): Promise<UserSession | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('email, name, image, role')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user session by email. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user session by email. Reason: ' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as UserSession;
      return user;
    }
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by email. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by email. Reason: ' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}