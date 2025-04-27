import { Clients } from '@prisma/client';
import {prisma} from '../infra/dataBase';
import { ClientCreateData } from '../types/client';

interface GetByDay {
    start: object; 
    end: object;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
}

export const get = async () => {
    const response = await prisma.clients.findMany({});
    await prisma.$disconnect();
    return response;
}

export const getByUserId = async (userId: number) => {
    const response = await prisma.clients.findMany({
        where: {
            userId: userId
        }
    });
    await prisma.$disconnect();
    return response;
}

export const getByDay = async (day: string, dayWeek: number) => {
  const obj: Partial<GetByDay> = {}

  obj.start={ lte: day }
  obj.end={ gte: day }
  
  switch (dayWeek) {
    case 2:
      obj.tuesday = true;            
      break;
    case 3:
      obj.wednesday = true;            
      break;
    case 4:
      obj.thursday = true;            
      break;
    case 5:
      obj.friday = true;            
      break;
    case 6:
      obj.saturday = true;            
      break;
  }
  const response =  await  prisma.clients.findMany({where: obj})
  await prisma.$disconnect()
  return response
}

export const getByDayAndUserId = async (day: string, dayWeek: number, userId: number) => {
    const obj: Partial<GetByDay> = {};

    obj.start = { lte: day };
    obj.end = { gte: day };
  
    switch (dayWeek) {
        case 2:
            obj.tuesday = true;            
            break;
        case 3:
            obj.wednesday = true;            
            break;
        case 4:
            obj.thursday = true;            
            break;
        case 5:
            obj.friday = true;            
            break;
        case 6:
            obj.saturday = true;            
            break;
    }
  
    const response = await prisma.clients.findMany({
        where: {
            ...obj,
            userId: userId
        }
    });
    await prisma.$disconnect();
    return response;
}

export const getById = async (id: number)=> {
  const response =  await  prisma.clients.findUnique({
    where: {
      id
    },
    })
  await prisma.$disconnect()
  return response
}

export const post = async (data: ClientCreateData)=> {
    const response =  await prisma.clients.create({data:data})
    await prisma.$disconnect()
    return response
}

export const put = async (data: object, id: number) => {
    const response = await prisma.clients.update({where: {id:id},data:data})
    await prisma.$disconnect()
    return response
}

export const deleteById = async (id: number)=> {
    const response = await prisma.clients.delete({
        where: {
          id
        },
      })
    await prisma.$disconnect()
    return response
}

export const deleteClient = async (day: string)=> {
  const response = await prisma.clients.deleteMany({
    where: {
      end: { lte: day },
    },
  })
  await prisma.$disconnect()
  return response
}


