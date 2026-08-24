export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export type DeleteCustomerState = {
  errors?: {
    reid?: string[];
  };
  message?: string | null;
};