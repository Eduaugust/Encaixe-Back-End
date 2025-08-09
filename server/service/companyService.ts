import * as companyData from '../data/companyData';
import { ResponseDTO } from '../dtos/response';
import { CreateCompanyDTO } from '../types/company';
import { UserRole } from '../types/user';

export const create = async (data: CreateCompanyDTO, userRole: UserRole) => {
  try {
    // Regra de negócio: Apenas SUPER_ADMIN pode criar empresas
    if (userRole !== UserRole.SUPER_ADMIN) {
      return new ResponseDTO('Error', 403, 'Apenas super administradores podem criar empresas', null);
    }
    
    // Validações de negócio
    if (!data.name || data.name.trim().length === 0) {
      return new ResponseDTO('Error', 400, 'O nome da empresa é obrigatório', null);
    }
    
    // Criar empresa
    const company = await companyData.create(data);
    return new ResponseDTO('Success', 201, 'Empresa criada com sucesso', company);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao criar empresa', (error as Error).message);
  }
};

export const getAll = async (userRole: UserRole, userCompanyId: number) => {
  try {
    let companies;
    
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin vê todas as empresas
      companies = await companyData.getAll();
    } else {
      // Outros usuários só veem sua própria empresa
      companies = [await companyData.getById(userCompanyId)];
      
      // Filtrar caso a empresa não exista
      companies = companies.filter(company => company !== null);
    }
    
    return new ResponseDTO('Success', 200, '', companies);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar empresas', (error as Error).message);
  }
};

export const getById = async (id: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar permissões - apenas Super Admin pode ver outras empresas
    if (userRole !== UserRole.SUPER_ADMIN && id !== userCompanyId) {
      return new ResponseDTO('Error', 403, 'Sem permissão para acessar informações de outras empresas', null);
    }
    
    const company = await companyData.getById(id);
    if (!company) {
      return new ResponseDTO('Error', 404, 'Empresa não encontrada', null);
    }
    
    return new ResponseDTO('Success', 200, '', company);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar empresa', (error as Error).message);
  }
};

export const update = async (id: number, data: CreateCompanyDTO, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se é Super Admin ou se está atualizando sua própria empresa
    if (userRole !== UserRole.SUPER_ADMIN) {
      // Admins podem atualizar apenas sua própria empresa e com restrições
      if (id !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para atualizar outras empresas', null);
      }
      
      // Limitar quais campos um Admin pode atualizar da própria empresa
      // (pode ser implementado conforme regras específicas de negócio)
    }
    
    // Verificar se a empresa existe
    const companyExists = await companyData.checkCompanyExists(id);
    if (!companyExists) {
      return new ResponseDTO('Error', 404, 'Empresa não encontrada', null);
    }
    
    // Validações de negócio
    if (data.name !== undefined && (data.name.trim().length === 0)) {
      return new ResponseDTO('Error', 400, 'O nome da empresa não pode ser vazio', null);
    }
    
    // Atualizar empresa
    const updatedCompany = await companyData.update(id, data);
    return new ResponseDTO('Success', 200, 'Empresa atualizada com sucesso', updatedCompany);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao atualizar empresa', (error as Error).message);
  }
};

export const remove = async (id: number, userRole: UserRole) => {
  try {
    // Regra de negócio: Apenas SUPER_ADMIN pode remover empresas
    if (userRole !== UserRole.SUPER_ADMIN) {
      return new ResponseDTO('Error', 403, 'Apenas super administradores podem remover empresas', null);
    }
    
    // Regra de negócio: Não permitir remover a empresa com ID 1 (empresa principal)
    if (id === 1) {
      return new ResponseDTO('Error', 403, 'Não é permitido remover a empresa principal', null);
    }
    
    // Verificar se a empresa existe
    const companyExists = await companyData.checkCompanyExists(id);
    if (!companyExists) {
      return new ResponseDTO('Error', 404, 'Empresa não encontrada', null);
    }
    
    // Verificar se há usuários associados à empresa
    const usersCount = await companyData.countUsersInCompany(id);
    if (usersCount > 0) {
      return new ResponseDTO('Error', 400, 'Não é possível excluir uma empresa que possui usuários', null);
    }
    
    // Verificar se há serviços associados à empresa
    const hasServices = await companyData.checkHasServices(id);
    if (hasServices) {
      return new ResponseDTO('Error', 400, 'Não é possível excluir uma empresa que possui serviços', null);
    }
    
    // Remover empresa
    const removedCompany = await companyData.remove(id);
    return new ResponseDTO('Success', 200, 'Empresa removida com sucesso', removedCompany);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao remover empresa', (error as Error).message);
  }
};
