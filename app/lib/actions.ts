// 'use server';

// import { z } from 'zod';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { signIn, signOut, unstable_update } from '@/auth';
// import { getSessionEmail, getSessionID } from '@/app/lib/data/dashboard';
// import { getUserByEmail } from '@/app/lib/data/users';
// import { getUserByID } from '@/app/lib/utils';
// import { AuthError } from 'next-auth';
// import { PostgrestError } from '@supabase/supabase-js';
// import bcrypt from 'bcryptjs';
// import { supabase } from '@/app/lib/supabaseClient';
// import { randomUUID } from 'crypto';
// import { 
//   sendResetPasswordEmail,
//   sendResetEmailAddressEmail,
//   sendSignInEmail,
//   sendSignUpEmail, 
//   sendSignDownEmail,
//   sendChangeMailToEmail,
//   sendChangeMailFromEmail,
// } from '@/app/lib/mailer';

// const VerifyUserRequestFormSchema = z.object({
//   email: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const CreateUserRequestFormSchema = z.object({
//   name: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the name of this user.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   email: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   image: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Must be select a image for it.';
//       }

//       return 'Please just select a image.';
//     },
//   }),
// });

// const CreateUserHandleFormSchema = z.object({
//   email: z.string(),
//   password: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the password of this user.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   repassword: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the re-password of this user.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
// });

// const ChangePassFormSchema = z.object({
//   newpassword: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the new password of this user.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
//   renewpassword: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the re-new password of this user.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
// });

// const ResetPassHandleFormSchema = z.object({
//   email: z.string(),
//   newpassword: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the new password of this user.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
//   renewpassword: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the re-new password of this user.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
// });

// const ResetPassRequestFormSchema = z.object({
//   email: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const ResetEmailHandleFormSchema = z.object({
//   oldemail: z.string(),
//   recoverycode: z.uuid({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the recovery code of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like UUID format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   password: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the password of this user.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const ResetEmailRequestFormSchema = z.object({
//   oldemail: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the old email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   newemail: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the new email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const ChangeMailFromRequestFormSchema = z.object({
//   email: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const ChangeMailToRequestFormSchema = z.object({
//   oldemail: z.string(),
//   newemail: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the new email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const ChangeMailHandleFormSchema = z.object({
//   oldemail: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the old email of this user.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   password: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the password of this user.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
// });

// const ChangeInforFormSchema = z.object({
//   name: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the name of this user.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
//   image: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Must be select a image for it.';
//       }

//       return 'Please just select a image.';
//     },
//   }),
// });

// const CustomerFormSchema = z.object({
//   id: z.string(),
//   name: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the name of this customer.';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
//   email: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the email of this customer.';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format.';
//       }

//       return 'Please just input a string data.';
//     },
//   }),
//   image_url: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Must be select a image for it.';
//       }

//       return 'Please just select a image.';
//     },
//   }),
//   user_id: z.string(),
// });
 
// const InvoiceFormSchema = z.object({
//   id: z.string(),
//   customerId: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please select a customer.';
//       }

//       return 'Please just select a customer.';
//     }
//   }),
//   amount: z.coerce
//   .number()
//   .gt(0, {
//     error: 'Please enter an amount greater than $0.',
//   }),
//   status: z.enum(['pending', 'paid'], {
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please select an invoice status.';
//       }

//       return 'Invoice status must be pending or paid.';
//     },
//   }),
//   date: z.string(),
//   user_id: z.string(),
// });

// const DeleteCustomerSchema = z.object({
//   id: z.string(),
//   reid: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please re input Customer ID';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
// });

// const DeleteInvoiceSchema = z.object({
//   id: z.string(),
//   reid: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please re input Invoice ID';
//       }

//       return 'Please just input a string data.';
//     }
//   }),
// });

// const DeleteUserRequestFormSchema = z.object({
//   email: z.email({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the email of this user';
//       }

//       if (issue.code === 'invalid_format') {
//         return 'The string data must look like email format';
//       }

//       return 'Please just input a string data';
//     },
//   }),
// });

// const DeleteUserHandleFormSchema = z.object({
//   email: z.string(),
//   password: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) {
//         return 'Please input the password of this user';
//       }

