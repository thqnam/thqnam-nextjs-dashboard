export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: string;
  image: string;
  last_failed_at: string;
  token: string;
  expires: string;
  new_email: string;
  failed_attempts: number;
  email_verified: boolean;
  role: 'admin' | 'user' ;
};