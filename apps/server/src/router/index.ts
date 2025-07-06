import { Router } from "express";
import loginUserController from "../controller/user-controller/loginUserController";
import authMiddleware from "../middlewares/authMiddleware";
import createQuizController from "../controller/quiz-controller/createQuizController";
import getQuizController from "../controller/quiz-controller/getQuizController";
import verifyQuizOwnerMiddleware from "../middlewares/verifyQuizOwnerMiddleware";
import getHostsQuizsController from "../controller/quiz-controller/getHostsQuizsController";
import launchQuizController from "../controller/quiz-controller/launchQuizController";
import publishQuizController from "../controller/quiz-controller/publishQuizController";
import onLivePageHandler from "../controller/quiz-controller/onLivePageHandler";
import joinQuizController from "../controller/quiz-controller/joinQuizController";
import deleteQuizController from "../controller/quiz-controller/deleteQuizController";

const router: Router = Router();

router.post('/signin', loginUserController);
router.get('/test', authMiddleware);


//quiz-controller
router.post('/create-quiz', authMiddleware, createQuizController);
router.get('/get-quiz/:quizId', authMiddleware, verifyQuizOwnerMiddleware, getQuizController);
router.get('/get-owner-quizs', authMiddleware, getHostsQuizsController);
router.post('/launch-quiz/:quizId', authMiddleware, verifyQuizOwnerMiddleware, launchQuizController);
router.delete('/delete-quiz/:quizId', authMiddleware, verifyQuizOwnerMiddleware, deleteQuizController);
router.post('/publish-quiz/:quizId', authMiddleware, verifyQuizOwnerMiddleware, publishQuizController);
router.get('/live/:quizId', authMiddleware, onLivePageHandler);
router.post('/join-quiz/:sessionCode', joinQuizController);

export default router;