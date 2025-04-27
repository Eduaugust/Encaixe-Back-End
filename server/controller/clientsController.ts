import * as clientsService from '../service/clientsService';
import {Request, Response, NextFunction } from 'express';
import { ClientCreateData, ClientUpdateData } from '../types/client';

export const get = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const response = await clientsService.get(req.body.decodedUser.id, req.body.decodedUser.type);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}

export const getByDay = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const date = req.params.date;
    const dayWeek = new Date(date).getDay() + 1;
    
    const response = await clientsService.getByDay(date, dayWeek, req.body.decodedUser.id, req.body.decodedUser.type);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}

export const post = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const { name, morning, afternoon, number, service, start, end, tuesday, wednesday, thursday, friday, saturday } = req.body;
    const { id: userId } = req.body.decodedUser;
    
    const clientData: ClientCreateData = {
        name,
        morning,
        afternoon,
        number,
        service,
        start,
        end,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        userId
    };
    
    const response = await clientsService.post(clientData);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}

export const put = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const id = parseInt(req.params.id);
    const { id: userId, type } = req.body.decodedUser;
    const updateData: ClientUpdateData = {
        name: req.body.name,
        number: req.body.number,
        service: req.body.service,
        morning: req.body.morning,
        afternoon: req.body.afternoon,
        tuesday: req.body.tuesday,
        wednesday: req.body.wednesday,
        thursday: req.body.thursday,
        friday: req.body.friday,
        saturday: req.body.saturday,
        start: req.body.start,
        end: req.body.end
    };
    
    const response = await clientsService.put(id, updateData, userId, type);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const id = parseInt(req.params.id);
    const { id: userId, type } = req.body.decodedUser;
    
    const response = await clientsService.deleteById(id, userId, type);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const response = await clientsService.deleteClient(req.query.day as string);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}