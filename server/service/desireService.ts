import * as desireServiceData from '../data/desireServiceData';
import * as clientData from '../data/clientData';
import * as serviceData from '../data/serviceData';
import { ResponseDTO } from '../dtos/response';
import { CreateDesireServiceDTO, UpdateDesireServiceDTO } from '../types/desireService';
import { UserRole } from '../types/user';

export const create = async (data: CreateDesireServiceDTO, userId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o cliente existe
    const client = await clientData.getById(data.clientId);
    if (!client) {
      return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
    }
    
    // Verificar se o serviço existe
    const service = await serviceData.getById(data.serviceId);
    if (!service) {
      return new ResponseDTO('Error', 404, 'Serviço não encontrado', null);
    }
    
    // Verificar permissões por papel de usuário
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode criar desejos para qualquer combinação de cliente/serviço
    } else if (userRole === UserRole.ADMIN) {
      // Admin pode criar desejos apenas para serviços de sua empresa
      if (service.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para usar serviços de outras empresas', null);
      }
      
      // Verificar se o cliente está associado a um usuário da mesma empresa
      const clientUser = await clientData.getUserById(client.userId);
      if (!clientUser || clientUser.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para criar desejos para clientes de outras empresas', null);
      }
    } else {
      // Usuário comum só pode criar desejos para seus próprios clientes
      if (client.userId !== userId) {
        return new ResponseDTO('Error', 403, 'Você não tem permissão para adicionar serviços a este cliente', null);
      }
      
      // E apenas para serviços da sua empresa
      if (service.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para usar serviços de outras empresas', null);
      }
    }
    
    // Validações de dados
    const validationResult = validateDesireServiceData(data);
    if (validationResult.error) {
      return new ResponseDTO('Error', 400, validationResult.message || 'Dados inválidos', null);
    }
    
    // Criar desejo de serviço
    const desireService = await desireServiceData.create(data);
    return new ResponseDTO('Success', 201, 'Desejo de serviço criado com sucesso', desireService);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao criar desejo de serviço', (error as Error).message);
  }
};

export const getAll = async (userRole: UserRole, userCompanyId: number, userId: number) => {
  try {
    let desireServices;
    
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode ver todos os desejos
      desireServices = await desireServiceData.getAll();
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode ver desejos de clientes de usuários de sua empresa
      desireServices = await desireServiceData.getAllByCompanyId(userCompanyId);
    } else {
      // Usuário comum só pode ver desejos de seus próprios clientes
      desireServices = await desireServiceData.getAllByUserId(userId);
    }
    
    return new ResponseDTO('Success', 200, '', desireServices);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar desejos de serviço', (error as Error).message);
  }
};

export const getById = async (id: number, userId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    const desireService = await desireServiceData.getById(id);
    if (!desireService) {
      return new ResponseDTO('Error', 404, 'Desejo de serviço não encontrado', null);
    }
    
    // Buscar cliente e serviço para verificar permissões
    const client = await clientData.getById(desireService.clientId);
    const service = await serviceData.getById(desireService.serviceId);
    
    if (!client || !service) {
      return new ResponseDTO('Error', 404, 'Dados relacionados não encontrados', null);
    }
    
    // Verificar permissões por papel de usuário
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode ver qualquer desejo
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode ver desejos relacionados a sua empresa
      const clientUser = await clientData.getUserById(client.userId);
      if (!clientUser || clientUser.companyId !== userCompanyId || service.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para acessar este desejo de serviço', null);
      }
    } else {
      // Usuário comum só pode ver desejos de seus próprios clientes
      if (client.userId !== userId) {
        return new ResponseDTO('Error', 403, 'Você não tem permissão para acessar este desejo de serviço', null);
      }
    }
    
    return new ResponseDTO('Success', 200, '', desireService);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar desejo de serviço', (error as Error).message);
  }
};

