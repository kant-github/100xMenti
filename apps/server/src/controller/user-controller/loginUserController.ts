import { Request, Response } from "express";

export default function loginUserController(req: Request, res: Response) {
    console.log(req.body);
    res.send('hey');
}