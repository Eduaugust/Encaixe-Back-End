import * as serviceData from '../data/serviceData';
import * as companyData from '../data/companyData';
import { ResponseDTO } from '../dtos/response';
import { CreateServiceDTO, UpdateServiceDTO } from '../types/service';
import { UserRole } from '../types/user';

export const create = async (data: CreateServiceDTO, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se a empresa existe
    const companyExists = await companyData.checkCompanyExists(data.companyId);
    if (!companyExists) {
      return new ResponseDTO('Error', 404, 'Empresa não encontrada', null);
    }
    
    // Regras de permissão por papel de usuário
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode criar serviços para qualquer empresa
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode criar serviços para sua própria empresa
      if (data.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Administradores só podem criar serviços para sua própria empresa', null);
      }
    } else {
      // Membros comuns não podem criar serviços
      return new ResponseDTO('Error', 403, 'Você não tem permissão para criar serviços', null);
    }
    
    // Validações de negócio
    if (!data.title) {
      return new ResponseDTO('Error', 400, 'O título do serviço é obrigatório', null);
    }
    
    if (data.averageTime <= 0) {
      return new ResponseDTO('Error', 400, 'O tempo médio deve ser maior que zero', null);
    }
    
    // Criar serviço
    const service = await serviceData.create(data);
    return new ResponseDTO('Success', 201, 'Serviço criado com sucesso', service);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao criar serviço', (error as Error).message);
  }
};

export const getAll = async (userRole: UserRole, userCompanyId: number) => {
  try {
    let services;
    
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode ver todos os serviços
      services = await serviceData.getAll();
    } else {
      // Outros usuários só podem ver serviços de sua empresa
      services = await serviceData.getByCompanyId(userCompanyId);
    }
    
    return new ResponseDTO('Success', 200, '', services);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar serviços', (error as Error).message);
  }
};

export const getById = async (id: number, userRole: UserRole, userCompanyId: number) => {
  try {
    const service = await serviceData.getById(id);
    if (!service) {
      return new ResponseDTO('Error', 404, 'Serviço não encontrado', null);
    }
    
    // Verificar permissões
    if (userRole !== UserRole.SUPER_ADMIN && service.companyId !== userCompanyId) {
      return new ResponseDTO('Error', 403, 'Sem permissão para acessar este serviço', null);
    }
    
    return new ResponseDTO('Success', 200, '', service);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar serviço', (error as Error).message);
  }
};

export const getByCompanyId = async (companyId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se a empresa existe
    const companyExists = await companyData.checkCompanyExists(companyId);
    if (!companyExists) {
      return new ResponseDTO('Error', 404, 'Empresa não encontrada', null);
    }
    
    // Verificar permissões - apenas Super Admin pode ver serviços de outras empresas
    if (userRole !== UserRole.SUPER_ADMIN && companyId !== userCompanyId) {
      return new ResponseDTO('Error', 403, 'Sem permissão para acessar serviços desta empresa', null);
    }
    
    const services = await serviceData.getByCompanyId(companyId);
    return new ResponseDTO('Success', 200, '', services);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar serviços da empresa', (error as Error).message);
  }
};

export const update = async (id: number, data: UpdateServiceDTO, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o serviço existe
    const existingService = await serviceData.getById(id);
    if (!existingService) {
      return new ResponseDTO('Error', 404, 'Serviço não encontrado', null);
    }
    
    // Verificar permissões
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode atualizar qualquer serviço
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode atualizar serviços de sua própria empresa
      if (existingService.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para atualizar este serviço', null);
      }
    } else {
      // Usuários comuns não podem atualizar serviços
      return new ResponseDTO('Error', 403, 'Você não tem permissão para atualizar serviços', null);
    }
    
    // Se estiver alterando a empresa, verificar se a nova empresa existe
    if (data.companyId && data.companyId !== existingService.companyId) {
      const companyExists = await companyData.checkCompanyExists(data.companyId);
      if (!companyExists) {
        return new ResponseDTO('Error', 404, 'Empresa não encontrada', null);
      }
      
      // Apenas Super Admin pode mover serviços entre empresas
      if (userRole !== UserRole.SUPER_ADMIN) {
        return new ResponseDTO('Error', 403, 'Sem permissão para transferir serviços para outra empresa', null);
      }
    }
    
    // Validações de negócio para campos atualizados
    if (data.averageTime !== undefined && data.averageTime <= 0) {
      return new ResponseDTO('Error', 400, 'O tempo médio deve ser maior que zero', null);
    }
    
    // Atualizar serviço
    const updatedService = await serviceData.update(id, data);
    return new ResponseDTO('Success', 200, 'Serviço atualizado com sucesso', updatedService);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao atualizar serviço', (error as Error).message);
  }
};

export const remove = async (id: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o serviço existe
    const existingService = await serviceData.getById(id);
    if (!existingService) {
      return new ResponseDTO('Error', 404, 'Serviço não encontrado', null);
    }
    
    // Verificar permissões
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode remover qualquer serviço
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode remover serviços de sua própria empresa
      if (existingService.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para remover este serviço', null);
      }
    } else {
      // Usuários comuns não podem remover serviços
      return new ResponseDTO('Error', 403, 'Você não tem permissão para remover serviços', null);
    }
    
    // Verificar se há desejos de serviço associados
    if (existingService.desireServices && existingService.desireServices.length > 0) {
      return new ResponseDTO('Error', 400, 'Não é possível excluir um serviço que possui desejos associados', null);
    }
    
    // Remover serviço
    const removedService = await serviceData.remove(id);
    return new ResponseDTO('Success', 200, 'Serviço removido com sucesso', removedService);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao remover serviço', (error as Error).message);
  }
};
