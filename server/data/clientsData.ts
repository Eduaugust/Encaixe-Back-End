const prisma = require('../infra/dataBase');

exports.get = async (day: string)=> {
    const response =  await  prisma.Clients.findMany({
        where: {
            day: day,
          },
        })
    await prisma.$disconnect()
    return response
}

exports.post = async (data: string)=> {
    const response =  await prisma.Clients.create({
        data: {
            data
        },
      })
    await prisma.$disconnect()
    return response
}

exports.put = async (data: string)=> {
    const response = await prisma.user.update({
        where: {
          email: 'viola@prisma.io',
        },
        data: {
          name: 'Viola the Magnificent',
        },
      })
    await prisma.$disconnect()
    return response
}

exports.delete = async (day: string)=> {
    const response = await prisma.Clients.delete({
        where: {
          day: day,
        },
      })
    await prisma.$disconnect()
    return response
}

exports.deleteById = async (id: string)=> {
    const response = await prisma.Clients.delete({
        where: {
          id: id,
        },
      })
    await prisma.$disconnect()
    return response
}


