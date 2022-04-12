const userData = require('../data/userData')
var { ResponseDTO } = require('../dtos/response')

exports.post = async (data: object) => {
    try {
        const response = await userData.post(data)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}