const clientsService = require('../service/clientsService');
import {Request, Response, NextFunction } from 'express';

exports.get = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.get()
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}

exports.getByDay = async (req: Request, res: Response, next: NextFunction) => {
    const response = await clientsService.getByDay(req.params.date)
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
    const id = parseInt(req.params?.id)
    const response = await clientsService.put(id, req.body)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}

exports.deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    const response = await clientsService.deleteById(id)
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