import * as clientsService from '../service/clientsService';
import { Request, Response, NextFunction } from 'express';
import { ClientCreateData, ClientUpdateData } from '../types/client';
import { UserRole } from '../types/user';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    // Verificação de segurança para garantir que req.body.decodedUser existe
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }

     const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await clientsService.getAll(userId, userRole, userCompanyId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
     const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const id = parseInt(req.params.id);
    
    const response = await clientsService.getById(id, userId, userRole, userCompanyId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const userId = parseInt(req.params.userId);
    
    const response = await clientsService.getByUserId(userId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }

     const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const { name, email, phoneNumber } = req.body;
    
    const clientData: ClientCreateData = {
        name,
        email,
        phoneNumber,
        userId
    };
    
    
    const response = await clientsService.create(clientData, userRole, userCompanyId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const id = parseInt(req.params.id);

    const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };

    const updateData: ClientUpdateData = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        userId: req.body.userId
    };

    
    
    const response = await clientsService.update(id, updateData, userId, userRole, userCompanyId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }
    
    const id = parseInt(req.params.id);
    const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await clientsService.remove(id, userId, userRole,userCompanyId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const removeAll = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.decodedUser) {
        return res.status(401).json({
            type: 'Error',
            status: 401,
            message: 'Usuário não autenticado'
        });
    }

    const userRole = req.body.decodedUser.role;
    
    const response = await clientsService.removeAll(userRole);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}