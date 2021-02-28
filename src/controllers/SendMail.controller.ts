import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { AppErrors } from "../errors/App.errors";
import { SurveyUser } from "../models/SurveyUser";

import { SurveyRepository } from "../repositories/Survey.repository";
import { SurveyUserRepository } from "../repositories/SurveyUser.repository";
import { UserRepository } from "../repositories/User.repository";

import SendMailService from "../services/SendMail.service";

class SendMailcontroller {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveyRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const user = await userRepository.findOne({ email });

    if (!user) {
      throw new AppErrors("User does not exist")
    }
    
    const survey = await surveyRepository.findOne({
      id: survey_id,
    });

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    if (!survey) {
      return response.status(400).json({
        error: "Survey does not exists.",
      });
    }

    const surveyUserAlreadyExists = await surveyUserRepository.findOne({
      where: { user_id: user.id, value: null },
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: surveyUserAlreadyExists.id,
      link: process.env.URL_MAIL,
    };

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    }
    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id,
    });
    await surveyUserRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailcontroller };
