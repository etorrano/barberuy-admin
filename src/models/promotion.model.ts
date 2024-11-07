import { Service } from "./service.model";

export type PromotionType = "Percentage" | "Number";

export interface Promotion {
  id: string;
  name: string;
  type: PromotionType;
  value: number;
  startDate: string;
  endDate: string;
  enabled: boolean;
  services: Service[];
}
