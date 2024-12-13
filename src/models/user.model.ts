import { SalesPoint } from "./salespoint.model";
import { Workshift } from "./workshift.model";

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
  salesPoints?: SalesPoint[];
  workshifts?: Workshift[];
  createdAt: string;
  updatedAt: string;
};

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface UserRelation {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  userEmail: string;
  userName: string;
}

export interface Admin extends UserRelation {}
export interface Staff extends UserRelation {}
export interface Client extends UserRelation {}
