'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut, getUser } from '@/auth';
import { AuthError } from 'next-auth';
import { supabase } from '@/app/lib/supabaseClient';

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Please input the name of this customer',
  }),
  email: z.string({
    required_error: 'Please input the email of this customer',
  }),
  image_url: z.string({
    required_error: 'Please input the image url of this customer',
  }),
});
 
const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const DeleteCustomerSchema = z.object({
  id: z.string(),
  reid: z.string({
    required_error: 'Please re input Customer ID',
  })
});

const DeleteInvoiceSchema = z.object({
  id: z.string(),
  reid: z.string({
    required_error: 'Please re input Invoice ID',
  })
});
 
const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const CreateCustomer = CustomerFormSchema.omit({id: true});
const UpdateCustomer = CustomerFormSchema.omit({id: true});
const DeleteCustomer = DeleteCustomerSchema.omit({id: true});
const DeleteInvoice = DeleteInvoiceSchema.omit({id: true});


export type InvoiceState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export type DeleteCustomerState = {
  errors?: {
    reid?: string[];
  };
  message?: string | null;
};

export type DeleteInvoiceState = {
  errors?: {
    reid?: string[];
  };
  message?: string | null;
};

export async function resetTarget(target : string) {
  revalidatePath(target);
  redirect(target);
}

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

    // Insert data into the database
    const { error } = await supabase
      .from('invoices')
      .insert([
        {
          customer_id: customerId,
          amount: amountInCents,
          status: status,
          date: date,
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
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
}

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

    // Insert data into the database
    const { error } = await supabase
      .from('customers')
      .insert([
        {
          name: name,
          email: email,
          image_url: image_url,
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
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
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

    const { error } = await supabase
      .from('invoices')
      .update({
        customer_id: customerId,
        amount: amountInCents,
        status: status,
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
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
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

    const { error } = await supabase
      .from('customers')
      .update({
        name: name,
        email: email,
        image_url: image_url,
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
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
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
        redirect('/dashboard/customers');
      }
      
    } else {
      return {
        message: 'Please just copy Invoice ID and paste to Re input ID',
      };
    }
  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Delete Invoice.',
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

    if (id === reid) {
      // Xóa tất cả invoices của customer trước
      const { error: invoiceError } = await supabase
        .from('invoices')
        .delete()
        .eq('customer_id', id);

      if (invoiceError) {
        return { 
          message: 'Database Error: Failed to Delete Customer Invoices. Reason: ' + invoiceError.message 
        };
      } else {
        // Xóa customer
        const { error: customerError } = await supabase
          .from('customers')
          .delete()
          .eq('id', id);
        if (customerError) {
          return { 
            message: 'Database Error: Failed to Delete Customer. Reason: ' + customerError.message 
          };
        } else {
          revalidatePath('/dashboard/customers');
          redirect('/dashboard/customers');
        }
      }

    } else {
      return {
        message: 'Please just copy Customer ID and paste to Re input ID',
      };
    }
  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Delete Customer.',
    };
  }
}

export async function getSessionInfor() {
  const sessionInfor = await auth();
  if (sessionInfor !== null){
    const sessionUser = sessionInfor.user;
    if (sessionUser !== undefined){
      return sessionUser;
    } else {
      return {};
    }
  } else {
    return {};
  }
}

export async function getSessionEmail() {
  const sessionUser = await getSessionInfor();
  if (sessionUser){
    const sessionEmail = sessionUser.email;
    if (sessionEmail !== '' && sessionEmail !== null && sessionEmail !== undefined){
      return sessionEmail;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

async function changeUserStatusLogin() {
  try {
    const email = await getSessionEmail();
    if (email !== ''){
      const user = await getUser(email);
      if (user !== undefined){
        const userStatus = user.status
        if (userStatus === 'logout'){
          const { error } = await supabase
            .from('users')
            .update({
              id: user.id,
              email: user.email,
              name: user.name,
              password: user.password,
              status: "login"
            })
            .eq('email', email);
          if (error) {
            throw error;
          }
        }
      } else {
        console.error('Failed to fetch data user.');
        throw new Error("Failed to fetch data user.");
      }
    } else {
      console.error('Failed to fetch session email.');
      throw new Error("Failed to fetch session email.");
    }
  } catch (error : any) {
    console.error('Failed to fix user login. Reason: ', error.message);
    throw new Error('Failed to fix user login. Reason: ' + error.message);
  }
}

async function changeUserStatusLogout() {
  try {
    const email = await getSessionEmail();
    if (email !== ''){
      const user = await getUser(email);
      if (user !== undefined){
        const userStatus = user.status
        if (userStatus === 'login'){
          const { error } = await supabase
            .from('users')
            .update({
              id: user.id,
              email: user.email,
              name: user.name,
              password: user.password,
              status: "logout"
            })
            .eq('email', email);
          if (error) {
            throw error;
          }
        }
      } else {
        console.error('Failed to fetch data user.');
        throw new Error("Failed to fetch data user.");
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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await changeUserStatusLogin();
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logOut() {
  await changeUserStatusLogout();
  await signOut({ redirectTo: '/' });
}