import { Request, Response } from 'express';
import * as companyService from '../service/companyService';
import { CreateCompanyDTO } from '../types/company';

export const create = async (req: Request, res: Response) => {
  try {
    const companyBody: CreateCompanyDTO = {
      name: req.body.name,
      description: req.body.description
    };
    
    const { userId, userRole, userCompanyId } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const response = await companyService.create(companyBody, userRole);
    
    if (response.type === 'Success') {
      return res.status(201).json({
        success: true,
        message: response.message || 'Company created successfully',
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
    const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    const companies = await companyService.getAll(userRole, userCompanyId);
    return res.status(200).json({
      success: true,
      data: companies
    });
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
    const company = await companyService.getById(parseInt(id), userRole, userCompanyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: company
    });
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
       const { userId, userRole, userCompanyId  } = {
        userId: req.body.decodedUser.id,
        userRole: req.body.decodedUser.role,
        userCompanyId: req.body.decodedUser.companyId
    };
    
    const company: CreateCompanyDTO = {
      name: req.body.name,
      description: req.body.description
    }
    
    const response = await companyService.update(parseInt(id), company, userRole, userCompanyId);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        message: response.message || 'Company updated successfully',
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
    
    const response = await companyService.remove(parseInt(id), userRole);
    
    if (response.type === 'Success') {
      return res.status(200).json({
        success: true,
        message: response.message || 'Company deleted successfully'
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
