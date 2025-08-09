import { PrismaClient } from '@prisma/client';
import { ResponseDTO } from '../dtos/response';
import { ClientCreateData, ClientUpdateData, ClientData } from '../types/client';
import { UserRole } from '../types/user';

const prisma = new PrismaClient();

export const getAll = async (userId: number, userRole: UserRole, userCompanyId: number) => {
    try {
        let clients;
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode ver todos os clientes
            clients = await prisma.client.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            companyId: true
                        }
                    },
                    desireServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });
        } else if (userRole === UserRole.ADMIN) {
            // Admin pode ver clientes da sua empresa
            clients = await prisma.client.findMany({
                where: {
                    user: {
                        companyId: userCompanyId
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            companyId: true
                        }
                    },
                    desireServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });
        } else {
            // Usuários normais só podem ver seus próprios clientes
            clients = await prisma.client.findMany({
                where: { userId },
                include: {
                    desireServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });
        }
        return new ResponseDTO('Success', 200, '', clients);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const getById = async (id: number, userId: number, userRole: UserRole, userCompanyId: number) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        companyId: true
                    }
                },
                desireServices: {
                    include: {
                        service: true
                    }
                }
            }
        });
        
        if (!client) {
            return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
        }
        
        // Verificar se o usuário tem permissão para ver este cliente
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode ver qualquer cliente
        } else if (userRole === UserRole.ADMIN) {
            // Admin só pode ver clientes de sua empresa
            if (client.user.companyId !== userCompanyId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para acessar este cliente', null);
            }
        } else {
            // Usuário comum só pode ver seus próprios clientes
            if (client.userId !== userId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para acessar este cliente', null);
            }
        }
        
        return new ResponseDTO('Success', 200, '', client);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const getByUserId = async (userId: number) => {
    try {
        const clients = await prisma.client.findMany({
            where: { userId },
            include: {
                desireServices: {
                    include: {
                        service: true
                    }
                }
            }
        });
        
        return new ResponseDTO('Success', 200, '', clients);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const create = async (data: ClientCreateData, userRole: UserRole, userCompanyId: number) => {
    try {
        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { id: data.userId },
            include: { company: true }
        });
        
        if (!user) {
            return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
        }
        
        // Verificar se o usuário tem permissão para criar clientes para este usuário
        if (userRole === UserRole.ADMIN && user.companyId !== userCompanyId) {
            return new ResponseDTO('Error', 403, 'Sem permissão para criar clientes para usuários de outras empresas', null);
        }
        
        const client = await prisma.client.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                userId: data.userId
            }
        });
        
        return new ResponseDTO('Success', 201, 'Cliente criado com sucesso', client);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const update = async (id: number, data: ClientUpdateData, userId: number, userRole: UserRole, userCompanyId: number) => {
    try {
        // Verificar se o cliente existe
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
        
        if (!client) {
            return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
        }
        
        // Verificar permissões
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode editar qualquer cliente
        } else if (userRole === UserRole.ADMIN) {
            // Admin só pode editar clientes de sua empresa
            if (client.user.companyId !== userCompanyId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para editar este cliente', null);
            }
        } else {
            // Usuário comum só pode editar seus próprios clientes
            if (client.userId !== userId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para editar este cliente', null);
            }
        }
        
        // Se userId estiver presente, verificar se o usuário existe e pertence à mesma empresa
        if (data.userId) {
            const user = await prisma.user.findUnique({
                where: { id: data.userId }
            });
            
            if (!user) {
                return new ResponseDTO('Error', 404, 'Usuário não encontrado', null);
            }
            
            // Admin só pode atribuir clientes a usuários da sua empresa
            if (userRole === UserRole.ADMIN && user.companyId !== userCompanyId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para atribuir clientes a usuários de outras empresas', null);
            }
        }
        
        const updatedClient = await prisma.client.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                userId: data.userId
            }
        });
        
        return new ResponseDTO('Success', 200, 'Cliente atualizado com sucesso', updatedClient);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const remove = async (id: number, userId: number, userRole: UserRole, userCompanyId: number) => {
    try {
        // Verificar se o cliente existe
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
        
        if (!client) {
            return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
        }
        
        // Verificar permissões
        if (userRole === UserRole.SUPER_ADMIN) {
            // Super Admin pode excluir qualquer cliente
        } else if (userRole === UserRole.ADMIN) {
            // Admin só pode excluir clientes de sua empresa
            if (client.user.companyId !== userCompanyId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para excluir este cliente', null);
            }
        } else {
            // Usuário comum só pode excluir seus próprios clientes
            if (client.userId !== userId) {
                return new ResponseDTO('Error', 403, 'Sem permissão para excluir este cliente', null);
            }
        }
        
        const deletedClient = await prisma.client.delete({
            where: { id }
        });
        
        return new ResponseDTO('Success', 200, 'Cliente excluído com sucesso', deletedClient);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}

export const removeAll = async (userRole: UserRole) => {
    try {
        // Apenas Super Admin pode executar esta operação destrutiva
        if (userRole !== UserRole.SUPER_ADMIN) {
            return new ResponseDTO('Error', 403, 'Apenas super administradores podem excluir todos os clientes', null);
        }
        
        await prisma.client.deleteMany({});
        return new ResponseDTO('Success', 200, 'Todos os clientes foram excluídos', null);
    } catch (e) {
        return new ResponseDTO('Error', 500, 'Erro ao acessar banco de dados', (e as Error).stack);
    }
}
