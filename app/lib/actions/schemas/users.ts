import { z } from 'zod';

const VerifyUserRequestFormSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const CreateUserRequestFormSchema = z.object({
  name: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the name of this user.';
      }

      return 'Please just input a string data.';
    },
  }),
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
  image: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Must be select a image for it.';
      }

      return 'Please just select a image.';
    },
  }),
});

const CreateUserHandleFormSchema = z.object({
  email: z.string(),
  password: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the password of this user.';
      }

      return 'Please just input a string data.';
    },
  }),
  repassword: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the re-password of this user.';
      }

      return 'Please just input a string data.';
    }
  }),
});

const ResetPassHandleFormSchema = z.object({
  email: z.string(),
  newpassword: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the new password of this user.';
      }

      return 'Please just input a string data.';
    }
  }),
  renewpassword: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the re-new password of this user.';
      }

      return 'Please just input a string data.';
    }
  }),
});

const ResetPassRequestFormSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const ResetEmailHandleFormSchema = z.object({
  oldemail: z.string(),
  recoverycode: z.uuid({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the recovery code of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like UUID format.';
      }

      return 'Please just input a string data.';
    },
  }),
  password: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the password of this user.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const ResetEmailRequestFormSchema = z.object({
  oldemail: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the old email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
  newemail: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the new email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const ChangeMailFromRequestFormSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const ChangeMailToRequestFormSchema = z.object({
  oldemail: z.string(),
  newemail: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the new email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const ChangeMailHandleFormSchema = z.object({
  oldemail: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the old email of this user.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
  password: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the password of this user.';
      }

      return 'Please just input a string data.';
    },
  }),
});

const DeleteUserRequestFormSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the email of this user';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format';
      }

      return 'Please just input a string data';
    },
  }),
});

const DeleteUserHandleFormSchema = z.object({
  email: z.string(),
  password: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the password of this user';
      }

      return 'Please just input a string data';
    }
  }),
});

export const DeleteUserRequest = DeleteUserRequestFormSchema.omit({});
export const DeleteUserHandle = DeleteUserHandleFormSchema.omit({ email: true});
export const VerifyUserRequest = VerifyUserRequestFormSchema.omit({});
export const CreateUserRequest = CreateUserRequestFormSchema.omit({});
export const CreateUserHandle = CreateUserHandleFormSchema.omit({ email: true});
export const ResetPassRequest = ResetPassRequestFormSchema.omit({});
export const ResetPassHandle = ResetPassHandleFormSchema.omit({ email: true});
export const ResetEmailRequest = ResetEmailRequestFormSchema.omit({});
export const ResetEmailHandle = ResetEmailHandleFormSchema.omit({ oldemail: true });
export const ChangeMailFromRequest = ChangeMailFromRequestFormSchema.omit({});
export const ChangeMailToRequest = ChangeMailToRequestFormSchema.omit({ oldemail: true });
export const ChangeMailHandle = ChangeMailHandleFormSchema.omit({ oldemail: true });