import { Client } from './client';
import { Service } from './service';

export interface DesireService {
  id: number;
  morning: boolean;
  afternoon: boolean;
  start: string;
  end: string;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  createdAt: Date;
  updatedAt: Date;
  clientId: number;
  serviceId: number;
  client?: Client;
  service?: Service;
}

export interface CreateDesireServiceDTO {
  morning: boolean;
  afternoon: boolean;
  start: string;
  end: string;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  clientId: number;
  serviceId: number;
}

export interface UpdateDesireServiceDTO {
  morning?: boolean;
  afternoon?: boolean;
  start?: string;
  end?: string;
  sunday?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  clientId?: number;
  serviceId?: number;
}