//       return 'Please just input a string data';
//     }
//   }),
// });

// const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true});
// const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true });
// const CreateCustomer = CustomerFormSchema.omit({ id: true, user_id: true });
// const UpdateCustomer = CustomerFormSchema.omit({ id: true, user_id: true });
// const DeleteCustomer = DeleteCustomerSchema.omit({ id: true});
// const DeleteInvoice = DeleteInvoiceSchema.omit({ id: true });
// const DeleteUserRequest = DeleteUserRequestFormSchema.omit({});
// const DeleteUserHandle = DeleteUserHandleFormSchema.omit({ email: true});
// const VerifyUserRequest = VerifyUserRequestFormSchema.omit({});
// const CreateUserRequest = CreateUserRequestFormSchema.omit({});
// const CreateUserHandle = CreateUserHandleFormSchema.omit({ email: true});
// const ChangePass = ChangePassFormSchema.omit({});
// const ResetPassRequest = ResetPassRequestFormSchema.omit({});
// const ResetPassHandle = ResetPassHandleFormSchema.omit({ email: true});
// const ResetEmailRequest = ResetEmailRequestFormSchema.omit({});
// const ResetEmailHandle = ResetEmailHandleFormSchema.omit({ oldemail: true });
// const ChangeInfor = ChangeInforFormSchema.omit({});
// const ChangeMailFromRequest = ChangeMailFromRequestFormSchema.omit({});
// const ChangeMailToRequest = ChangeMailToRequestFormSchema.omit({ oldemail: true });
// const ChangeMailHandle = ChangeMailHandleFormSchema.omit({ oldemail: true });

// export type InvoiceState = {
//   errors?: {
//     customerId?: string[];
//     amount?: string[];
//     status?: string[];
//   };
//   message?: string | null;
// };

// export type CustomerState = {
//   errors?: {
//     name?: string[];
//     email?: string[];
//     image_url?: string[];
//   };
//   message?: string | null;
// };

// export type VerifyUserRequestState = {
//   errors?: {
//     email?: string[];
//   };
//   message?: string | null;
// };

// export type CreateUserRequestState = {
//   errors?: {
//     name?: string[];
//     email?: string[];
//     image?: string[];
//   };
//   message?: string | null;
// };

// export type CreateUserHandleState = {
//   errors?: {
//     password?: string[];
//     repassword?: string[];
//   };
//   message?: string | null;
// };

// export type ChangePassState = {
//   errors?: {
//     newpassword?: string[];
//     renewpassword?: string[];
//   };
//   message?: string | null;
// };

// export type ResetPassHandleState = {
//   errors?: {
//     newpassword?: string[];
//     renewpassword?: string[];
//   };
//   message?: string | null;
// };

// export type ResetPassRequestState = {
//   errors?: {
//     email?: string[];
//   };
//   message?: string | null;
// };

// export type ResetEmailHandleState = {
//   errors?: {
//     recoverycode?: string[];
//     password?: string[];
//   };
//   message?: string | null;
// };

// export type ResetEmailRequestState = {
//   errors?: {
//     oldemail?: string[];
//     newemail?: string[];
//   };
//   message?: string | null;
// };

// export type ChangeMailFromRequestState = {
//   errors?: {
//     email?: string[];
//   };
//   message?: string | null;
// };

// export type ChangeMailToRequestState = {
//   errors?: {
//     newemail?: string[];
//   };
//   message?: string | null;
// };

// export type ChangeMailHandleState = {
//   errors?: {
//     password?: string[];
//   };
//   message?: string | null;
// };

// export type ChangeInforState = {
//   errors?: {
//     name?: string[];
//     image?: string[];
//   };
//   message?: string | null;
// };

// export type DeleteCustomerState = {
//   errors?: {
//     reid?: string[];
//   };
//   message?: string | null;
// };

// export type DeleteInvoiceState = {
//   errors?: {
//     reid?: string[];
//   };
//   message?: string | null;
// };

// export type DeleteUserRequestState = {
//   errors?: {
//     email?: string[];
//   };
//   message?: string | null;
// };

// export type DeleteUserHandleState = {
//   errors?: {
//     password?: string[];
//   };
//   message?: string | null;
// };

