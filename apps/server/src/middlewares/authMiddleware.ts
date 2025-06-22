import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const reqHeaders = req.headers.authorization;
        const token = reqHeaders.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                res.status(401).json({
                    message: 'un-authorized'
                })
                return;
            }
            req.user = decoded as AuthUser;
            next();
        });
    } catch (err) {
        res.json({
            message: "Some error in middleware function"
        });
        console.log("Error in auth middleware", err);
        return;
    }
}