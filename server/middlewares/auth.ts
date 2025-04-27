import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ResponseDTO } from '../dtos/response';

interface DecodedToken {
    id: number;
    user_type: string;
}

export const format = (req: Request, res: Response, next: NextFunction) => { 
    const authHeader = req.headers.authorization;

    if (!authHeader){
        const response = new ResponseDTO('Error',401,"Token missing");
        return res.status(401).json(response);
    }
    
    const parts = authHeader.split(' ');

    if(!(parts.length === 2)){
        const response = new ResponseDTO('Error',401,'Token error');
        return res.status(response.status).send(response);
    }
    
    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)){
        const response = new ResponseDTO('Error',401,'Token malformatted');
        return res.status(response.status).send(response);
    }
    
    jwt.verify(token, process.env.SECRET!, (err, decoded) => {
        if(err){
            const response = new ResponseDTO('Error',401,'Token invalid');
            return res.status(response.status).send(response);
        }
        
        const decodedToken = decoded as DecodedToken;
        req.body.decodedUser = {
            "id": decodedToken.id,
            "type": decodedToken.user_type
        };
        
        return next();
    });
}

export const user_admin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.decodedUser;
    if (!user || user.type !== "admin"){
        const response = new ResponseDTO('Error',401,'Not authorized');
        return res.status(response.status).json(response);
    }
    next();
}
