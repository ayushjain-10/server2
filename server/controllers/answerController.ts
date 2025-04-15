/**
 * @fileoverview This file contains the controller layer for answer-related operations.
 * The controller layer handles HTTP requests and responses.
 * It uses the service layer to perform business logic.
 * 
 * @module controllers/answerController
 */

import { Request, Response, NextFunction } from "express";
import * as answerService from "../services/answerService";

/**
 * POST /answer/addAnswer
 * Add a new answer to a question
 */
export const addAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { qid, ans } = req.body;
    
    const result = await answerService.addAnswer(qid, ans);
    
    if (!result) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};
