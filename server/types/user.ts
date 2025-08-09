import { Company } from './company';
import { Client } from './client';

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  companyId: number;
  company?: Company;
  clients?: Client[];
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyId: number;
}

export interface UserCreateData extends UserData {
  // Dados necessários para criação de um usuário
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserUpdateData extends Partial<UserData> {
  // Todos os campos são opcionais para atualizações parciais
}