export const getByClientId = async (clientId: number, userId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o cliente existe
    const client = await clientData.getById(clientId);
    if (!client) {
      return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
    }
    
    // Verificar permissões por papel de usuário
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode ver desejos de qualquer cliente
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode ver desejos de clientes de sua empresa
      const clientUser = await clientData.getUserById(client.userId);
      if (!clientUser || clientUser.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para acessar os desejos deste cliente', null);
      }
    } else {
      // Usuário comum só pode ver desejos de seus próprios clientes
      if (client.userId !== userId) {
        return new ResponseDTO('Error', 403, 'Você não tem permissão para acessar os desejos deste cliente', null);
      }
    }
    
    const desireServices = await desireServiceData.getByClientId(clientId);
    return new ResponseDTO('Success', 200, '', desireServices);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar desejos de serviço do cliente', (error as Error).message);
  }
};

export const getByServiceId = async (serviceId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o serviço existe
    const service = await serviceData.getById(serviceId);
    if (!service) {
      return new ResponseDTO('Error', 404, 'Serviço não encontrado', null);
    }
    
    // Verificar permissões - apenas Super Admin pode ver desejos de serviços de outras empresas
    if (userRole !== UserRole.SUPER_ADMIN && service.companyId !== userCompanyId) {
      return new ResponseDTO('Error', 403, 'Sem permissão para acessar informações deste serviço', null);
    }
    
    const desireServices = await desireServiceData.getByServiceId(serviceId);
    return new ResponseDTO('Success', 200, '', desireServices);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar desejos pelo serviço', (error as Error).message);
  }
};

export const getByDay = async (day: string) => {
  try {
    // Validar formato do dia
    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (!validDays.includes(day.toLowerCase())) {
      return new ResponseDTO('Error', 400, 'Dia inválido. Deve ser um dia da semana em inglês', null);
    }
    
    const desireServices = await desireServiceData.getByDay(day);
    return new ResponseDTO('Success', 200, '', desireServices);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao buscar desejos de serviço pelo dia', (error as Error).message);
  }
};

export const update = async (id: number, data: UpdateDesireServiceDTO, userId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o desejo de serviço existe
    const existingDesireService = await desireServiceData.getById(id);
    if (!existingDesireService) {
      return new ResponseDTO('Error', 404, 'Desejo de serviço não encontrado', null);
    }
    
    // Buscar cliente e serviço atuais
    const client = await clientData.getById(existingDesireService.clientId);
    const service = await serviceData.getById(existingDesireService.serviceId);
    
    if (!client || !service) {
      return new ResponseDTO('Error', 404, 'Dados relacionados não encontrados', null);
    }
    
    // Verificar permissões por papel de usuário
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode atualizar qualquer desejo
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode atualizar desejos relacionados a sua empresa
      const clientUser = await clientData.getUserById(client.userId);
      if (!clientUser || clientUser.companyId !== userCompanyId || service.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para atualizar este desejo de serviço', null);
      }
    } else {
      // Usuário comum só pode atualizar desejos de seus próprios clientes
      if (client.userId !== userId) {
        return new ResponseDTO('Error', 403, 'Você não tem permissão para atualizar este desejo de serviço', null);
      }
    }
    
    // Se estiver alterando o cliente, verificar permissões para o novo cliente
    if (data.clientId && data.clientId !== existingDesireService.clientId) {
      const newClient = await clientData.getById(data.clientId);
      if (!newClient) {
        return new ResponseDTO('Error', 404, 'Cliente não encontrado', null);
      }
      
      // Verificar permissões para o novo cliente
      if (userRole === UserRole.SUPER_ADMIN) {
        // Super Admin pode usar qualquer cliente
      } else if (userRole === UserRole.ADMIN) {
        // Admin só pode usar clientes de sua empresa
        const newClientUser = await clientData.getUserById(newClient.userId);
        if (!newClientUser || newClientUser.companyId !== userCompanyId) {
          return new ResponseDTO('Error', 403, 'Sem permissão para associar este cliente', null);
        }
      } else {
        // Usuário comum só pode usar seus próprios clientes
        if (newClient.userId !== userId) {
          return new ResponseDTO('Error', 403, 'Você não tem permissão para associar este cliente', null);
        }
      }
    }
    
    // Se estiver alterando o serviço, verificar permissões para o novo serviço
    if (data.serviceId && data.serviceId !== existingDesireService.serviceId) {
      const newService = await serviceData.getById(data.serviceId);
      if (!newService) {
        return new ResponseDTO('Error', 404, 'Serviço não encontrado', null);
      }
      
      // Verificar permissões para o novo serviço
      if (userRole !== UserRole.SUPER_ADMIN && newService.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para usar serviços de outras empresas', null);
      }
    }
    
    // Validações de dados
    if (Object.keys(data).length > 0) {
      const validationResult = validatePartialDesireServiceData(data);
      if (validationResult.error) {
        return new ResponseDTO('Error', 400, validationResult.message || 'Dados inválidos', null);
      }
    }
    
    // Atualizar desejo de serviço
    const updatedDesireService = await desireServiceData.update(id, data);
    return new ResponseDTO('Success', 200, 'Desejo de serviço atualizado com sucesso', updatedDesireService);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao atualizar desejo de serviço', (error as Error).message);
  }
};

