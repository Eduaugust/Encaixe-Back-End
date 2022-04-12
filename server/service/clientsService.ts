const clientsData = require('../data/clientsData')
const { ResponseDTO } = require('../dtos/response')

exports.get = async () => {
    try {
        const response = await clientsData.get()
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.getByDay = async (day: object) => {
    try {
        const response = await clientsData.getByDay(day)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.getById = async (id: number) => {
    try {
        const response = await clientsData.getById(id)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.post = async (data: object) => {
    try {
        const response = await clientsData.post(data)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.put = async (id: number, data: string) => {
    try {
        const verify = await exports.getById(id)
        if (verify.type == 'Error') {
            return verify
        } else if(verify.data == null) {
            return new ResponseDTO('Error', 500, 'Id do usuário inválido', null)    
        }
        const response = await clientsData.put(data)
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.deleteById = async (id: number) => {
    try {
        const verify = await exports.getById(id)
        if (verify.type == 'Error') {
            return verify
        } else if(verify.data == null) {
            return new ResponseDTO('Error', 500, 'Id do usuário inválido', null)    
        }
        const response = await clientsData.deleteById(id)
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