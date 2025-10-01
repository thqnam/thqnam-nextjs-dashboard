import { User, ImageField, UserSession } from './definitions';
import { supabase } from './supabaseClient';
import { randomUUID } from 'crypto';
import { PostgrestError } from '@supabase/supabase-js';
import { sendSignUpEmail }  from '@/app/lib/mailer';

export async function updateUser(id: string, email: string, name: string, image: string): Promise<void> {
  await checkImage(image);
  const { error } = await supabase
    .from('users')
    .update({
      name: name,
      email: email,
      image: image,
      status: 'login',
      email_verified: true,
    })
    .eq('id', id);
    
  if (error) {
    console.error('Failed to OAuth Update User. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to OAuth Update User. Reason: ' + error.message;
    throw talada;
  }
}

export async function insertUser(email: string, name: string, image: string): Promise<void> {
  await checkImage(image);
  const id = randomUUID();
  const token = randomUUID();
  const { error } = await supabase
    .from('users')
    .insert([
      {
        id: id,
        name: name,
        email: email,
        image: image,
        status: 'login',
        email_verified: true,
        role: 'user',
      },
    ]);

  if (error){
    console.error('Failed to OAuth Insert User. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to OAuth Insert User. Reason: ' + error.message;
    throw talada;
  } else {
    await sendSignUpEmail(email, name, token, id);
  }
}

async function getImageByPath(path: string): Promise<ImageField | undefined> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('path', path)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch image by id. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch image by id. Reason: ' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      const image = data as ImageField;
      return image;
    }
  }
}

async function updateImage(id: string, image: string): Promise<void> {
  const { error } = await supabase
    .from('images')
    .update({
      path: image,
    })
    .eq('id', id);
    
  if (error) {
    console.error('Failed to Update Image. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to Update Image. Reason: ' + error.message;
    throw talada;
  }
}

async function insertImage(image: string): Promise<void> {
  const name = crypto.randomUUID();
  const id = randomUUID();
  const { error } = await supabase
    .from('images')
    .insert([
      {
        id: id,
        name: name,
        path: image,
      },
    ]);

  if (error){
    console.error('Failed to OAuth Insert User. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to OAuth Insert User. Reason: ' + error.message;
    throw talada;
  }
}

async function checkImage(path: string){
  const dbImage = await getImageByPath(path);
  if (dbImage){
    updateImage(dbImage.id, path);
  } else {
    insertImage(path);
  }
}