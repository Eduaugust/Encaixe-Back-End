const clientsData = require('../data/clientsData')
const { ResponseDTO } = require('../dtos/response')

exports.get = async (day: string) => {
    try {
        const response = await clientsData.get(day)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.post = async (data: string) => {
    try {
        const response = await clientsData.post(data)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.put = async (data: string) => {
    try {
        const response = await clientsData.put(data)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.delete = async (body: {day: string}) => {
    try {
        let day = body?.day
        if (!day){
            return new ResponseDTO('Error', 400, 'Forneça uma data') 
        }
        const response = await clientsData.delete(day)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.deleteById = async (id: string) => {
    try {
        const response = await clientsData.deleteById(id)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}