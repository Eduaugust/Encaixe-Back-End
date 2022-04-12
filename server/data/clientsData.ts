const prisma = require('../infra/dataBase');

exports.get = async (day: string)=> {
    const response =  await  prisma.Clients.findMany({})
    await prisma.$disconnect()
    return response
}

exports.getByDay = async (day: string)=> {
  const response =  await  prisma.Clients.findMany({
      where: {
          start:{ lte: day },
          end:{ gte: day },
        },
      })
  await prisma.$disconnect()
  return response
}

exports.getById = async (id: number)=> {
  const response =  await  prisma.Clients.findUnique({
      where: {id:id}
    })
  await prisma.$disconnect()
  return response
}

exports.post = async (data: object)=> {
    const response =  await prisma.Clients.create({data:data})
    await prisma.$disconnect()
    return response
}

exports.put = async (data: object, id: number) => {
    const response = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
         data,
        },
      })
    await prisma.$disconnect()
    return response
}

exports.deleteById = async (id: number)=> {
    const response = await prisma.Clients.delete({
        where: {
          id
        },
      })
    await prisma.$disconnect()
    return response
}

exports.delete = async (day: string)=> {
  const response = await prisma.Clients.delete({
    where: {
      end:{ lte: day },
    },
    })
  await prisma.$disconnect()
  return response
}


