/**
 * @fileoverview This file contains the service layer for answer-related operations.
 * The service layer contains the business logic for the application.
 * It interacts with the repository layer and is used by the controller layer.
 * 
 * This file has been refactored to use the Repository Pattern, which abstracts
 * the data access layer from the service layer. This makes the service layer
 * independent of the underlying data storage mechanism and improves testability.
 * 
 * @module services/answerService
 * @requires ../repositories/answerRepository - Repository for answer-related operations
 */

import { answerRepository } from "../repositories/answerRepository";

/**
 * Add a new answer to a question
 * 
 * @function addAnswer
 * @param {string} qid - The ID of the question to add the answer to
 * @param {Object} answerData - The answer data to add
 * @param {string} answerData.text - The text content of the answer
 * @param {string} answerData.ans_by - Username of the person who answered
 * @param {string} answerData.ans_date_time - Date and time when the answer was posted (ISO string)
 * @returns {Promise<Record<string, unknown> | null>} Promise that resolves to the added answer as a plain object or null if the question is not found
 */
export const addAnswer = async (qid: string, answerData: {
  text: string;
  ans_by: string;
  ans_date_time: string;
}) => {
  return await answerRepository.addAnswer(qid, answerData);
};
