/**
 * @fileoverview This file contains the service layer for question-related operations.
 * The service layer contains the business logic for the application.
 * It interacts with the repository layer and is used by the controller layer.
 * 
 * This file has been refactored to use the Repository Pattern and Strategy Pattern.
 * The Repository Pattern abstracts the data access layer, while the Strategy Pattern
 * encapsulates different search algorithms and makes them interchangeable.
 * 
 * @module services/questionService
 * @requires ../repositories/questionRepository - Repository for question-related operations
 * @requires ../repositories/tagRepository - Repository for tag-related operations
 * @requires ../strategies/searchStrategy - Search strategies for different search scenarios
 */

import { questionRepository } from "../repositories/questionRepository";
import { tagRepository } from "../repositories/tagRepository";
import { SearchStrategyFactory } from "../strategies/searchStrategy";

/**
 * Add a new question
 * 
 * @function addQuestion
 * @param {Object} questionData - The question data to add
 * @param {string} questionData.title - The title of the question
 * @param {string} questionData.text - The text content of the question
 * @param {Array<{name: string}>} questionData.tags - Array of tag objects with name property
 * @param {string} questionData.asked_by - Username of the person who asked the question
 * @param {string} questionData.ask_date_time - Date and time when the question was asked (ISO string)
 * @returns {Promise<Record<string, unknown>>} Promise that resolves to the added question as a plain object
 */
export const addQuestion = async (questionData: {
  title: string;
  text: string;
  tags: { name: string }[];
  asked_by: string;
  ask_date_time: string;
}) => {
  const { title, text, tags, asked_by, ask_date_time } = questionData;
  
  // Find or create tags
  const tagNames = tags.map((tag: { name: string }) => tag.name);
  const createdTagIds = await tagRepository.findOrCreateTags(tagNames);
  
  // Create new question
  return await questionRepository.addQuestion({
    title,
    text,
    tags: createdTagIds,
    asked_by,
    ask_date_time: new Date(ask_date_time)
  });
};

/**
 * Get a question by ID and increment its views
 * 
 * @function getQuestionById
 * @param {string} qid - The ID of the question to get
 * @returns {Promise<Record<string, unknown> | null>} Promise that resolves to the question as a plain object or null if not found
 */
export const getQuestionById = async (qid: string) => {
  return await questionRepository.getQuestionById(qid);
};

/**
 * Get questions based on search and order parameters
 * 
 * @function getQuestions
 * @param {string} [order] - The order to sort the questions by (newest, active, unanswered)
 * @param {string} [search] - The search query to filter questions by
 * @returns {Promise<Record<string, unknown>[]>} Promise that resolves to an array of questions as plain objects
 */
export const getQuestions = async (order?: string, search?: string) => {
  // Use the Strategy Pattern to handle different search strategies
  const searchStrategy = SearchStrategyFactory.createStrategy(search);
  return await searchStrategy.execute(order, search);
};
