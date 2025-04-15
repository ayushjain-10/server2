/**
 * @fileoverview This file contains the controller layer for question-related operations.
 * The controller layer handles HTTP requests and responses.
 * It uses the service layer to perform business logic.
 * 
 * @module controllers/questionController
 */

import { Request, Response, NextFunction } from "express";
import * as questionService from "../services/questionService";

/**
 * POST /question/addQuestion
 * Add a new question
 */
export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questionService.addQuestion(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /question/getQuestionById/:qid
 * Get question by ID
 */
export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { qid } = req.params;
    
    const question = await questionService.getQuestionById(qid);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /question/getQuestion
 * Get filtered questions
 */
export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order, search } = req.query;
    
    const questions = await questionService.getQuestions(
      order?.toString(),
      search?.toString()
    );
    
    res.json(questions);
  } catch (error) {
    next(error);
  }
};
