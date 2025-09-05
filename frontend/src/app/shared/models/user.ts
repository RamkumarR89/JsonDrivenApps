export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  displayName?: string;
  mobile?: number;
  password?: string;
  confirmpassword?: string;
  isactive?: boolean;
  islocked?: boolean;
  createdBy?: string;
  createdOn?: Date;
  updatedBy?: string;
  updatedOn?: Date;
}