// export async function resetTarget(target : string) {
//   revalidatePath(target);
//   redirect(target);
// }

// export async function resetSession(email: string, name : string, image : string, role : string) {
//   await unstable_update({ user: { email: email, name: name, image: image, role: role } })
// }

// export async function deleteDatabaseToken(id : string) {
//   const { error } = await supabase
//     .from('users')
//     .update({  
//       token: null, 
//       expires: null
//     })
//     .eq('id', id);
//   if (error){
//     throw error;
//   }
// }

// export async function createInvoice(prevState: InvoiceState, formData: FormData) {
//   // Validate form using Zod
//   const validatedFields = CreateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (validatedFields.success) {
//     // Prepare data for insertion into the database
//     const { customerId, amount, status } = validatedFields.data;
//     const amountInCents = amount * 100;
//     const date = new Date().toISOString().split('T')[0];
//     const userID = await getSessionID();
//     if (userID !== ''){
//       // Insert data into the database
//       const id = randomUUID();
//       const { error } = await supabase
//         .from('invoices')
//         .insert([
//           {
//             id: id,
//             customer_id: customerId,
//             amount: amountInCents,
//             status: status,
//             date: date,
//             user_id: userID,
//           },
//         ]);
//       // If a database error occurs, return a more specific error.
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Create Invoice. Reason: ' + error.message,
//         };
//       } else {
//         // Revalidate the cache for the invoices page and redirect the user.
//         revalidatePath('/dashboard/invoices');
//         redirect('/dashboard/invoices');
//       }

//     } else {
//       return {
//         message: 'Missing User ID. Failed to Create Invoice.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Invoice.',
//     };
//   }
// }

// export async function createCustomer(prevState: CustomerState, formData: FormData) {
//   // Validate form using Zod
//   const validatedFields = CreateCustomer.safeParse({
//     name: formData.get('name'),
//     email: formData.get('email'),
//     image_url: formData.get('image_url'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (validatedFields.success) {
//     // Prepare data for insertion into the database
//     const { name, email, image_url } = validatedFields.data;
//     const userID = await getSessionID();
//     if (userID !== ''){
//       // Insert data into the database
//       const id = randomUUID();
//       const { error } = await supabase
//         .from('customers')
//         .insert([
//           {
//             id: id,
//             name: name,
//             email: email,
//             image_url: image_url,
//             user_id: userID,
//           },
//         ]);
//       // If a database error occurs, return a more specific error.
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Create Customer. Reason: ' + error.message,
//         };
//       } else {
//         // Revalidate the cache for the customers page and redirect the user.
//         revalidatePath('/dashboard/customers');
//         redirect('/dashboard/customers');
//       }

//     } else {
//       return {
//         message: 'Missing User ID. Failed to Create Customer.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Customer.',
//     };
//   }
// }

// export async function createUserRequest(prevState: CreateUserRequestState, formData: FormData){
//   // Validate form using Zod
//   const validatedFields = CreateUserRequest.safeParse({
//     name: formData.get('name'),
//     email: formData.get('email'),
//     image: formData.get('image'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (validatedFields.success) {
//     // Prepare data for insertion into the database
//     const { 
//       name, 
//       email, 
//       image, 
//     } = validatedFields.data;
//     const user = await getUserByEmail(email);

//     if (user === undefined){

//       const id = randomUUID();
//       const token = randomUUID();
//       const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
//       // Insert data into the database
//       const { error } = await supabase
//         .from('users')
//         .insert([
//           {
//             id: id,
//             name: name,
//             email: email,
//             image: image,
//             status: 'logout',
//             email_verified: false,
//             token: token,
//             expires: expiresAt.toISOString(),
//             role: 'user',
//           },
//         ]);
        
//       // If a database error occurs, return a more specific error.
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Create User Request. Reason: ' + error.message,
//         };
//       } else {
//         await sendSignUpEmail(email, name, token, id);
//         redirect('/users/signupreponse');
//       }

//     } else {
//       return {
//         message: 'This email compare with email of an user in Database. Failed to Create User Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create User Request.',
//     };
//   }
// }

