import { prisma } from '../infra/dataBase';

/**
 * Busca um cliente pelo ID
 * @param id ID do cliente
 * @returns Retorna o cliente ou null se não encontrado
 */
export const getById = async (id: number) => {
  const client = await prisma.client.findUnique({
    where: { id }
  });
  await prisma.$disconnect();
  return client;
};

/**
 * Verifica se um cliente existe
 * @param id ID do cliente
 * @returns true se o cliente existe, false caso contrário
 */
export const checkExists = async (id: number) => {
  const client = await prisma.client.findUnique({
    where: { id },
    select: { id: true }
  });
  await prisma.$disconnect();
  return client !== null;
};

/**
 * Busca clientes pelo ID do usuário
 * @param userId ID do usuário
 * @returns Lista de clientes do usuário
 */
export const getByUserId = async (userId: number) => {
  const clients = await prisma.client.findMany({
    where: { userId }
  });
  await prisma.$disconnect();
  return clients;
};

/**
 * Busca o usuário associado a um cliente
 * @param userId ID do usuário
 * @returns O usuário associado ou null se não encontrado
 */
export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  await prisma.$disconnect();
  return user;
};