export const remove = async (id: number, userId: number, userRole: UserRole, userCompanyId: number) => {
  try {
    // Verificar se o desejo de serviço existe
    const existingDesireService = await desireServiceData.getById(id);
    if (!existingDesireService) {
      return new ResponseDTO('Error', 404, 'Desejo de serviço não encontrado', null);
    }
    
    // Buscar cliente e serviço para verificar permissões
    const client = await clientData.getById(existingDesireService.clientId);
    const service = await serviceData.getById(existingDesireService.serviceId);
    
    if (!client || !service) {
      return new ResponseDTO('Error', 404, 'Dados relacionados não encontrados', null);
    }
    
    // Verificar permissões por papel de usuário
    if (userRole === UserRole.SUPER_ADMIN) {
      // Super Admin pode remover qualquer desejo
    } else if (userRole === UserRole.ADMIN) {
      // Admin só pode remover desejos relacionados a sua empresa
      const clientUser = await clientData.getUserById(client.userId);
      if (!clientUser || clientUser.companyId !== userCompanyId || service.companyId !== userCompanyId) {
        return new ResponseDTO('Error', 403, 'Sem permissão para remover este desejo de serviço', null);
      }
    } else {
      // Usuário comum só pode remover desejos de seus próprios clientes
      if (client.userId !== userId) {
        return new ResponseDTO('Error', 403, 'Você não tem permissão para remover este desejo de serviço', null);
      }
    }
    
    // Remover desejo de serviço
    const removedDesireService = await desireServiceData.remove(id);
    return new ResponseDTO('Success', 200, 'Desejo de serviço removido com sucesso', removedDesireService);
  } catch (error) {
    return new ResponseDTO('Error', 500, 'Erro ao remover desejo de serviço', (error as Error).message);
  }
};

// Funções auxiliares para validação
function validateDesireServiceData(data: CreateDesireServiceDTO) {
  // Verificar se pelo menos um dia da semana está selecionado
  const anyDaySelected = 
    data.sunday || 
    data.monday || 
    data.tuesday || 
    data.wednesday || 
    data.thursday || 
    data.friday || 
    data.saturday;

  if (!anyDaySelected) {
    return { error: true, message: 'Pelo menos um dia da semana deve ser selecionado' };
  }
  
  // Verificar se start e end são válidos
  if (!data.start || !data.end) {
    return { error: true, message: 'As datas de início e fim são obrigatórias' };
  }
  
  // Converter para datas
  const startDate = new Date(data.start);
  const endDate = new Date(data.end);
  
  // Verificar se start é anterior a end
  if (startDate > endDate) {
    return { error: true, message: 'A data de início deve ser anterior à data de fim' };
  }
  
  return { error: false, message: '' };
}

function validatePartialDesireServiceData(data: UpdateDesireServiceDTO) {
  // Verificar datas apenas se ambas estiverem presentes
  if (data.start && data.end) {
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    
    if (startDate > endDate) {
      return { error: true, message: 'A data de início deve ser anterior à data de fim' };
    }
  }
  
  return { error: false, message: '' };
}
