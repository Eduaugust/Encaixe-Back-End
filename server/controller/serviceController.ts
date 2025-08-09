import { Request, Response } from 'express';
import * as serviceService from '../service/serviceService';
import { CreateServiceDTO, UpdateServiceDTO } from '../types/service';

export const create = async (req: Request, res: Response) => {
  try {
    // Extrair dados do usuário de forma padronizada
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    // Descontrução do corpo da requisição com tipagem adequada
    const serviceData: CreateServiceDTO = {
      title: req.body.title,
      description: req.body.description,
      averageTime: req.body.averageTime,
      companyId: req.body.companyId
    };
    
    const response = await serviceService.create(serviceData, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(201).json({
        success: true,
        message: response.message || 'Service created successfully',
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

export const getAll = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.query;
       const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    let response;
    
    if (companyId) {
      response = await serviceService.getByCompanyId(parseInt(companyId as string), userRole, userCompanyId);
    } else {
      response = await serviceService.getAll(userRole, userCompanyId);
    }
    
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
       const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    const response = await serviceService.getById(parseInt(id), userRole, userCompanyId);
    
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
    
    // Descontrução do corpo da requisição com tipagem adequada
    const serviceData: UpdateServiceDTO = {};
    if (req.body.title !== undefined) serviceData.title = req.body.title;
    if (req.body.description !== undefined) serviceData.description = req.body.description;
    if (req.body.averageTime !== undefined) serviceData.averageTime = req.body.averageTime;
    if (req.body.companyId !== undefined) serviceData.companyId = req.body.companyId;
    
    const response = await serviceService.update(parseInt(id), serviceData, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        message: response.message || 'Service updated successfully',
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
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await serviceService.remove(parseInt(id), userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        message: response.message || 'Service deleted successfully'
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
