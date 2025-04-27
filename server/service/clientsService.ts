import * as clientsData from '../data/clientsData';
import { ResponseDTO } from '../dtos/response';
import { ClientCreateData, ClientUpdateData, ClientData } from '../types/client';

export const get = async (userId: number, userType: string) => {
    try {
        let response;
        if (userType === 'admin') {
            // Admin pode ver todos os clientes
            response = await clientsData.get();
        } else {
            // Usuários normais só podem ver seus próprios clientes
            response = await clientsData.getByUserId(userId);
        }
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const getByDay = async (day: string, dayWeek: number, userId: number, userType: string) => {
    try {
        let response;
        if (userType === 'admin') {
            // Admin pode ver todos os clientes
            response = await clientsData.getByDay(day, dayWeek);
        } else {
            // Usuários normais só podem ver seus próprios clientes
            response = await clientsData.getByDayAndUserId(day, dayWeek, userId);
        }
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const post = async (data: ClientCreateData) => {
    try {
        const response = await clientsData.post(data);
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const put = async (id: number, data: ClientUpdateData, userId: number, userType: string) => {
    try {
        // Verificar se o cliente pertence ao usuário
        const client = await clientsData.getById(id) as ClientData | null;
        
        if (!client) {
            return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
        }
        
        if (userType !== 'admin' && client.userId !== userId) {
            return new ResponseDTO('Error', 403, 'Sem permissão para editar este cliente', null);
        }
        
        const response = await clientsData.put(data, id);
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const deleteById = async (id: number, userId: number, userType: string) => {
    try {
        // Verificar se o cliente pertence ao usuário
        const client = await clientsData.getById(id);
        
        if (!client) {
            return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
        }
        
        if (userType !== 'admin' && client.userId !== userId) {
            return new ResponseDTO('Error', 403, 'Sem permissão para excluir este cliente', null);
        }
        
        const response = await clientsData.deleteById(id);
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const deleteClient = async (day: string) => {
    try {
        const response = await clientsData.deleteClient(day);
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}
