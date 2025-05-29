'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut, getUserByEmail, getUserByID } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';

const UserFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the name of this user',
  }),
  email: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the email of this user',
  }).email({
    message: 'The string data must be look like email format'
  }),
  password: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the password of this user',
  }),
  repassword: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the re-password of this user',
  }),
});

const ChangePassFormSchema = z.object({
  email: z.string(),
  newpassword: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the new password of this user',
  }),
  renewpassword: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the re-new password of this user',
  }),
});

const ChangeInforFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the name of this user',
  }),
  email: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the email of this user',
  }).email({
    message: 'The string data must be look like email format'
  }),
});

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the name of this customer',
  }),
  email: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the email of this customer',
  }).email({
    message: 'The string data must be look like email format'
  }),
  image_url: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the image url of this customer',
  }),
  user_id: z.string(),
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
  user_id: z.string(),
});

const DeleteCustomerSchema = z.object({
  id: z.string(),
  reid: z.string({
    required_error: 'Please re input Customer ID',
  }),
  user_id: z.string(),
});

const DeleteInvoiceSchema = z.object({
  id: z.string(),
  reid: z.string({
    required_error: 'Please re input Invoice ID',
  }),
  user_id: z.string(),
});
 
const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true});
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true });
const CreateCustomer = CustomerFormSchema.omit({id: true, user_id: true});
const UpdateCustomer = CustomerFormSchema.omit({id: true, user_id: true});
const DeleteCustomer = DeleteCustomerSchema.omit({id: true, user_id: true});
const DeleteInvoice = DeleteInvoiceSchema.omit({id: true, user_id: true});
const CreateUser = UserFormSchema.omit({id: true});
const ChangePass = ChangePassFormSchema.omit({});
const ChangeInfor = ChangeInforFormSchema.omit({});


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

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    repassword?: string[];
  };
  message?: string | null;
};

export type ChangePassState = {
  errors?: {
    newpassword?: string[];
    renewpassword?: string[];
  };
  message?: string | null;
};

export type ChangeInforState = {
  errors?: {
    name?: string[];
    email?: string[];
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

export async function changeUserInfor(prevState: ChangeInforState, formData: FormData){
  
  const validatedFields = ChangeInfor.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (validatedFields.success) {
    
    const { id, name, email } = validatedFields.data;

    const userID = await getUserByID(id);

    if (userID !== undefined){

      const userEmail = await getUserByEmail(email);

      if (userEmail === undefined){

        const { error } = await supabase
          .from('users')
          .update({
            id: userID.id,
            name: name,
            email: email,
            password: userID.password,
            status: userID.status,
          })
          .eq('id', userID.id);
        
        if (error) {
          return {
            message: 'Database Error: Failed to Change Infor. Reason: ' + error.message,
          };
        } else {
          revalidatePath('/dashboard/');
          redirect('/dashboard/');
        }
        
      } else {
        return {
          message: 'This email compare with a email of user in Database. Failed to Change Infor.',
        };
      }

    } else {
      return {
        message: 'User of this id do not see in Database. Failed to Change Infor.',
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
    email: formData.get('email'),
    newpassword: formData.get('newpassword'),
    renewpassword: formData.get('renewpassword'),
  });

  if (validatedFields.success) {
    
    const { email, newpassword, renewpassword } = validatedFields.data;

    if (newpassword === renewpassword){

      const user = await getUserByEmail(email);

      if (user !== undefined){

        const hashedPassword = bcrypt.hashSync(newpassword, 10);

        const { error } = await supabase
          .from('users')
          .update({
            id: user.id,
            name: user.name,
            email: user.email,
            password: hashedPassword,
            status: user.status,
          })
          .eq('id', user.id);
        
        if (error) {
          return {
            message: 'Database Error: Failed to Change Password. Reason: ' + error.message,
          };
        } else {
          revalidatePath('/dashboard/');
          redirect('/dashboard/');
        }
        
      } else {
        return {
          message: 'User of this email do not see in Database. Failed to Change Password.',
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

export async function createUser(prevState: UserState, formData: FormData){
  // Validate form using Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    repassword: formData.get('repassword'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success) {
    // Prepare data for insertion into the database
    const { name, email, password, repassword } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user === undefined){

      if (password === repassword){

        const hashedPassword = bcrypt.hashSync(password, 10);
        // Insert data into the database
        const { error } = await supabase
          .from('users')
          .insert([
            {
              name: name,
              email: email,
              password: hashedPassword,
              status: 'logout',
            },
          ])
          .eq('email', email);
        // If a database error occurs, return a more specific error.
        if (error) {
          return {
            message: 'Database Error: Failed to Create User. Reason: ' + error.message,
          };
        } else {
          redirect('/');
        }

      } else {
        return {
          message: 'Password must be look like Re-Password. Failed to Create User.',
        };
      }

    } else {
      return {
        message: 'This email compare with a email of user in Database. Failed to Create User.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }
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
    const userID = await getSessionID();
    if (userID !== ''){
      // Insert data into the database
      const { error } = await supabase
        .from('invoices')
        .insert([
          {
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
      const { error } = await supabase
        .from('customers')
        .insert([
          {
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
          redirect('/dashboard/customers');
        }
        
      } else {
        return {
          message: 'Please just copy Invoice ID and paste to Re input ID',
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

export async function getSessionName() {
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

export async function getSessionID() {
  const sessionUser = await getSessionInfor();
  if (sessionUser){
    const sessionID = sessionUser.id;
    if (sessionID !== '' && sessionID !== null && sessionID !== undefined){
      return sessionID;
    } else {
      return '';
    }
  } else {
    return '';
  }
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
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            status: "logout"
          })
          .eq('email', email)
          .eq('status', 'login');
        if (error) {
          throw error;
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