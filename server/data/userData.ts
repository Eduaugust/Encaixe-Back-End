var prisma = require('../infra/dataBase');

exports.post = async (data: object)=> {
    console.log(data);
    const response =  await prisma.User.create({data:data})
    await prisma.$disconnect()
    return response
}