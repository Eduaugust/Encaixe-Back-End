import { Request, Response } from 'express';
import * as desireServiceService from '../service/desireService';
import { CreateDesireServiceDTO, UpdateDesireServiceDTO } from '../types/desireService';

export const create = async (req: Request, res: Response) => {
  try {
    // Extrair dados do usuário de forma padronizada
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    // Criar objeto com todos os campos necessários
    const desireServiceBody: CreateDesireServiceDTO = {
      morning: req.body.morning,
      afternoon: req.body.afternoon,
      start: req.body.start,
      end: req.body.end,
      sunday: req.body.sunday,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday,
      saturday: req.body.saturday,
      clientId: req.body.clientId,
      serviceId: req.body.serviceId
    };
    
    const response = await desireServiceService.create(desireServiceBody, userId, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(201).json({
        success: true,
        message: response.message || 'Desire service created successfully',
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await desireServiceService.getAll(userRole, userCompanyId, userId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await desireServiceService.getById(parseInt(id), userId, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getByClientId = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await desireServiceService.getByClientId(parseInt(clientId), userId, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getByServiceId = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await desireServiceService.getByServiceId(parseInt(serviceId), userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getByDay = async (req: Request, res: Response) => {
  try {
    const { day } = req.params;
    const response = await desireServiceService.getByDay(day);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    // Criar objeto com os campos atualizáveis
    const updateData: UpdateDesireServiceDTO = {};
    
    if (req.body.morning !== undefined) updateData.morning = req.body.morning;
    if (req.body.afternoon !== undefined) updateData.afternoon = req.body.afternoon;
    if (req.body.start !== undefined) updateData.start = req.body.start;
    if (req.body.end !== undefined) updateData.end = req.body.end;
    if (req.body.sunday !== undefined) updateData.sunday = req.body.sunday;
    if (req.body.monday !== undefined) updateData.monday = req.body.monday;
    if (req.body.tuesday !== undefined) updateData.tuesday = req.body.tuesday;
    if (req.body.wednesday !== undefined) updateData.wednesday = req.body.wednesday;
    if (req.body.thursday !== undefined) updateData.thursday = req.body.thursday;
    if (req.body.friday !== undefined) updateData.friday = req.body.friday;
    if (req.body.saturday !== undefined) updateData.saturday = req.body.saturday;
    if (req.body.clientId !== undefined) updateData.clientId = req.body.clientId;
    if (req.body.serviceId !== undefined) updateData.serviceId = req.body.serviceId;
    
    const response = await desireServiceService.update(parseInt(id), updateData, userId, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        message: response.message || 'Desire service updated successfully',
        data: response.data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Extrair userId e userRole do token decodificado
    const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await desireServiceService.remove(parseInt(id), userId, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        message: response.message || 'Desire service deleted successfully'
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
