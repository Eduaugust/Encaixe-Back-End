const userService = require('../service/userService');
import {Request, Response, NextFunction } from 'express';

exports.post = async (req: Request, res: Response, next: NextFunction) => {
    const response = await userService.post(req.body)
    if (response.type === 'Success'){
        return res.status(response.status).json(response.data);
    } else{
        return res.status(response.status).json(response)
    }
}