export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
}

export interface Budget {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  services: Omit<Service, 'isSelected'>[]; // "Agafa Service però treu-li el isSelected"
  total: number;
  date: Date;
}
