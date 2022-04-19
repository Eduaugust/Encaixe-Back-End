const clientsData = require('../data/clientsData')
var { ResponseDTO } = require('../dtos/response')

interface Client {name: string, number: string, serivce: string, start: string, end: string, morning: boolean, afternoon: boolean, tuesday: boolean, wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean, userId: number}

exports.get = async () => {
    try {
        const response = await clientsData.get()
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.getByDay = async (day: string) => {
    try {
        // Muda o padraão para yy/mm/dd
        const newDay = day.replaceAll('-', '/')
        const weekNumber = new Date(newDay).getDay()
        if ( weekNumber == 0 || weekNumber == 1 ) {
            return new ResponseDTO('Error', 400, 'Domingo e Segunda são dias bloqueados. \nEscolha um outro dia.')    
        }
        else{
            const response = await clientsData.getByDay(newDay, weekNumber)
            return new ResponseDTO('Success', 200, '', response)  
        }
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

exports.post = async (data: Client) => {
    try {
        data.start = data.start.replaceAll('-', '/')
        data.end = data.end.replaceAll('-', '/')

        const response = await clientsData.post(data)

        
        return new ResponseDTO('Success', 200, '', response)  
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error acessing database', (e as Error).stack)    
    }    
}

exports.put = async (id: string, data: string) => {
    try {
        parseInt(id, 10)
        const verify = await exports.getById(id)
        if (verify.type == 'Error') {
            return verify
        } else if(verify.data == null) {
            return new ResponseDTO('Error', 500, 'Id do usuário inválido', null)    
        }
        const response = await clientsData.put(data, id)
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