import { User } from './user';
import { Service } from './service';

export interface Company {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
  services?: Service[];
}

export interface CreateCompanyDTO {
  name: string;
  description?: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  description?: string;
}
