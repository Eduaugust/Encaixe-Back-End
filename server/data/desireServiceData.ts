import { prisma } from '../infra/dataBase';
import { CreateDesireServiceDTO, UpdateDesireServiceDTO } from '../types/desireService';

export const create = async (data: CreateDesireServiceDTO) => {
  const desireService = await prisma.desireService.create({
    data
  });
  await prisma.$disconnect();
  return desireService;
};

export const getAll = async () => {
  const desireServices = await prisma.desireService.findMany({
    include: {
      client: true,
      service: true
    }
  });
  await prisma.$disconnect();
  return desireServices;
};

export const getById = async (id: number) => {
  const desireService = await prisma.desireService.findUnique({
    where: { id },
    include: {
      client: true,
      service: true
    }
  });
  await prisma.$disconnect();
  return desireService;
};

export const getByClientId = async (clientId: number) => {
  const desireServices = await prisma.desireService.findMany({
    where: { clientId },
    include: {
      service: true
    }
  });
  await prisma.$disconnect();
  return desireServices;
};

export const getByServiceId = async (serviceId: number) => {
  const desireServices = await prisma.desireService.findMany({
    where: { serviceId },
    include: {
      client: true
    }
  });
  await prisma.$disconnect();
  return desireServices;
};

export const getByDay = async (dayName: string) => {
  let filter = {};
  switch (dayName.toLowerCase()) {
    case 'sunday': filter = { sunday: true }; break;
    case 'monday': filter = { monday: true }; break;
    case 'tuesday': filter = { tuesday: true }; break;
    case 'wednesday': filter = { wednesday: true }; break;
    case 'thursday': filter = { thursday: true }; break;
    case 'friday': filter = { friday: true }; break;
    case 'saturday': filter = { saturday: true }; break;
    default: throw new Error('Dia inválido');
  }
  
  const desireServices = await prisma.desireService.findMany({
    where: filter,
    include: {
      client: true,
      service: true
    }
  });
  await prisma.$disconnect();
  return desireServices;
};

export const update = async (id: number, data: UpdateDesireServiceDTO) => {
  const desireService = await prisma.desireService.update({
    where: { id },
    data
  });
  await prisma.$disconnect();
  return desireService;
};

export const remove = async (id: number) => {
  const desireService = await prisma.desireService.delete({
    where: { id }
  });
  await prisma.$disconnect();
  return desireService;
};

export const checkClientExists = async (clientId: number) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId }
  });
  await prisma.$disconnect();
  return client !== null;
};

export const checkServiceExists = async (serviceId: number) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });
  await prisma.$disconnect();
  return service !== null;
};

export const checkDesireServiceExists = async (id: number) => {
  const desireService = await prisma.desireService.findUnique({
    where: { id }
  });
  await prisma.$disconnect();
  return desireService !== null;
};

export const getAllByCompanyId = async (companyId: number) => {
  // Busca todos os clientes associados a usuários da empresa
  const users = await prisma.user.findMany({
    where: { companyId },
    select: { id: true }
  });
  
  const userIds = users.map(user => user.id);
  
  // Busca todos os clientes desses usuários
  const clients = await prisma.client.findMany({
    where: { 
      userId: { 
        in: userIds 
      } 
    },
    select: { id: true }
  });
  
  const clientIds = clients.map(client => client.id);
  
  // Busca todos os desejos de serviço desses clientes
  const desireServices = await prisma.desireService.findMany({
    where: { 
      clientId: { 
        in: clientIds 
      } 
    },
    include: {
      client: true,
      service: true
    }
  });
  
  await prisma.$disconnect();
  return desireServices;
};

export const getAllByUserId = async (userId: number) => {
  // Busca todos os clientes do usuário
  const clients = await prisma.client.findMany({
    where: { userId },
    select: { id: true }
  });
  
  const clientIds = clients.map(client => client.id);
  
  // Busca todos os desejos de serviço desses clientes
  const desireServices = await prisma.desireService.findMany({
    where: { 
      clientId: { 
        in: clientIds 
      } 
    },
    include: {
      client: true,
      service: true
    }
  });
  
  await prisma.$disconnect();
  return desireServices;
};
