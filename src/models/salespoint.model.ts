import { StaffService } from "./service.model";
import { Admin, Staff } from "./user.model";
import { Workshift } from "./workshift.model";

export interface CreateSalesPointPayload {
  name: string;
  street: string;
  streetNumber: string;
  floor?: string;
  companyId: number;
}

export type SalesPoint = {
  id: string;
  name: string;
  street: string;
  streetNumber: string;
  floor?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  admins?: Admin[];
  staff?: Staff[];
  staffServices?: StaffService[];
  workshifts?: Workshift[];
};
