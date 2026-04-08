import { Service } from "./service.interface";

export interface Budget {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  services: Omit<Service, 'isSelected'>[];
  total: number;
  date: Date;
}
