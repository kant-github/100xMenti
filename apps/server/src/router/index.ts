import { Router } from "express";
import loginUserController from "../controller/user-controller/loginUserController";

const router: Router = Router();

router.post('/signin', loginUserController);

export default router;