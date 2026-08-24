'use server';

import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/app/lib/data/users';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import { randomUUID } from 'crypto';
import { 
  sendResetPasswordEmail,
  sendResetEmailAddressEmail,
  sendSignInEmail,
  sendSignUpEmail, 
  sendSignDownEmail,
  sendChangeMailToEmail,
  sendChangeMailFromEmail,
} from '@/app/lib/mailer';
import {
  CreateUserRequestState,
  CreateUserHandleState,
  ChangeMailFromRequestState,
  ChangeMailToRequestState,
  ChangeMailHandleState,
  ResetPassRequestState,
  ResetPassHandleState,
  ResetEmailRequestState,
  ResetEmailHandleState,
  DeleteUserRequestState,
  DeleteUserHandleState,
  VerifyUserRequestState,
} from '@/app/lib/action/types/users';
import {
  CreateUserRequest,
  CreateUserHandle,
  ChangeMailFromRequest,
  ChangeMailToRequest,
  ChangeMailHandle,
  ResetPassRequest,
  ResetPassHandle,
  ResetEmailRequest,
  ResetEmailHandle,
  DeleteUserRequest,
  DeleteUserHandle,
  VerifyUserRequest,
} from '@/app/lib/action/schemas/users';

export async function deleteDatabaseToken(id : string) {
  const { error } = await supabase
    .from('users')
    .update({  
      token: null, 
      expires: null
    })
    .eq('id', id);
  if (error){
    throw error;
  }
}

export async function verifyUserRequest(prevState: VerifyUserRequestState, formData: FormData){
  
  const validatedFields = VerifyUserRequest.safeParse({
    email: formData.get('email'),
  });

  if (validatedFields.success) {
    
    const { email } = validatedFields.data;
    const redirectTarget = formData.get('redirectTo') as string || '';
    const user = await getUserByEmail(email);

    if (user !== undefined){

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
      const { error } = await supabase
        .from('users')
        .update({
          token: token,
          expires: expiresAt.toISOString(),
        }).eq('email', email);
      
      if (error) {
        return {
          message: 'Database Error: Failed to Verify User Request. Reason: ' + error.message,
        };
      } else {
        await sendSignInEmail(email, user.name, token, redirectTarget);
        redirect('/users/signinreponse');
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Verify User Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Verify User Request.',
    };
  }
}

export async function createUserRequest(prevState: CreateUserRequestState, formData: FormData){
  // Validate form using Zod
  const validatedFields = CreateUserRequest.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image: formData.get('image'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success) {
    // Prepare data for insertion into the database
    const { 
      name, 
      email, 
      image, 
    } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user === undefined){

      const id = randomUUID();
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      // Insert data into the database
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: id,
            name: name,
            email: email,
            image: image,
            status: 'logout',
            email_verified: false,
            token: token,
            expires: expiresAt.toISOString(),
            role: 'user',
          },
        ]);
        
      // If a database error occurs, return a more specific error.
      if (error) {
        return {
          message: 'Database Error: Failed to Create User Request. Reason: ' + error.message,
        };
      } else {
        await sendSignUpEmail(email, name, token, id);
        redirect('/users/signupreponse');
      }

    } else {
      return {
        message: 'This email compare with email of an user in Database. Failed to Create User Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User Request.',
    };
  }
}

