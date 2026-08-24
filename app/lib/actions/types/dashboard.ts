export type ChangePassState = {
  errors?: {
    newpassword?: string[];
    renewpassword?: string[];
  };
  message?: string | null;
};

export type ChangeInforState = {
  errors?: {
    name?: string[];
    image?: string[];
  };
  message?: string | null;
};