import * as userService from '../service/userService';
import { Request, Response, NextFunction } from 'express';
import { UserData, UserRole } from '../types/user';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from "../types/authRequest";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const response = await userService.login(email, password);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        
        // Como este é um registro público, definimos o papel como MEMBER
        // e usamos companyId=1 (empresa padrão) ou o que for definido no corpo
        const userRole = UserRole.SUPER_ADMIN; // Registro público pode criar SUPER_ADMIN apenas no início
        const userCompanyId = userData.companyId || 1;
        
        const response = await userService.post(userData, userRole, userCompanyId);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role, companyId } = req.body;

    if (!name || !email || !password || !companyId) {
        return res.status(400).json({
            type: 'Error',
            status: 400,
            message: 'Nome, email, senha e empresa são obrigatórios'
        });
    }
    
    const userData: UserData = { name, email, password, role, companyId };
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await userService.post(userData, userRole, userCompanyId);
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const { userId, userRole, userCompanyId } = {
            userId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role,
            userCompanyId: req.body.decodedUser.companyId
        };
        
        const response = await userService.getAll(userRole, userCompanyId);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { userId, userRole, userCompanyId } = {
            userId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role,
            userCompanyId: req.body.decodedUser.companyId
        };
        
        const response = await userService.getById(userId, userRole, userCompanyId, userId);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const getById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        
        const { requestUserId, userRole, userCompanyId } = {
            requestUserId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role,
            userCompanyId: req.body.decodedUser.companyId
        };
        
        const response = await userService.getById(userId, userRole, userCompanyId, requestUserId);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const { name, email, password, role, companyId } = req.body;
    const updateData: Partial<UserData> = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (role) updateData.role = role;
    if (companyId) updateData.companyId = companyId;
    
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await userService.updateProfile(id, updateData, userRole, userCompanyId, userId);
    
    if (response.type === 'Success'){
        return res.status(response.status).json(response);
    } else{
        return res.status(response.status).json(response);
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId, userRole, userCompanyId } = {
            userId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role,
            userCompanyId: req.body.decodedUser.companyId
        };
        
        const updateData = req.body;
        const response = await userService.updateProfile(userId, updateData, userRole, userCompanyId, userId);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const updateUserById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updateData = req.body;
        
        const { userId, userRole, userCompanyId } = {
            userId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role,
            userCompanyId: req.body.decodedUser.companyId
        };
        
        const response = await userService.updateProfile(id, updateData, userRole, userCompanyId, userId);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        const { userId, userRole, userCompanyId } = {
            userId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role,
            userCompanyId: req.body.decodedUser.companyId
        };
        
        const response = await userService.remove(id, userId, userRole);
        return res.status(response.status).json(response);
    } catch (e) {
        return res.status(500).json({
            Status: "Error",
            StatusCode: 500,
            Message: "Erro ao processar requisição",
            Data: (e as Error).message
        });
    }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        
        // Verificar se o usuário está autenticado
        if (!req.body.decodedUser) {
            return res.status(401).json({
                type: 'Error',
                status: 401,
                message: 'Usuário não autenticado'
            });
        }
        
        const { userId, userRole } = {
            userId: req.body.decodedUser.id,
            userRole: req.body.decodedUser.role
        };
        
        // Chamar o serviço de remoção
        const response = await userService.remove(id, userId, userRole);
        
        if (response.type === 'Success') {
            return res.status(response.status).json({
                success: true,
                message: response.message,
                data: response.data
            });
        } else {
            return res.status(response.status).json({
                success: false,
                message: response.message
            });
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: (e as Error).message
        });
    }
}

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                type: 'Error',
                status: 400,
                message: 'Nome da empresa é obrigatório'
            });
        }
        
        const company = await prisma.company.create({
            data: {
                name,
                description
            }
        });
        
        return res.status(201).json({
            type: 'Success',
            status: 201,
            message: 'Empresa criada com sucesso',
            data: company
        });
    } catch (e) {
        return res.status(500).json({
            type: 'Error',
            status: 500,
            message: 'Erro ao criar empresa',
            data: (e as Error).message
        });
    }
}