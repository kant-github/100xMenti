import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";


export default async function loginUserController(req: Request, res: Response) {
    const { user, account } = req.body;
    console.log("user : ", user);
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        let myUser;
        if (existingUser) {
            myUser = await prisma.user.update({
                where: {
                    email: user.email!
                },
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: account.provider
                }
            })
        } else {
            myUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: account.provider
                }
            })
        }

        const jwtPayload = {
            name: myUser.name,
            email: myUser.email,
            id: myUser.id,
        };
        const secret = process.env.JWT_SECRET
        console.log("secret loaded : ", secret);
        const token = jwt.sign(jwtPayload, secret);
        console.log("token is : ", token);
        console.log("my user is : ", myUser);
        res.json({
            success: true,
            user: myUser,
            token: token
        });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Authentication failed"
        });
        return;
    }
}