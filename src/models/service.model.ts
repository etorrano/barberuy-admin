import { Promotion } from "./promotion.model";
import { SalesPoint } from "./salespoint.model";

export interface StaffService {
  id: string;
  staffId: number;
  staffEmail: string;
  staffName: string;
  serviceId: number;
  serviceName: string;
  scheduleId: number;
}

export interface Service {
  id: string;
  key: string;
  name: string;
  cost: number;
  duration: number;
  salespoints: SalesPoint[];
  staff: StaffService[];
  promotions: Promotion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  key: string;
  name: string;
  cost: number;
  duration: number;
  salespoints: number[];
  staff: number[];
}
