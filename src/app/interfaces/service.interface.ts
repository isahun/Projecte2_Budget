export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
  pages?: number;
  languages?: number;
}

