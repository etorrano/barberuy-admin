export enum Days {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export interface CreateWorkshiftPayload {
  days: Days[];
  startTime: string;
  endTime: string;
}

export type Workshift = {
  id: string;
  title: string;
  days: Days[];
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};
