var prisma = require('../infra/dataBase');

interface GetByDay {start: object; end: object, tuesday: boolean, wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean}

exports.get = async ()=> {
    const response =  await  prisma.Clients.findMany({})
    await prisma.$disconnect()
    return response
}

exports.getByDay = async (day: string, dayWeek: number) => {
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
  const response =  await  prisma.Clients.findMany({where: obj})
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


