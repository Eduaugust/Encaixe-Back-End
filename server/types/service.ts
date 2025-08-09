import { Company } from './company';
import { DesireService } from './desireService';

export interface Service {
  id: number;
  title: string;
  description?: string;
  averageTime: number; // em minutos
  createdAt: Date;
  updatedAt: Date;
  companyId: number;
  company?: Company;
  desireServices?: DesireService[];
}

export interface CreateServiceDTO {
  title: string;
  description?: string;
  averageTime: number;
  companyId: number;
}

export interface UpdateServiceDTO {
  title?: string;
  description?: string;
  averageTime?: number;
  companyId?: number;
}
