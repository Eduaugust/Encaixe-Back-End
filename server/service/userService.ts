import * as userData from '../data/userData';
import { ResponseDTO } from '../dtos/response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserData } from '../types/user';

export const post = async (data: UserData) => {
    try {
        // Criptografar a senha antes de salvar
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        
        const response = await userData.post(data);
        return new ResponseDTO('Success', 200, '', response);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Error accessing database', (e as Error).stack);
    }
}

export const login = async (email: string, password: string) => {
    try {
        const user = await userData.getByEmail(email);
        
        if (!user) {
            return new ResponseDTO('Error', 401, 'Email não encontrado', null);
        }
        
        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password || '');
        
        if (!validPassword) {
            return new ResponseDTO('Error', 401, 'Senha inválida', null);
        }
        
        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user.id,
                user_type: user.type 
            },
            process.env.SECRET!,
            { expiresIn: '24h' }
        );
        
        return new ResponseDTO('Success', 200, '', { 
            user: {id: user.id, email: user.email, type: user.type}, 
            token 
        });
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro no processo de login', (e as Error).stack);
    }
}