import { Service } from '../../interfaces/budget-service.interface';

export const services: Service[] = [
  {
    id: 'seo',
    name: 'SEO',
    description: 'Optimització per a cercadors',
    price: 300,
    isSelected: false,
  },
  {
    id: 'ads',
    name: 'Publicitat',
    description: 'Campanyes de SEM',
    price: 400,
    isSelected: false },
  {
    id: 'web',
    name: 'Web',
    description: 'Programació a mida',
    price: 500,
    isSelected: false
  },
];
