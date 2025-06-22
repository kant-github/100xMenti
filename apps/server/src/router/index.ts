import { Router } from "express";
import loginUserController from "../controller/user-controller/loginUserController";
import authMiddleware from "../middlewares/authMiddleware";
import createQuizController from "../controller/quiz-controller/createQuizController";
import getQuizController from "../controller/quiz-controller/getQuizController";
import verifyQuizOwnerMiddleware from "../middlewares/verifyQuizOwnerMiddleware";

const router: Router = Router();

router.post('/signin', loginUserController);
router.get('/test', authMiddleware);


//quiz-controller
router.post('/create-quiz', authMiddleware, createQuizController);
router.get('/get-quiz/:quizId', authMiddleware, verifyQuizOwnerMiddleware, getQuizController);

export default router;