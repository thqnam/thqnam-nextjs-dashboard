'use server';

export type VerifyUserRequestState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type CreateUserRequestState = {
  errors?: {
    name?: string[];
    email?: string[];
    image?: string[];
  };
  message?: string | null;
};

export type CreateUserHandleState = {
  errors?: {
    password?: string[];
    repassword?: string[];
  };
  message?: string | null;
};

export type ResetPassHandleState = {
  errors?: {
    newpassword?: string[];
    renewpassword?: string[];
  };
  message?: string | null;
};

export type ResetPassRequestState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type ResetEmailHandleState = {
  errors?: {
    recoverycode?: string[];
    password?: string[];
  };
  message?: string | null;
};

export type ResetEmailRequestState = {
  errors?: {
    oldemail?: string[];
    newemail?: string[];
  };
  message?: string | null;
};

export type ChangeMailFromRequestState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type ChangeMailToRequestState = {
  errors?: {
    newemail?: string[];
  };
  message?: string | null;
};

export type ChangeMailHandleState = {
  errors?: {
    password?: string[];
  };
  message?: string | null;
};

export type DeleteUserRequestState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type DeleteUserHandleState = {
  errors?: {
    password?: string[];
  };
  message?: string | null;
};