// export async function createUserHandle(email: string, prevState: CreateUserHandleState, formData: FormData){
//   // Validate form using Zod
//   const validatedFields = CreateUserHandle.safeParse({
//     password: formData.get('password'),
//     repassword: formData.get('repassword'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (validatedFields.success) {
//     // Prepare data for insertion into the database
//     const { 
//       password, 
//       repassword 
//     } = validatedFields.data;
//     const user = await getUserByEmail(email);

//     if (user !== undefined){
      
//       if (password === repassword){

//         const hashedPassword = bcrypt.hashSync(password, 12);
//         // Insert data into the database
//         const { error } = await supabase
//           .from('users')
//           .update({
//             email_verified: true,
//             password: hashedPassword,
//           })
//           .eq('id', user.id);
          
//         // If a database error occurs, return a more specific error.
//         if (error) {
//           return {
//             message: 'Database Error: Failed to Create User Handle. Reason: ' + error.message,
//           };
//         } else {
//           await deleteDatabaseToken(user.id);
//           redirect('users/signupcomplete');
//         }

//       } else {
//         return {
//           message: 'Password must be look like Re-Password. Failed to Create User Handle.',
//         };
//       }

//     } else {
//       return {
//         message: 'This email compare with email of an user in Database. Failed to Create User Handle.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create User Handle.',
//     };
//   }
// }

// export async function updateInvoice(
//   id: string,
//   prevState: InvoiceState,
//   formData: FormData,
// ) {
//   const validatedFields = UpdateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   if (validatedFields.success) {
//     const { customerId, amount, status } = validatedFields.data;
//     const amountInCents = amount * 100;
//     const date = new Date().toISOString().split('T')[0];
//     const userID = await getSessionID();
//     if (userID !== ''){
//       const { error } = await supabase
//         .from('invoices')
//         .update({
//           customer_id: customerId,
//           amount: amountInCents,
//           status: status,
//           date: date,
//           user_id: userID,
//         })
//         .eq('id', id);

//       if (error) {
//         return { 
//           message: 'Database Error: Failed to Update Invoice. Reason: ' + error.message 
//         };
//       } else {
//         revalidatePath('/dashboard/invoices');
//         redirect('/dashboard/invoices');
//       }

//     } else {
//       return {
//         message: 'Missing User ID. Failed to Update Invoice.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Invoice.',
//     };
//   }
// }

// export async function updateCustomer(
//   id: string,
//   prevState: CustomerState,
//   formData: FormData,
// ) {
//   const validatedFields = UpdateCustomer.safeParse({
//     name: formData.get('name'),
//     email: formData.get('email'),
//     image_url: formData.get('image_url'),
//   });

//   if (validatedFields.success) {
//     const { name, email, image_url } = validatedFields.data;
//     const userID = await getSessionID();
//     if (userID !== ''){
//       const { error } = await supabase
//         .from('customers')
//         .update({
//           name: name,
//           email: email,
//           image_url: image_url,
//           user_id: userID,
//         })
//         .eq('id', id);

//       if (error) {
//         return { 
//           message: 'Database Error: Failed to Update Customer. Reason: ' + error.message 
//         };
//       } else {
//         revalidatePath('/dashboard/customers');
//         redirect('/dashboard/customers');
//       }

//     } else {
//       return {
//         message: 'Missing User ID. Failed to Update Customer.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Customer.',
//     };
//   }
// }

// export async function changeUserInfor(prevState: ChangeInforState, formData: FormData){
  
//   const validatedFields = ChangeInfor.safeParse({
//     name: formData.get('name'),
//     image: formData.get('image'),
//   });

//   if (validatedFields.success) {
    
//     const { 
//       name, 
//       image,
//     } = validatedFields.data;
    
//     const id = await getSessionID();

//     if (id !== ''){

//       const userID = await getUserByID(id);

//       if (userID !== undefined){

//         const { error } = await supabase
//           .from('users')
//           .update({
//             name: name,
//             image: image,
//           })
//           .eq('id', userID.id);
        
//         if (error) {
//           return {
//             message: 'Database Error: Failed to Change Infor. Reason: ' + error.message,
//           };
//         } else {
//           await resetSession(userID.email, name, image, userID.role);
//           revalidatePath('/dashboard');
//           redirect('/dashboard');
//         }

//       } else {
//         return {
//           message: 'User of this id do not see in Database. Failed to Change Infor.',
//         };
//       }

