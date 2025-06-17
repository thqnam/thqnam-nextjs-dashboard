import { Revenue, User, UserSession, ImageField } from './definitions';
import { supabase } from './supabaseClient';
import { randomUUID } from 'crypto';
import { PostgrestError } from '@supabase/supabase-js';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

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

export async function getUserByToken(token: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('token', token)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by token. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by token. Reason: ' + error.message;
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

export async function getUserSessionByID(id: string): Promise<UserSession | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('email, name, image')
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

export async function getUserByID(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by id. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by id. Reason: ' + error.message;
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
  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: name,
        email: email,
        image: image,
        status: 'login',
        email_verified: true,
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
  const { error } = await supabase
    .from('images')
    .insert([
      {
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