export async function createUserHandle(email: string, prevState: CreateUserHandleState, formData: FormData){
  // Validate form using Zod
  const validatedFields = CreateUserHandle.safeParse({
    password: formData.get('password'),
    repassword: formData.get('repassword'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success) {
    // Prepare data for insertion into the database
    const { 
      password, 
      repassword 
    } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user !== undefined){
      
      if (password === repassword){

        const hashedPassword = bcrypt.hashSync(password, 12);
        // Insert data into the database
        const { error } = await supabase
          .from('users')
          .update({
            email_verified: true,
            password: hashedPassword,
          })
          .eq('id', user.id);
          
        // If a database error occurs, return a more specific error.
        if (error) {
          return {
            message: 'Database Error: Failed to Create User Handle. Reason: ' + error.message,
          };
        } else {
          await deleteDatabaseToken(user.id);
          redirect('users/signupcomplete');
        }

      } else {
        return {
          message: 'Password must be look like Re-Password. Failed to Create User Handle.',
        };
      }

    } else {
      return {
        message: 'This email compare with email of an user in Database. Failed to Create User Handle.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User Handle.',
    };
  }
}

export async function changeMailFromRequest(prevState: ChangeMailFromRequestState, formData: FormData){
  
  const validatedFields = ChangeMailFromRequest.safeParse({
    email: formData.get('email'),
  });

  if (validatedFields.success) {
    
    const { email } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user !== undefined){

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
      const { error } = await supabase
        .from('users')
        .update({
          token: token,
          expires: expiresAt.toISOString(),
        }).eq('email', email);
      
      if (error) {
        return {
          message: 'Database Error: Failed to Change Mail From Request. Reason: ' + error.message,
        };
      } else {
        await sendChangeMailFromEmail(email, user.name, token);
        redirect('/users/changemailfromreponse');
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Change Mail From Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Change Mail From Request.',
    };
  }
}

export async function changeMailToRequest(oldemail: string, prevState: ChangeMailToRequestState, formData: FormData){
  
  const validatedFields = ChangeMailToRequest.safeParse({
    newemail: formData.get('newemail'),
  });

  if (validatedFields.success) {
    
    const { newemail } = validatedFields.data;

    if (newemail !== oldemail){

      const newUser = await getUserByEmail(newemail);

      if (newUser === undefined){

        const oldUser = await getUserByEmail(oldemail);

        if (oldUser !== undefined){

          const token = crypto.randomUUID();
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
          const { error } = await supabase
            .from('users')
            .update({
              new_email: newemail,
              token: token,
              expires: expiresAt.toISOString(),
            }).eq('email', oldemail);
          
          if (error) {
            return {
              message: 'Database Error: Failed to Change Mail To Request. Reason: ' + error.message,
            };
          } else {
            await sendChangeMailToEmail(newemail, oldUser.name, token);
            redirect('/users/changemailtoreponse');
          }

        } else {
          return {
            message: 'User of this old email do not see in Database. Failed to Change Mail To Request.',
          };
        }
        
      } else {
        return {
          message: 'This new email compare with email of an user in Database. Failed to Change Mail To Request.',
        };
      }

    } else {
      return {
        message: 'New email must be not compare with old email. Failed to Change Mail To Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Change Mail To Request.',
    };
  }
}

export async function changeMailHandle(oldemail: string, prevState: ChangeMailHandleState, formData: FormData){

  const validatedFields = ChangeMailHandle.safeParse({
    password: formData.get('password'),
  });
  
  if (validatedFields.success) {
    
    const { password } = validatedFields.data;

    const user = await getUserByEmail(oldemail);
      
    if (user !== undefined){

      const passwordsMatch = bcrypt.compareSync(password, user.password);

      if (passwordsMatch){

        const { error } = await supabase
          .from('users')
          .update({
            new_email: null,
            email: user.new_email,
          }).eq('new_email', user.new_email);
          
        if (error) {
          return {
            message: 'Database Error: Failed to Change Mail Handle. Reason: ' + error.message,
          };
        } else {
          await deleteDatabaseToken(user.id);
          redirect('/users/changemailcomplete');
        }

      } else {
        return {
          message: 'Input Wrong Password of this account. Failed to Change Mail Handle.',
        };
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Change Mail Handle.',
      };
    }
    
  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Change Mail Handle.',
    };
  }
}

export async function resetPassRequest(prevState: ResetPassRequestState, formData: FormData){
  
  const validatedFields = ResetPassRequest.safeParse({
    email: formData.get('email'),
  });

  if (validatedFields.success) {
    
    const { email } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user !== undefined){

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
      const { error } = await supabase
        .from('users')
        .update({
          token: token,
          expires: expiresAt.toISOString(),
        }).eq('email', email);
      
      if (error) {
        return {
          message: 'Database Error: Failed to Reset Password Request. Reason: ' + error.message,
        };
      } else {
        await sendResetPasswordEmail(email, user.name, token);
        redirect('/users/resetpassreponse');
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Reset Password Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Reset Password Request.',
    };
  }
}

export async function resetPassHandle(email: string, prevState: ResetPassHandleState, formData: FormData){
  
  const validatedFields = ResetPassHandle.safeParse({
    newpassword: formData.get('newpassword'),
    renewpassword: formData.get('renewpassword'),
  });
  
  if (validatedFields.success) {
    
    const { newpassword, renewpassword } = validatedFields.data;
    
    if (newpassword === renewpassword){
      
      const user = await getUserByEmail(email);
      
      if (user !== undefined){

        const passwordsMatch = bcrypt.compareSync(newpassword, user.password);

        if (!passwordsMatch){

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
              message: 'Database Error: Failed to Reset Password Handle. Reason: ' + error.message,
            };
          } else {
            await deleteDatabaseToken(user.id);
            redirect('/users/resetpasscomplete');
          }

        } else {
          return {
            message: 'New Password look like Old Password. Failed to Reset Password Handle.',
          };
        }
        
      } else {
        return {
          message: 'User of this email do not see in Database. Failed to Reset Password Handle.',
        };
      }

    } else {
      return {
        message: 'New Password must be look like Re-New Password. Failed to Reset Password Handle.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Reset Password Handle.',
    };
  }
}

export async function resetEmailRequest(prevState: ResetEmailRequestState, formData: FormData){

  const validatedFields = ResetEmailRequest.safeParse({
    oldemail: formData.get('oldemail'),
    newemail: formData.get('newemail'),
  });

  if (validatedFields.success) {
    
    const { newemail, oldemail } = validatedFields.data;
    const user = await getUserByEmail(oldemail)

    if (user !== undefined){

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
      const { error } = await supabase
        .from('users')
        .update({
          new_email: newemail,
          token: token,
          expires: expiresAt.toISOString(),
        }).eq('email', user.email);
      
      if (error) {
        return {
          message: 'Database Error: Failed to Reset Email Address Request. Reason: ' + error.message,
        };
      } else {
        await sendResetEmailAddressEmail(newemail, user.name, token);
        redirect('/users/resetemailreponse');
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Email Address Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Reset Email Address Request.',
    };
  }
}

export async function resetEmailHandle(oldemail: string, prevState: ResetEmailHandleState, formData: FormData){

  const validatedFields = ResetEmailHandle.safeParse({
    recoverycode: formData.get('recoverycode'),
    password: formData.get('password'),
  });
  
  if (validatedFields.success) {
    
    const { password, recoverycode } = validatedFields.data;

    const user = await getUserByEmail(oldemail);
      
    if (user !== undefined){

      if (user.id === recoverycode){

        const passwordsMatch = bcrypt.compareSync(password, user.password);

        if (passwordsMatch){

          const { error } = await supabase
            .from('users')
            .update({
              new_email: null,
              email: user.new_email,
            }).eq('new_email', user.new_email);
            
          if (error) {
            return {
              message: 'Database Error: Failed to Reset Email Handle. Reason: ' + error.message,
            };
          } else {
            await deleteDatabaseToken(user.id);
            redirect('/users/resetemailcomplete');
          }

        } else {
          return {
            message: 'Input Wrong Password of this account. Failed to Reset Email Handle.',
          };
        }

      } else {
        return {
          message: 'Input Wrong Recovery Code of this account. Failed to Reset Email Handle.',
        };
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Reset Email Handle.',
      };
    }
    
  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Reset Email Handle.',
    };
  }
}

export async function deleteUserRequest(prevState: DeleteUserRequestState, formData: FormData){
  
  const validatedFields = DeleteUserRequest.safeParse({
    email: formData.get('email'),
  });

  if (validatedFields.success) {
    
    const { email } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (user !== undefined){

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      const { error } = await supabase
        .from('users')
        .update({
          token: token,
          expires: expiresAt.toISOString(),
        }).eq('email', email);
      
      if (error) {
        return {
          message: 'Database Error: Failed to Sign Down Request. Reason: ' + error.message,
        };
      } else {
        await sendSignDownEmail(user.email, user.name, token);
        redirect('/users/signdownreponse');
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Sign Down Request.',
      };
    }

  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Sign Down Request.',
    };
  }
}

export async function deleteUserHandle(email: string, prevState: DeleteUserHandleState, formData: FormData){
  
  const validatedFields = DeleteUserHandle.safeParse({
    password: formData.get('password'),
  });
  
  if (validatedFields.success) {
    
    const { password } = validatedFields.data;

    const user = await getUserByEmail(email);
      
    if (user !== undefined){
      const passwordsMatch = bcrypt.compareSync(password, user.password);

      if (passwordsMatch){

        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
          
        if (error) {
          return {
            message: 'Database Error: Failed to Sign Down Handle. Reason: ' + error.message,
          };
        } else {
          await deleteDatabaseToken(user.id);
          redirect('/users/signdowncomplete');
        }

      } else {
        return {
          message: 'Input Wrong Password of this account. Failed to Sign Down Handle.',
        };
      }
      
    } else {
      return {
        message: 'User of this email do not see in Database. Failed to Sign Down Handle.',
      };
    }
    
  } else {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Sign Down Handle.',
    };
  }
}