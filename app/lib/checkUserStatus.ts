import { supabase } from '@/app/lib/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

export async function getUserStatusByID(id: string): Promise<boolean | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('status')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user status by id. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user status by id. Reason: ' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      if (data.status === 'login') {
        return true;
      } else {
        return false;
      }
    }
  }
}