//     } else {
//       return {
//         message: 'Do not see id in this request. Failed to Change Infor.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Change Infor.',
//     };
//   }
// }

// export async function changeUserPass(prevState: ChangePassState, formData: FormData){
  
//   const validatedFields = ChangePass.safeParse({
//     newpassword: formData.get('newpassword'),
//     renewpassword: formData.get('renewpassword'),
//   });

//   if (validatedFields.success) {
    
//     const { newpassword, renewpassword } = validatedFields.data;

//     if (newpassword === renewpassword){

//       const email = await getSessionEmail();

//       if (email !== ''){

//         const user = await getUserByEmail(email);

//         if (user !== undefined){

//           const passwordsMatch = bcrypt.compareSync(newpassword, user.password);

//           if (!passwordsMatch){

//             const hashedPassword = bcrypt.hashSync(newpassword, 12);

//             const { error } = await supabase
//               .from('users')
//               .update({
//                 password: hashedPassword,
//                 status: 'logout',
//               })
//               .eq('id', user.id);

//             if (error) {
//               return {
//                 message: 'Database Error: Failed to Change Password. Reason: ' + error.message,
//               };
//             } else {
//               return {
//                 message: 'Change Password Successful',
//               };
//             }

//           } else {
//             return {
//               message: 'New Password look like Old Password. Failed to Change Password.',
//             };
//           }
          
//         } else {
//           return {
//             message: 'User of this email do not see in Database. Failed to Change Password.',
//           };
//         }

//       } else {
//         return {
//           message: 'Do not see email in this request. Failed to Change Password.',
//         };
//       }

//     } else {
//       return {
//         message: 'New Password must be look like Re-New Password. Failed to Change Password.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Change Password.',
//     };
//   }
// }

// export async function changeMailFromRequest(prevState: ChangeMailFromRequestState, formData: FormData){
  
//   const validatedFields = ChangeMailFromRequest.safeParse({
//     email: formData.get('email'),
//   });

//   if (validatedFields.success) {
    
//     const { email } = validatedFields.data;
//     const user = await getUserByEmail(email);

//     if (user !== undefined){

//       const token = crypto.randomUUID();
//       const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
//       const { error } = await supabase
//         .from('users')
//         .update({
//           token: token,
//           expires: expiresAt.toISOString(),
//         }).eq('email', email);
      
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Change Mail From Request. Reason: ' + error.message,
//         };
//       } else {
//         await sendChangeMailFromEmail(email, user.name, token);
//         redirect('/users/changemailfromreponse');
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Change Mail From Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Change Mail From Request.',
//     };
//   }
// }

// export async function changeMailToRequest(oldemail: string, prevState: ChangeMailToRequestState, formData: FormData){
  
//   const validatedFields = ChangeMailToRequest.safeParse({
//     newemail: formData.get('newemail'),
//   });

//   if (validatedFields.success) {
    
//     const { newemail } = validatedFields.data;

//     if (newemail !== oldemail){

//       const newUser = await getUserByEmail(newemail);

//       if (newUser === undefined){

//         const oldUser = await getUserByEmail(oldemail);

//         if (oldUser !== undefined){

//           const token = crypto.randomUUID();
//           const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
//           const { error } = await supabase
//             .from('users')
//             .update({
//               new_email: newemail,
//               token: token,
//               expires: expiresAt.toISOString(),
//             }).eq('email', oldemail);
          
//           if (error) {
//             return {
//               message: 'Database Error: Failed to Change Mail To Request. Reason: ' + error.message,
//             };
//           } else {
//             await sendChangeMailToEmail(newemail, oldUser.name, token);
//             redirect('/users/changemailtoreponse');
//           }

//         } else {
//           return {
//             message: 'User of this old email do not see in Database. Failed to Change Mail To Request.',
//           };
//         }
        
//       } else {
//         return {
//           message: 'This new email compare with email of an user in Database. Failed to Change Mail To Request.',
//         };
//       }

//     } else {
//       return {
//         message: 'New email must be not compare with old email. Failed to Change Mail To Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Change Mail To Request.',
//     };
//   }
// }

// export async function changeMailHandle(oldemail: string, prevState: ChangeMailHandleState, formData: FormData){

