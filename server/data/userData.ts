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