/**
 * @fileoverview This file contains the repository for question-related operations.
 * The Repository Pattern is used to abstract the data access layer from the service layer.
 * 
 * The QuestionRepository class provides methods to interact with the Question collection in the database.
 * It encapsulates all database operations related to questions, making the service layer independent
 * of the underlying data storage mechanism.
 * 
 * @module repositories/questionRepository
 * @requires mongoose - MongoDB object modeling tool
 * @requires ../models/questions - Question model
 * @requires ../utils/documentConverter - Utility for converting MongoDB documents to plain objects
 */

import mongoose from "mongoose";
import Question from "../models/questions";
import { convertToPlainObject } from "../utils/documentConverter";

/**
 * Repository for question-related operations
 * 
 * @class QuestionRepository
 * @description Handles all database operations related to questions
 */
export class QuestionRepository {
  /**
   * Add a new question to the database
   * 
   * @method addQuestion
   * @param {Object} questionData - The question data to add
   * @param {string} questionData.title - The title of the question
   * @param {string} questionData.text - The text content of the question
   * @param {mongoose.Types.ObjectId[]} questionData.tags - Array of tag IDs associated with the question
   * @param {string} questionData.asked_by - Username of the person who asked the question
   * @param {Date} questionData.ask_date_time - Date and time when the question was asked
   * @returns {Promise<Record<string, unknown>>} Promise that resolves to the added question as a plain object
   */
  async addQuestion(questionData: {
    title: string;
    text: string;
    tags: mongoose.Types.ObjectId[];
    asked_by: string;
    ask_date_time: Date;
  }): Promise<Record<string, unknown>> {
    // Create new question
    const newQuestion = new Question({
      title: questionData.title,
      text: questionData.text,
      tags: questionData.tags,
      asked_by: questionData.asked_by,
      ask_date_time: questionData.ask_date_time,
      views: 0,
      answers: []
    });
    
    // Save the question
    const savedQuestion = await newQuestion.save();
    
    // Populate tags for response
    await savedQuestion.populate('tags');
    
    // Convert to plain object with string IDs
    return convertToPlainObject(savedQuestion);
  }
  
  /**
   * Get a question by ID and increment its views
   * 
   * @method getQuestionById
   * @param {string} qid - The ID of the question to get
   * @returns {Promise<Record<string, unknown> | null>} Promise that resolves to the question as a plain object or null if not found
   */
  async getQuestionById(qid: string): Promise<Record<string, unknown> | null> {
    // Find question by ID and increment views
    const question = await Question.findByIdAndIncrementViews(qid);
    
    if (!question) {
      return null;
    }
    
    // Convert to plain object with string IDs
    return convertToPlainObject(question);
  }
  
  /**
   * Get questions by a specific query with ordering
   * 
   * @method getQuestionsByQuery
   * @param {Record<string, unknown>} query - The query object for MongoDB
   * @param {string} [order] - The order to sort the questions by (newest, active, unanswered)
   * @returns {Promise<Record<string, unknown>[]>} Promise that resolves to an array of questions as plain objects
   */
  async getQuestionsByQuery(query: Record<string, unknown>, order?: string): Promise<Record<string, unknown>[]> {
    let rawQuestions;
    
    switch (order) {
      case 'active': {
        // For active order, we need to get all questions and then sort by activity
        const allQuestions = await Question.find(query)
          .populate('tags')
          .populate('answers')
          .exec();
          
        // Sort by most recent activity
        rawQuestions = allQuestions.sort((a, b) => {
          const dateA = a.mostRecentActivity instanceof Date ? a.mostRecentActivity : new Date(a.mostRecentActivity);
          const dateB = b.mostRecentActivity instanceof Date ? b.mostRecentActivity : new Date(b.mostRecentActivity);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      }
        
      case 'unanswered':
        // For unanswered order, filter questions with no answers
        rawQuestions = await Question.find({
          ...query,
          answers: { $size: 0 }
        })
          .sort({ ask_date_time: -1 })
          .populate('tags')
          .exec();
        break;
        
      default:
        // Default to newest
        rawQuestions = await Question.find(query)
          .sort({ ask_date_time: -1 })
          .populate('tags')
          .exec();
    }
    
    // Convert MongoDB documents to plain objects and ensure _id is a string
    return rawQuestions.map(q => convertToPlainObject(q));
  }
  
  /**
   * Get questions based on order without search criteria
   * 
   * @method getQuestionsByOrder
   * @param {string} [order] - The order to sort the questions by (newest, active, unanswered)
   * @returns {Promise<Record<string, unknown>[]>} Promise that resolves to an array of questions as plain objects
   */
  async getQuestionsByOrder(order?: string): Promise<Record<string, unknown>[]> {
    let rawQuestions;
    
    switch (order) {
      case 'newest':
        rawQuestions = await Question.getNewestQuestions();
        break;
        
      case 'unanswered':
        rawQuestions = await Question.getUnansweredQuestions();
        break;
        
      case 'active':
        rawQuestions = await Question.getActiveQuestions();
        break;
        
      default:
        rawQuestions = await Question.getNewestQuestions();
    }
    
    // Convert MongoDB documents to plain objects and ensure _id is a string
    return rawQuestions.map(q => convertToPlainObject(q));
  }
  
  /**
   * Find a question by its exact title
   * 
   * @method findQuestionByTitle
   * @param {string} title - The title to search for
   * @returns {Promise<Record<string, unknown> | null>} Promise that resolves to the question as a plain object or null if not found
   */
  async findQuestionByTitle(title: string): Promise<Record<string, unknown> | null> {
    const question = await Question.findOne({ title }).populate('tags').exec();
    if (!question) return null;
    return convertToPlainObject(question);
  }
}

// Export a singleton instance of the repository
export const questionRepository = new QuestionRepository();
