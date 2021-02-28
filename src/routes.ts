import { Router } from "express";
import { Answercontroller } from "./controllers/Answer.controller";
import { NPSController } from "./controllers/NPS.controller";
import { SendMailcontroller } from "./controllers/SendMail.controller";
import { SurveyController } from "./controllers/Survey.controller";
import { UserController } from "./controllers/User.controller";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailcontroller();
const answercontroller = new Answercontroller();
const npsController = new NPSController();

router.post("/users", userController.create);
router.get("/users", userController.show);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answercontroller.execute);

router.get("/nps/:survey_id", npsController.execute);

export { router };