//   const validatedFields = ChangeMailHandle.safeParse({
//     password: formData.get('password'),
//   });
  
//   if (validatedFields.success) {
    
//     const { password } = validatedFields.data;

//     const user = await getUserByEmail(oldemail);
      
//     if (user !== undefined){

//       const passwordsMatch = bcrypt.compareSync(password, user.password);

//       if (passwordsMatch){

//         const { error } = await supabase
//           .from('users')
//           .update({
//             new_email: null,
//             email: user.new_email,
//           }).eq('new_email', user.new_email);
          
//         if (error) {
//           return {
//             message: 'Database Error: Failed to Change Mail Handle. Reason: ' + error.message,
//           };
//         } else {
//           await deleteDatabaseToken(user.id);
//           redirect('/users/changemailcomplete');
//         }

//       } else {
//         return {
//           message: 'Input Wrong Password of this account. Failed to Change Mail Handle.',
//         };
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Change Mail Handle.',
//       };
//     }
    
//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Change Mail Handle.',
//     };
//   }
// }

// export async function resetPassRequest(prevState: ResetPassRequestState, formData: FormData){
  
//   const validatedFields = ResetPassRequest.safeParse({
//     email: formData.get('email'),
//   });

//   if (validatedFields.success) {
    
//     const { email } = validatedFields.data;
//     const user = await getUserByEmail(email);

//     if (user !== undefined){

//       const token = crypto.randomUUID();
//       const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
//       const { error } = await supabase
//         .from('users')
//         .update({
//           token: token,
//           expires: expiresAt.toISOString(),
//         }).eq('email', email);
      
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Reset Password Request. Reason: ' + error.message,
//         };
//       } else {
//         await sendResetPasswordEmail(email, user.name, token);
//         redirect('/users/resetpassreponse');
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Reset Password Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Reset Password Request.',
//     };
//   }
// }

// export async function resetPassHandle(email: string, prevState: ResetPassHandleState, formData: FormData){
  
//   const validatedFields = ResetPassHandle.safeParse({
//     newpassword: formData.get('newpassword'),
//     renewpassword: formData.get('renewpassword'),
//   });
  
//   if (validatedFields.success) {
    
//     const { newpassword, renewpassword } = validatedFields.data;
    
//     if (newpassword === renewpassword){
      
//       const user = await getUserByEmail(email);
      
//       if (user !== undefined){

//         const passwordsMatch = bcrypt.compareSync(newpassword, user.password);

//         if (!passwordsMatch){

//           const hashedPassword = bcrypt.hashSync(newpassword, 12);

//           const { error } = await supabase
//             .from('users')
//             .update({
//               password: hashedPassword,
//               status: 'logout',
//             })
//             .eq('id', user.id);
            
//           if (error) {
//             return {
//               message: 'Database Error: Failed to Reset Password Handle. Reason: ' + error.message,
//             };
//           } else {
//             await deleteDatabaseToken(user.id);
//             redirect('/users/resetpasscomplete');
//           }

//         } else {
//           return {
//             message: 'New Password look like Old Password. Failed to Reset Password Handle.',
//           };
//         }
        
//       } else {
//         return {
//           message: 'User of this email do not see in Database. Failed to Reset Password Handle.',
//         };
//       }

//     } else {
//       return {
//         message: 'New Password must be look like Re-New Password. Failed to Reset Password Handle.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Reset Password Handle.',
//     };
//   }
// }

// export async function resetEmailRequest(prevState: ResetEmailRequestState, formData: FormData){

//   const validatedFields = ResetEmailRequest.safeParse({
//     oldemail: formData.get('oldemail'),
//     newemail: formData.get('newemail'),
//   });

//   if (validatedFields.success) {
    
//     const { newemail, oldemail } = validatedFields.data;
//     const user = await getUserByEmail(oldemail)

//     if (user !== undefined){

//       const token = crypto.randomUUID();
//       const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
//       const { error } = await supabase
//         .from('users')
//         .update({
//           new_email: newemail,
//           token: token,
//           expires: expiresAt.toISOString(),
//         }).eq('email', user.email);
      
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Reset Email Address Request. Reason: ' + error.message,
//         };
//       } else {
//         await sendResetEmailAddressEmail(newemail, user.name, token);
//         redirect('/users/resetemailreponse');
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Email Address Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Reset Email Address Request.',
//     };
//   }
// }

