import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppErrors } from "../errors/App.errors";
import { SurveyUserRepository } from "../repositories/SurveyUser.repository";

class Answercontroller {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      throw new AppErrors("Survey User does not exists")
    }

    surveyUser.value = Number(value);

    await surveyUserRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { Answercontroller };
