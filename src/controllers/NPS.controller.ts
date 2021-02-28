import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUser.repository";

class NPSController {
  //Detratores = 0 a 6
  //Passivos = 7 a 8
  //Promotores = 9 a 10
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passive = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveyUsers.length;

    const calculate = Number(((promoters - detractor) / totalAnswers)*100).toFixed(2);

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NPSController };