// export async function resetEmailHandle(oldemail: string, prevState: ResetEmailHandleState, formData: FormData){

//   const validatedFields = ResetEmailHandle.safeParse({
//     recoverycode: formData.get('recoverycode'),
//     password: formData.get('password'),
//   });
  
//   if (validatedFields.success) {
    
//     const { password, recoverycode } = validatedFields.data;

//     const user = await getUserByEmail(oldemail);
      
//     if (user !== undefined){

//       if (user.id === recoverycode){

//         const passwordsMatch = bcrypt.compareSync(password, user.password);

//         if (passwordsMatch){

//           const { error } = await supabase
//             .from('users')
//             .update({
//               new_email: null,
//               email: user.new_email,
//             }).eq('new_email', user.new_email);
            
//           if (error) {
//             return {
//               message: 'Database Error: Failed to Reset Email Handle. Reason: ' + error.message,
//             };
//           } else {
//             await deleteDatabaseToken(user.id);
//             redirect('/users/resetemailcomplete');
//           }

//         } else {
//           return {
//             message: 'Input Wrong Password of this account. Failed to Reset Email Handle.',
//           };
//         }

//       } else {
//         return {
//           message: 'Input Wrong Recovery Code of this account. Failed to Reset Email Handle.',
//         };
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Reset Email Handle.',
//       };
//     }
    
//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Reset Email Handle.',
//     };
//   }
// }

// export async function deleteUserRequest(prevState: DeleteUserRequestState, formData: FormData){
  
//   const validatedFields = DeleteUserRequest.safeParse({
//     email: formData.get('email'),
//   });

//   if (validatedFields.success) {
    
//     const { email } = validatedFields.data;
//     const user = await getUserByEmail(email);

//     if (user !== undefined){

//       const token = crypto.randomUUID();
//       const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
//       const { error } = await supabase
//         .from('users')
//         .update({
//           token: token,
//           expires: expiresAt.toISOString(),
//         }).eq('email', email);
      
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Sign Down Request. Reason: ' + error.message,
//         };
//       } else {
//         await sendSignDownEmail(user.email, user.name, token);
//         redirect('/users/signdownreponse');
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Sign Down Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Sign Down Request.',
//     };
//   }
// }

// export async function deleteUserHandle(email: string, prevState: DeleteUserHandleState, formData: FormData){
  
//   const validatedFields = DeleteUserHandle.safeParse({
//     password: formData.get('password'),
//   });
  
//   if (validatedFields.success) {
    
//     const { password } = validatedFields.data;

//     const user = await getUserByEmail(email);
      
//     if (user !== undefined){
//       const passwordsMatch = bcrypt.compareSync(password, user.password);

//       if (passwordsMatch){

//         const { error } = await supabase
//           .from('users')
//           .delete()
//           .eq('id', user.id);
          
//         if (error) {
//           return {
//             message: 'Database Error: Failed to Sign Down Handle. Reason: ' + error.message,
//           };
//         } else {
//           await deleteDatabaseToken(user.id);
//           redirect('/users/signdowncomplete');
//         }

//       } else {
//         return {
//           message: 'Input Wrong Password of this account. Failed to Sign Down Handle.',
//         };
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Sign Down Handle.',
//       };
//     }
    
//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Sign Down Handle.',
//     };
//   }
// }

// export async function deleteInvoice(
//   id: string,
//   prevState: DeleteInvoiceState,
//   formData: FormData,
// ) {
//   const validatedFields = DeleteInvoice.safeParse({
//     reid: formData.get('reid')
//   });
//   if (validatedFields.success) {
//     const { reid } = validatedFields.data;
//     const userID = await getSessionID();
//     if (userID !== ''){

//       if (id === reid) {

//         const { error } = await supabase
//           .from('invoices')
//           .delete()
//           .eq('id', id);
        
//         if (error) {
//           return { 
//             message: 'Database Error: Failed to Delete Invoice. Reason: ' + error.message 
//           };
//         } else {
//           revalidatePath('/dashboard/invoices');
//           redirect('/dashboard/invoices');
//         }
        
