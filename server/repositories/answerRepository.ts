/**
 * @fileoverview This file contains the repository for answer-related operations.
 * The Repository Pattern is used to abstract the data access layer from the service layer.
 * 
 * The AnswerRepository class provides methods to interact with the Answer collection in the database.
 * It encapsulates all database operations related to answers, making the service layer independent
 * of the underlying data storage mechanism.
 * 
 * @module repositories/answerRepository
 * @requires ../models/answers - Answer model
 * @requires ../models/questions - Question model
 * @requires ../utils/documentConverter - Utility for converting MongoDB documents to plain objects
 */

import Answer from "../models/answers";
import Question from "../models/questions";
import { convertToPlainObject } from "../utils/documentConverter";

/**
 * Repository for answer-related operations
 * 
 * @class AnswerRepository
 * @description Handles all database operations related to answers
 */
export class AnswerRepository {
  /**
   * Add a new answer to a question
   * 
   * @method addAnswer
   * @param {string} qid - The ID of the question to add the answer to
   * @param {Object} answerData - The answer data to add
   * @param {string} answerData.text - The text content of the answer
   * @param {string} answerData.ans_by - Username of the person who answered
   * @param {string} answerData.ans_date_time - Date and time when the answer was posted
   * @returns {Promise<Record<string, unknown> | null>} Promise that resolves to the added answer as a plain object or null if the question is not found
   */
  async addAnswer(qid: string, answerData: {
    text: string;
    ans_by: string;
    ans_date_time: string;
  }): Promise<Record<string, unknown> | null> {
    // Create new answer
    const newAnswer = new Answer({
      text: answerData.text,
      ans_by: answerData.ans_by,
      ans_date_time: new Date(answerData.ans_date_time)
    });
    
    // Save the answer
    const savedAnswer = await newAnswer.save();
    
    // Add answer to question
    const question = await Question.findById(qid);
    
    if (!question) {
      return null;
    }
    
    await question.addAnswer(savedAnswer._id);
    
    // Convert to plain object with string IDs
    return convertToPlainObject(savedAnswer);
  }
}

// Export a singleton instance of the repository
export const answerRepository = new AnswerRepository();
