import { StaffService } from "./service.model";

export interface Schedule {
  id: number;
  createdAt: string;
  updatedAt: string;
  startDate: number;
  endDate: number;
  service: StaffService;
}
