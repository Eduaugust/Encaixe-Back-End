import { prisma } from '../infra/dataBase';
import { CreateServiceDTO, UpdateServiceDTO } from '../types/service';

export const create = async (data: CreateServiceDTO) => {
  const service = await prisma.service.create({
    data
  });
  await prisma.$disconnect();
  return service;
};

export const getAll = async () => {
  const services = await prisma.service.findMany({
    include: {
      company: true,
      desireServices: true
    }
  });
  await prisma.$disconnect();
  return services;
};

export const getById = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      company: true,
      desireServices: true
    }
  });
  await prisma.$disconnect();
  return service;
};

export const getByCompanyId = async (companyId: number) => {
  const services = await prisma.service.findMany({
    where: { companyId },
    include: {
      desireServices: true
    }
  });
  await prisma.$disconnect();
  return services;
};

export const update = async (id: number, data: UpdateServiceDTO) => {
  const service = await prisma.service.update({
    where: { id },
    data
  });
  await prisma.$disconnect();
  return service;
};

export const remove = async (id: number) => {
  const service = await prisma.service.delete({
    where: { id }
  });
  await prisma.$disconnect();
  return service;
};

export const checkCompanyExists = async (companyId: number) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });
  await prisma.$disconnect();
  return company !== null;
};

export const checkServiceExists = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id }
  });
  await prisma.$disconnect();
  return service !== null;
};
