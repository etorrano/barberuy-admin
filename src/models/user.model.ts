export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  STAFF = "STAFF",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}
