import * as userData from '../data/userData';
import { ResponseDTO } from '../dtos/response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserData, UserLoginData, UserRole } from '../types/user';

export const post = async (data: UserData, userRole: UserRole, userCompanyId: number) => {
    try {
        // Verificar permissões para criar usuários
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode criar qualquer tipo de usuário em qualquer empresa
        } else if (userRole === UserRole.ADMIN) {
            // Admin só pode criar usuários na sua própria empresa e com papel MEMBER
            if (data.companyId !== userCompanyId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para criar usuários em outras empresas', null);
            }
            
            if (data.role && data.role !== UserRole.MEMBER) {
                return new ResponseDTO('Error', 403, 'Administradores só podem criar usuários com papel de membro', null);
            }
        } else {
            // Membros comuns não podem criar usuários
            return new ResponseDTO('Error', 403, 'Você não tem permissão para criar usuários', null);
        }
        
        // Criptografar a senha antes de salvar
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        // Verificar se o email já está cadastrado
        const existingUser = await userData.getByEmail(data.email);
        if (existingUser) {
            return new ResponseDTO('Error', 400, 'Email já cadastrado para outro usuário', null);
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
                user_role: user.role,
                companyId: user.companyId,
            },
            process.env.SECRET!,
            { expiresIn: '24h' }
        );
        
        return new ResponseDTO('Success', 200, '', { 
            user: {
                id: user.id, 
                name: user.name,
                email: user.email, 
                role: user.role,
                companyId: user.companyId
            },
            token 
        });
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro no processo de login', (e as Error).stack);
    }
}

export const getAll = async (userRole: UserRole, userCompanyId: number) => {
    try {
        let users;
        
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode ver todos os usuários
            users = await userData.getAll();
        } else if (userRole === UserRole.ADMIN) {
            // Admin só pode ver usuários da sua empresa
            users = await userData.getAllByCompanyId(userCompanyId);
        } else {
            // Membros comuns não podem listar todos os usuários
            return new ResponseDTO('Error', 403, 'Você não tem permissão para listar usuários', null);
        }
        
        return new ResponseDTO('Success', 200, '', users);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao buscar usuários', (e as Error).stack);
    }
}

export const getById = async (id: number, userRole: UserRole, userCompanyId: number, requestUserId: number) => {
    try {
        // Qualquer usuário pode ver seu próprio perfil
        if (id === requestUserId) {
            const user = await userData.getById(id);
            if (!user) {
                return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
            }
            return new ResponseDTO('Success', 200, '', user);
        }
        
        // Para outros perfis, verificar permissões
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode ver qualquer usuário
        } else if (userRole === UserRole.ADMIN) {
            // Admins só podem ver usuários da própria empresa
            const targetUser = await userData.getById(id);
            if (!targetUser) {
                return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
            }
            
            if (targetUser.companyId !== userCompanyId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para acessar este usuário', null);
            }
        } else {
            // Membros comuns não podem ver outros usuários
            return new ResponseDTO('Error', 403, 'Você não tem permissão para acessar este usuário', null);
        }
        
        const user = await userData.getById(id);
        if (!user) {
            return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
        }
        
        return new ResponseDTO('Success', 200, '', user);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao buscar usuário', (e as Error).stack);
    }
}

export const updateProfile = async (id: number, data: Partial<UserData>, userRole: UserRole, userCompanyId: number, requestUserId: number) => {
    try {
        // Verificar se o usuário a ser atualizado existe
        const userToUpdate = await userData.getById(id);
        if (!userToUpdate) {
            return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
        }
        
        // Verificar permissões
        if (id === requestUserId) {
            // Usuário editando o próprio perfil - não pode alterar papel ou empresa
            if (data.role) {
                delete data.role;
            }
            
            if (data.companyId) {
                delete data.companyId;
            }
        } else {
            if (userRole === UserRole.SUPER_ADMIN) {
                // Super Admin pode editar qualquer usuário e qualquer campo
            } else if (userRole === UserRole.ADMIN) {
                // Admin só pode editar usuários da própria empresa e com papel menor
                if (userToUpdate.companyId !== userCompanyId) {
                    return new ResponseDTO('Error', 403, 'Sem permissão para editar usuários de outras empresas', null);
                }
                
                if (userToUpdate.role === UserRole.ADMIN || userToUpdate.role === UserRole.SUPER_ADMIN) {
                    return new ResponseDTO('Error', 403, 'Sem permissão para editar usuários com este nível de acesso', null);
                }
                
                // Admin só pode atribuir papel MEMBER
                if (data.role && data.role !== UserRole.MEMBER) {
                    return new ResponseDTO('Error', 403, 'Administradores só podem atribuir papel de membro', null);
                }
                
                // Admin não pode mover usuário para outra empresa
                if (data.companyId && data.companyId !== userCompanyId) {
                    return new ResponseDTO('Error', 403, 'Sem permissão para mover usuários para outras empresas', null);
                }
            } else {
                // Membros comuns não podem editar outros usuários
                return new ResponseDTO('Error', 403, 'Você não tem permissão para editar outros usuários', null);
            }
        }
        
        // Criptografar a senha se estiver sendo atualizada
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        
        const updatedUser = await userData.update(id, data);
        return new ResponseDTO('Success', 200, 'Perfil atualizado com sucesso', updatedUser);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao atualizar perfil', (e as Error).stack);
    }
}

export const remove = async (id: number, requestUserId: number, requestUserRole: UserRole) => {
    try {
        // Não permitir deletar o usuário com ID 1 (super admin inicial)
        if (id === 1) {
            return new ResponseDTO('Error', 403, 'Não é permitido deletar o usuário super admin inicial', null);
        }
        
        // Não permitir que um usuário delete a si mesmo
        if (id === requestUserId) {
            return new ResponseDTO('Error', 403, 'Não é permitido deletar seu próprio usuário', null);
        }
        
        // Buscar o usuário a ser deletado
        const userToDelete = await userData.getById(id);
        if (!userToDelete) {
            return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
        }
        
        // Se o usuário que fez a requisição não é SUPER_ADMIN
        if (requestUserRole !== UserRole.SUPER_ADMIN) {
            // Buscar informações do usuário que fez a requisição
            const requestUserData = await userData.getById(requestUserId);
            if (!requestUserData) {
                return new ResponseDTO('Error', 404, 'Usuário da requisição não encontrado', null);
            }
            
            // Se o usuário que fez a requisição não é ADMIN
            if (requestUserRole !== UserRole.ADMIN) {
                return new ResponseDTO('Error', 403, 'Apenas administradores podem deletar usuários', null);
            }
            
            // Admin não pode deletar outro admin ou super admin
            if (userToDelete.role === UserRole.ADMIN || userToDelete.role === UserRole.SUPER_ADMIN) {
                return new ResponseDTO('Error', 403, 'Administradores só podem deletar membros comuns', null);
            }
            
            // Admin só pode deletar usuários da mesma empresa
            if (userToDelete.companyId !== requestUserData.companyId) {
                return new ResponseDTO('Error', 403, 'Administradores só podem deletar usuários da própria empresa', null);
            }
        }
        
        // Executar a remoção do usuário
        const deletedUser = await userData.remove(id);
        
        return new ResponseDTO('Success', 200, 'Usuário deletado com sucesso', {
            id: deletedUser.id,
            name: deletedUser.name,
            email: deletedUser.email,
            role: deletedUser.role
        });
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao deletar usuário', (e as Error).stack);
    }
}