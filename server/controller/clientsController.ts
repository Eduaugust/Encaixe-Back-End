const clientsService = require('../service/clientsService');
import {Request, Response, NextFunction } from 'express';

exports.get = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.get(req.body.day)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}

exports.post = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.post(req.body)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}

exports.put = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.put(req.body)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}

exports.delete = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.delete(req.body)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}

exports.deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.deleteById(req.params.id)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}