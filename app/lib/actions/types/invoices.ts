export type InvoiceState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type DeleteInvoiceState = {
  errors?: {
    reid?: string[];
  };
  message?: string | null;
};