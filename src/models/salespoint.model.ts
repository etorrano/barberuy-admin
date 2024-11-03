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
};
