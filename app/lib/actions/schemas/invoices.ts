import { z } from 'zod';

const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please select a customer.';
      }

      return 'Please just select a customer.';
    }
  }),
  amount: z.coerce
  .number()
  .gt(0, {
    error: 'Please enter an amount greater than $0.',
  }),
  status: z.enum(['pending', 'paid'], {
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please select an invoice status.';
      }

      return 'Invoice status must be pending or paid.';
    },
  }),
  date: z.string(),
  user_id: z.string(),
});

const DeleteInvoiceSchema = z.object({
  id: z.string(),
  reid: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Please re input Invoice ID';
      }

      return 'Please just input a string data.';
    }
  }),
});

export const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true});
export const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true, user_id: true });
export const DeleteInvoice = DeleteInvoiceSchema.omit({ id: true });