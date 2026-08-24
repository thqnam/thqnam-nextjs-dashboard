'use server';

import { z } from 'zod';

const ChangePassFormSchema = z.object({
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

const ChangeInforFormSchema = z.object({
  name: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the name of this user.';
      }

      return 'Please just input a string data.';
    }
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

export const ChangePass = ChangePassFormSchema.omit({});
export const ChangeInfor = ChangeInforFormSchema.omit({});