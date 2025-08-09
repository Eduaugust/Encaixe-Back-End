import { User } from './user';
import { DesireService } from './desireService';

export interface Client {
  id: number;
  name: string;
  email?: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User;
  desireServices?: DesireService[];
}

export interface ClientData {
  id?: number;
  name: string;
  email?: string;
  phoneNumber: string;
  userId: number;
}

export interface ClientCreateData extends Omit<ClientData, 'id'> {
  // Dados necessários para criação de um cliente (sem o ID que é gerado automaticamente)
}

export interface ClientUpdateData extends Partial<ClientData> {
  // Todos os campos são opcionais para atualizações parciais
}
