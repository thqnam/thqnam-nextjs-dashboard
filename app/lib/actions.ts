'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut, unstable_update } from '@/auth';
import { getSessionEmail, getSessionID } from './data';
import { getUserByEmail, getUserByID } from './utils';
import { AuthError } from 'next-auth';
import { PostgrestError } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import { randomUUID } from 'crypto';
import { sendResetPasswordEmail, sendVerificationEmail } from '@/app/lib/mailer';

const UserFormSchema = z.object({
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
  image: z.string({
    invalid_type_error: 'Please select a image.',
    required_error: 'Must be select a image',
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
  newpassword: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the new password of this user',
  }),
  renewpassword: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the re-new password of this user',
  }),
});

const ResetPassFormSchema = z.object({
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

const ForgotPassFormSchema = z.object({
  email: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the email of this user',
  }).email({
    message: 'The string data must be look like email format'
  }),
});

const ChangeInforFormSchema = z.object({
  name: z.string({
    invalid_type_error: 'Please just input a string data',
    required_error: 'Please input the name of this user',
  }),
  image: z.string({
    invalid_type_error: 'Please select a image.',
    required_error: 'Must be select a image',
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
    invalid_type_error: 'Please select a image.',
    required_error: 'Must be select a image',
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
});

const DeleteInvoiceSchema = z.object({
  id: z.string(),
  reid: z.string({
    required_error: 'Please re input Invoice ID',
  }),
});

const DeleteUserSchema = z.object({
  id: z.string(),
  reid: z.string({
    required_error: 'Please re input User ID',
  }),
});
 
const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true});
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true });
const CreateCustomer = CustomerFormSchema.omit({ id: true, user_id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true, user_id: true });
const DeleteCustomer = DeleteCustomerSchema.omit({ id: true});
const DeleteInvoice = DeleteInvoiceSchema.omit({ id: true });
const DeleteUser = DeleteUserSchema.omit({});
const CreateUser = UserFormSchema.omit({});
const ChangePass = ChangePassFormSchema.omit({});
const ForgotPass = ForgotPassFormSchema.omit({});
const ResetPass = ResetPassFormSchema.omit({ email: true});
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
    image?: string[];
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

export type ForgotPassState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type ChangeInforState = {
  errors?: {
    name?: string[];
    image?: string[];
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

export type DeleteUserState = {
  errors?: {
    reid?: string[];
  };
  message?: string | null;
};

export async function resetTarget(target : string) {
  revalidatePath(target);
  redirect(target);
}

export async function resetSession(name : string, image : string) {
  await unstable_update({ user: { name: name, image: image } })
}

export async function createUser(prevState: UserState, formData: FormData){
  // Validate form using Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image: formData.get('image'),
    password: formData.get('password'),
    repassword: formData.get('repassword'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success) {
    // Prepare data for insertion into the database
    const { 
      name, 
      email, 
      image, 
      password, 
      repassword 
    } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user === undefined){

      if (password === repassword){

        const emailVerifyToken = randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        const hashedPassword = bcrypt.hashSync(password, 12);
        // Insert data into the database
        const { error } = await supabase
          .from('users')
          .insert([
            {
              name: name,
              email: email,
              image: image,
              password: hashedPassword,
              status: 'logout',
              email_verified: false,
              token: emailVerifyToken,
              expires: expiresAt.toISOString(),
            },
          ]);
          
        await sendVerificationEmail(email, name, emailVerifyToken);
        // If a database error occurs, return a more specific error.
        if (error) {
          return {
            message: 'Database Error: Failed to Create User. Reason: ' + error.message,
          };
        } else {
          redirect('/signupreponse');
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

export async function changeUserInfor(prevState: ChangeInforState, formData: FormData){
  
  const validatedFields = ChangeInfor.safeParse({
    name: formData.get('name'),
    image: formData.get('image'),
  });

  if (validatedFields.success) {
    
    const { 
      name, 
      image 
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
          await resetSession(name, image);
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
            await signOut();
            redirect('/signin');
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

export async function resetUserPass(email: string, prevState: ChangePassState, formData: FormData){
  
  const validatedFields = ResetPass.safeParse({
    newpassword: formData.get('newpassword'),
    renewpassword: formData.get('renewpassword'),
  });
  
  if (validatedFields.success) {
    
    const { newpassword, renewpassword } = validatedFields.data;
    
    if (newpassword === renewpassword){
      
      const user = await getUserByEmail(email);
      
      if (user !== undefined){
        
        const hashedPassword = bcrypt.hashSync(newpassword, 12);
        
        const { error } = await supabase
          .from('users')
          .update({
            password: hashedPassword,
            status: "logout",
            token: null, 
            expires: null
          })
          .eq('id', user.id);
          
        if (error) {
          return {
            message: 'Database Error: Failed to Reset Password. Reason: ' + error.message,
          };
        } else {
          redirect('/resetreponse');
        }
        
      } else {
        return {
          message: 'User of this email do not see in Database. Failed to Reset Password.',
        };
      }

    } else {
      return {
        message: 'New Password must be look like Re-New Password. Failed to Reset Password.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Reset Password.',
    };
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
            status: "logout"
          })
          .eq('email', email)
          .eq('status', 'login');
        if (error) {
          throw error;
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

export async function forgotUserPass(prevState: ForgotPassState, formData: FormData){
  
  const validatedFields = ForgotPass.safeParse({
    email: formData.get('email'),
  });

  if (validatedFields.success) {
    
    const { email } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user !== undefined){

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ
      const { error } = await supabase
        .from('users')
        .update({
          token: token,
          expires: expiresAt.toISOString(),
        }).eq('email', email);
      await sendResetPasswordEmail(email, user.name, token);
      
      if (error) {
        return {
          message: 'Database Error: Failed to Reset Password. Reason: ' + error.message,
        };
      } else {
        redirect('/forgotreponse');
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Reset Password.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Change Password.',
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

export async function deleteUser(
  prevState: DeleteUserState,
  formData: FormData,
) {
  const validatedFields = DeleteUser.safeParse({
    reid: formData.get('reid')
  });
  if (validatedFields.success) {
    const { reid } = validatedFields.data;
    const userID = await getSessionID();
    if (userID !== ''){
      if (userID === reid) {
        await changeUserStatusLogout();
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userID);
        if (error) {
          return { 
            message: 'Database Error: Failed to Delete User. Reason: ' + error.message 
          };
        } else {
          revalidatePath('/dashboard');
          redirect('/dashboard');
        }

      } else {
        return {
          message: 'Please just copy User ID and paste to Re input ID',
        };
      }

    } else {
      return {
        message: 'Missing User ID. Failed to Delete User.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Delete User.',
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

export async function logOut() {
  await changeUserStatusLogout();
  await signOut({});
}

export async function LogOut() {
  await signOut({});
}