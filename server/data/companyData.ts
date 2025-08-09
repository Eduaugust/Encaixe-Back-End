import { prisma } from '../infra/dataBase';
import { CreateCompanyDTO } from '../types/company';

export const create = async (data: CreateCompanyDTO) => {
  const company = await prisma.company.create({
    data
  });
  await prisma.$disconnect();
  return company;
};

export const getAll = async () => {
  const companies = await prisma.company.findMany({
    include: {
      users: {
        select: {
          id: true,
          email: true,
          role: true
        }
      },
      services: true
    }
  });
  await prisma.$disconnect();
  return companies;
};

export const getById = async (id: number) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          role: true
        }
      },
      services: true
    }
  });
  await prisma.$disconnect();
  return company;
};

export const update = async (id: number, data: CreateCompanyDTO) => {
  const company = await prisma.company.update({
    where: { id },
    data
  });
  await prisma.$disconnect();
  return company;
};

export const remove = async (id: number) => {
  const company = await prisma.company.delete({
    where: { id }
  });
  await prisma.$disconnect();
  return company;
};

export const checkCompanyExists = async (id: number) => {
  const company = await prisma.company.findUnique({
    where: { id }
  });
  await prisma.$disconnect();
  return company !== null;
};

export const countUsersInCompany = async (companyId: number) => {
  const count = await prisma.user.count({
    where: {
      companyId
    }
  });
  await prisma.$disconnect();
  return count;
};

export const checkHasServices = async (companyId: number) => {
  const count = await prisma.service.count({
    where: {
      companyId
    }
  });
  await prisma.$disconnect();
  return count > 0;
};
