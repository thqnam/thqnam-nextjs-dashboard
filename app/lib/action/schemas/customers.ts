'use server';

import { z } from 'zod';

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the name of this customer.';
      }

      return 'Please just input a string data.';
    }
  }),
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please input the email of this customer.';
      }

      if (issue.code === 'invalid_format') {
        return 'The string data must look like email format.';
      }

      return 'Please just input a string data.';
    },
  }),
  image_url: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Must be select a image for it.';
      }

      return 'Please just select a image.';
    },
  }),
  user_id: z.string(),
});

const DeleteCustomerSchema = z.object({
  id: z.string(),
  reid: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please re input Customer ID';
      }

      return 'Please just input a string data.';
    }
  }),
});

export const CreateCustomer = CustomerFormSchema.omit({ id: true, user_id: true });
export const UpdateCustomer = CustomerFormSchema.omit({ id: true, user_id: true });
export const DeleteCustomer = DeleteCustomerSchema.omit({ id: true});