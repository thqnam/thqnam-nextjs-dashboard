'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSessionID } from '@/app/lib/data/dashboard';
import { supabase } from '@/app/lib/supabaseClient';
import { randomUUID } from 'crypto';
import { 
  CustomerState,
  DeleteCustomerState,
} from '@/app/lib/actions/types/customers'
import { 
  CreateCustomer, 
  UpdateCustomer,
  DeleteCustomer,
} from '@/app/lib/actions/schemas/customers';

export async function createCustomer(prevState: CustomerState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success) {
    // Prepare data for insertion into the database
    const { name, email, image_url } = validatedFields.data;
    const userID = await getSessionID();
    if (userID !== ''){
      // Insert data into the database
      const id = randomUUID();
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            id: id,
            name: name,
            email: email,
            image_url: image_url,
            user_id: userID,
          },
        ]);
      // If a database error occurs, return a more specific error.
      if (error) {
        return {
          message: 'Database Error: Failed to Create Customer. Reason: ' + error.message,
        };
      } else {
        // Revalidate the cache for the customers page and redirect the user.
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Create Customer.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }
}

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData,
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (validatedFields.success) {
    const { name, email, image_url } = validatedFields.data;
    const userID = await getSessionID();
    if (userID !== ''){
      const { error } = await supabase
        .from('customers')
        .update({
          name: name,
          email: email,
          image_url: image_url,
          user_id: userID,
        })
        .eq('id', id);

      if (error) {
        return { 
          message: 'Database Error: Failed to Update Customer. Reason: ' + error.message 
        };
      } else {
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Update Customer.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    };
  }
}

export async function deleteCustomer(
  id: string,
  prevState: DeleteCustomerState,
  formData: FormData,
) {
  const validatedFields = DeleteCustomer.safeParse({
    reid: formData.get('reid')
  });
  if (validatedFields.success) {
    const { reid } = validatedFields.data;
    const userID = await getSessionID();
    if (userID !== ''){
      if (id === reid) {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);
        if (error) {
          return { 
            message: 'Database Error: Failed to Delete Customer. Reason: ' + error.message 
          };
        } else {
          revalidatePath('/dashboard/customers');
          redirect('/dashboard/customers');
        }

      } else {
        return {
          message: 'Please just copy Customer ID and paste to Re input ID. Failed to Delete Customer.',
        };
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Delete Customer.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Delete Customer.',
    };
  }
}