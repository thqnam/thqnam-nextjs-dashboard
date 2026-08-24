export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type ImageField = {
  id: string;
  name: string;
  path: string;
};

export type CustomerForm = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};