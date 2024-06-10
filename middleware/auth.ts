import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const config = process.env;

if (!config.TOKEN_KEY) {
    throw new Error('TOKEN_KEY is not defined in the environment variables');
}

interface DecodedToken {
    [key: string]: any;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] as string;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY as string) as DecodedToken;
        (req as any).user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};
