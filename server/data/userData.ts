import {prisma} from '../infra/dataBase';
import { UserData } from '../types/user';

export const post = async (data: UserData) => {
    const response = await prisma.user.create({data: data});
    await prisma.$disconnect();
    return response;
}

export const getByEmail = async (email: string) => {
    const response = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    await prisma.$disconnect();
    return response;
}

export const getAll = async () => {
    const response = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyId: true,
            createdAt: true,
            updatedAt: true,
            company: true,
            clients: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
    await prisma.$disconnect();
    return response;
}

export const getById = async (id: number) => {
    const response = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyId: true,
            createdAt: true,
            updatedAt: true,
            company: true,
            clients: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
    await prisma.$disconnect();
    return response;
}

export const update = async (id: number, data: Partial<UserData>) => {
    const response = await prisma.user.update({
        where: { id },
        data
    });
    await prisma.$disconnect();
    return response;
}

export const remove = async (id: number) => {
    const response = await prisma.user.delete({
        where: { id }
    });
    await prisma.$disconnect();
    return response;
}

export const getAllByCompanyId = async (companyId: number) => {
    const response = await prisma.user.findMany({
        where: { 
            companyId 
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyId: true,
            createdAt: true,
            updatedAt: true,
            company: true,
            clients: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
    await prisma.$disconnect();
    return response;
}