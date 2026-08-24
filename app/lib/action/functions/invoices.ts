'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSessionID } from '@/app/lib/data/dashboard';
import { supabase } from '@/app/lib/supabaseClient';
import { randomUUID } from 'crypto';
import { 
  InvoiceState,
  DeleteInvoiceState,
} from '@/app/lib/action/types/invoices'
import { 
  CreateInvoice, 
  UpdateInvoice, 
  DeleteInvoice,
} from '@/app/lib/action/schemas/invoices';

export async function createInvoice(prevState: InvoiceState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success) {
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    const userID = await getSessionID();
    if (userID !== ''){
      // Insert data into the database
      const id = randomUUID();
      const { error } = await supabase
        .from('invoices')
        .insert([
          {
            id: id,
            customer_id: customerId,
            amount: amountInCents,
            status: status,
            date: date,
            user_id: userID,
          },
        ]);
      // If a database error occurs, return a more specific error.
      if (error) {
        return {
          message: 'Database Error: Failed to Create Invoice. Reason: ' + error.message,
        };
      } else {
        // Revalidate the cache for the invoices page and redirect the user.
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Create Invoice.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
}

export async function updateInvoice(
  id: string,
  prevState: InvoiceState,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (validatedFields.success) {
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    const userID = await getSessionID();
    if (userID !== ''){
      const { error } = await supabase
        .from('invoices')
        .update({
          customer_id: customerId,
          amount: amountInCents,
          status: status,
          date: date,
          user_id: userID,
        })
        .eq('id', id);

      if (error) {
        return { 
          message: 'Database Error: Failed to Update Invoice. Reason: ' + error.message 
        };
      } else {
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Update Invoice.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
}

export async function deleteInvoice(
  id: string,
  prevState: DeleteInvoiceState,
  formData: FormData,
) {
  const validatedFields = DeleteInvoice.safeParse({
    reid: formData.get('reid')
  });
  if (validatedFields.success) {
    const { reid } = validatedFields.data;
    const userID = await getSessionID();
    if (userID !== ''){

      if (id === reid) {

        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', id);
        
        if (error) {
          return { 
            message: 'Database Error: Failed to Delete Invoice. Reason: ' + error.message 
          };
        } else {
          revalidatePath('/dashboard/invoices');
          redirect('/dashboard/invoices');
        }
        
      } else {
        return {
          message: 'Please just copy Invoice ID and paste to Re input ID. Failed to Delete Invoice.',
        };
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Delete Invoice.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Delete Invoice.',
    };
  }
}