//       } else {
//         return {
//           message: 'Please just copy Invoice ID and paste to Re input ID. Failed to Delete Invoice.',
//         };
//       }

//     } else {
//       return {
//         message: 'Missing User ID. Failed to Delete Invoice.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Delete Invoice.',
//     };
//   }
// }

// export async function deleteCustomer(
//   id: string,
//   prevState: DeleteCustomerState,
//   formData: FormData,
// ) {
//   const validatedFields = DeleteCustomer.safeParse({
//     reid: formData.get('reid')
//   });
//   if (validatedFields.success) {
//     const { reid } = validatedFields.data;
//     const userID = await getSessionID();
//     if (userID !== ''){
//       if (id === reid) {
//         const { error } = await supabase
//             .from('customers')
//             .delete()
//             .eq('id', id);
//         if (error) {
//           return { 
//             message: 'Database Error: Failed to Delete Customer. Reason: ' + error.message 
//           };
//         } else {
//           revalidatePath('/dashboard/customers');
//           redirect('/dashboard/customers');
//         }

//       } else {
//         return {
//           message: 'Please just copy Customer ID and paste to Re input ID. Failed to Delete Customer.',
//         };
//       }

//     } else {
//       return {
//         message: 'Missing User ID. Failed to Delete Customer.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Delete Customer.',
//     };
//   }
// }

// export async function verifyUserRequest(prevState: VerifyUserRequestState, formData: FormData){
  
//   const validatedFields = VerifyUserRequest.safeParse({
//     email: formData.get('email'),
//   });

//   if (validatedFields.success) {
    
//     const { email } = validatedFields.data;
//     const redirectTarget = formData.get('redirectTo') as string || '';
//     const user = await getUserByEmail(email);

//     if (user !== undefined){

//       const token = crypto.randomUUID();
//       const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
//       const { error } = await supabase
//         .from('users')
//         .update({
//           token: token,
//           expires: expiresAt.toISOString(),
//         }).eq('email', email);
      
//       if (error) {
//         return {
//           message: 'Database Error: Failed to Verify User Request. Reason: ' + error.message,
//         };
//       } else {
//         await sendSignInEmail(email, user.name, token, redirectTarget);
//         redirect('/users/signinreponse');
//       }
      
//     } else {
//       return {
//         message: 'User of this email do not see in Database. Failed to Verify User Request.',
//       };
//     }

//   } else {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Verify User Request.',
//     };
//   }
// }

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           console.error('Invalid credentials.');
//           return 'Invalid credentials.';
//         case 'AccessDenied':
//           console.error('You have entered too many incorrect attempts. Please try again in 5 minutes.');
//           return 'You have entered too many incorrect attempts. Please try again in 5 minutes.';
//         case 'EmailSignInError':
//           console.error('You need to verify your email before logging in.');
//           return 'You need to verify your email before logging in.';
//         default:
//           console.error('Something went wrong.');
//           return 'Something went wrong.';
//       }
//     } else if (error instanceof PostgrestError) {
//       console.error(error.message);
//       return error.message;
//     } else {
//       throw error;
//     }
//   }
// }

// export async function GoogleSignIn(){
//   await signIn('google');
// }

// export async function GithubSignIn(){
//   await signIn('github');
// }

// async function changeUserStatusLogout() {
//   try {
//     const email = await getSessionEmail();
//     if (email !== ''){
//       const user = await getUserByEmail(email);
//       if (user !== undefined){
//         const { error } = await supabase
//           .from('users')
//           .update({
//             status: 'logout',
//           })
//           .eq('email', email)
          
//         if (error) {
//           throw error;
//         } else {
//           return;
//         }
//       } else {
//         return;
//       }
//     } else {
//       console.error('Failed to fetch session email.');
//       throw new Error("Failed to fetch session email.");
//     }
//   } catch (error : any) {
//     console.error('Failed to fix user logout. Reason: ', error.message);
//     throw new Error('Failed to fix user logout. Reason: ' + error.message);
//   }
// }

// export async function logOut() {
//   await changeUserStatusLogout();
//   await signOut({});
// }

// export async function LogOut() {
//   await signOut({});
// }