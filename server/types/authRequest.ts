import { Request } from 'express';
import { UserRole } from './user';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        user_role: UserRole;
        companyId: number;
        [key: string]: any;
    };
}
