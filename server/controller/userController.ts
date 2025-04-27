import * as userService from '../service/userService';
import { Request, Response, NextFunction } from 'express';
import { UserData } from '../types/user';

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, type } = req.body;
    const userData: UserData = { email, password, type };
    
    const response = await userService.post(userData);
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            type: 'Error', 
            status: 400, 
            message: 'Email e senha são obrigatórios' 
        });
    }
    
    const response = await userService.login(email, password);
    
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else {
        return res.status(response.status).json(response);
    }
}