import { Promotion } from "./promotion.model";
import { SalesPoint } from "./salespoint.model";
import { Schedule } from "./schedule.model";

export interface StaffService {
  id: string;
  staffId: number;
  staffEmail: string;
  staffName: string;
  serviceId: number;
  serviceName: string;
  salesPointId: number;
  salesPointName: string;
  schedules: Schedule[];
}

export interface Service {
  id: string;
  key: string;
  name: string;
  cost: number;
  duration: number;
  salesPoints: SalesPoint[];
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
  salespoints: SalesPoint[];
  salesPointsStaff: { salesPointId: number, salesPointStaff: string[] }[];
}
