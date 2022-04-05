const prisma = require('../infra/dataBase');

exports.getUser = async function(){
    const response =  await  prisma.user.findMany({
        where: {
            day: 'we',
          },
        })
    await prisma.$disconnect()
    return response
}