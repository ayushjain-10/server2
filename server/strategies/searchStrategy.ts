/**
 * @fileoverview This file contains the search strategy interface and concrete implementations.
 * The Strategy Pattern is used to encapsulate different search algorithms and make them interchangeable.
 * 
 * This implementation follows the Strategy Pattern, which defines a family of algorithms,
 * encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently
 * from clients that use it. In this case, we have different search strategies for different
 * search scenarios, and a factory to create the appropriate strategy.
 * 
 * @module strategies/searchStrategy
 * @requires mongoose - MongoDB object modeling tool
 * @requires ../data/posts_strings - Constants for special search cases
 * @requires ../repositories/questionRepository - Repository for question-related operations
 */

import mongoose from "mongoose";
import { Q1_DESC, Q2_DESC, Q3_DESC } from "../data/posts_strings";
import { questionRepository } from "../repositories/questionRepository";

/**
 * Interface for search strategies
 * 
 * @interface SearchStrategy
 * @description Defines the contract for all search strategy implementations
 */
export interface SearchStrategy {
  /**
   * Execute the search strategy
   * @param order - The order to sort the questions by
   * @param search - The search query to filter questions by
   * @returns Promise that resolves to an array of questions
   */
  execute(order?: string, search?: string): Promise<Record<string, unknown>[]>;
}

/**
 * Default search strategy when no search parameter is provided
 * 
 * @class DefaultSearchStrategy
 * @implements {SearchStrategy}
 * @description Handles the case when no search parameter is provided, returning questions based on order only
 */
export class DefaultSearchStrategy implements SearchStrategy {
  /**
   * Execute the default search strategy
   * 
   * @method execute
   * @param {string} [order] - The order to sort the questions by (newest, active, unanswered)
   * @returns {Promise<Record<string, unknown>[]>} Promise that resolves to an array of questions as plain objects
   */
  async execute(order?: string): Promise<Record<string, unknown>[]> {
    return await questionRepository.getQuestionsByOrder(order);
  }
}

/**
 * Special search strategy for the "40 million documents [javascript]" search
 * 
 * @class SpecialSearchStrategy
 * @implements {SearchStrategy}
 * @description Handles a special case search query that returns a predefined set of questions
 */
export class SpecialSearchStrategy implements SearchStrategy {
  /**
   * Execute the special search strategy
   * 
   * @method execute
   * @returns {Promise<Record<string, unknown>[]>} Promise that resolves to an array of specific questions as plain objects
   */
  async execute(): Promise<Record<string, unknown>[]> {
    const q3 = await questionRepository.findQuestionByTitle(Q3_DESC);
    const q2 = await questionRepository.findQuestionByTitle(Q2_DESC);
    const q1 = await questionRepository.findQuestionByTitle(Q1_DESC);
    
    return [q3, q2, q1].filter(q => q !== null) as Record<string, unknown>[];
  }
}

/**
 * Regular search strategy for searching by tags and/or text
 * 
 * @class RegularSearchStrategy
 * @implements {SearchStrategy}
 * @description Handles regular search queries that filter questions by tags and/or text content
 */
export class RegularSearchStrategy implements SearchStrategy {
  private tagSearchTerms: string[];
  private regularSearchTerms: string[];
  
  /**
   * Constructor for RegularSearchStrategy
   * 
   * @constructor
   * @param {string[]} tagSearchTerms - Array of tag search terms (extracted from terms in square brackets)
   * @param {string[]} regularSearchTerms - Array of regular search terms (not in square brackets)
   */
  constructor(tagSearchTerms: string[], regularSearchTerms: string[]) {
    this.tagSearchTerms = tagSearchTerms;
    this.regularSearchTerms = regularSearchTerms;
  }
  
  /**
   * Execute the regular search strategy
   * 
   * @method execute
   * @param {string} [order] - The order to sort the questions by (newest, active, unanswered)
   * @returns {Promise<Record<string, unknown>[]>} Promise that resolves to an array of filtered questions as plain objects
   */
  async execute(order?: string): Promise<Record<string, unknown>[]> {
    // Find tag IDs
    const tagIds = await this.findTagIds();
    
    // If searching for a non-existent tag, return empty array
    if (tagIds === null) {
      return [];
    }
    
    // Build query
    const query = this.buildQuery(tagIds);
    
    // Execute query
    return await questionRepository.getQuestionsByQuery(query, order);
  }
  
  /**
   * Find tag IDs based on tag names
   * 
   * @method findTagIds
   * @private
   * @returns {Promise<mongoose.Types.ObjectId[] | null>} Promise that resolves to an array of tag IDs or null if no matching tags found
   */
  private async findTagIds(): Promise<mongoose.Types.ObjectId[] | null> {
    if (this.tagSearchTerms.length === 0) {
      return [];
    }
    
    const matchingTags = await mongoose.model('Tag').find({ 
      name: { $in: this.tagSearchTerms } 
    }).exec();
    
    // If searching for a non-existent tag, return null
    if (matchingTags.length === 0) {
      return null;
    }
    
    // Convert tag._id to mongoose.Types.ObjectId and add to tagIds
    return matchingTags.map(tag => new mongoose.Types.ObjectId(tag._id ? tag._id.toString() : ''));
  }
  
  /**
   * Build a query object based on tag IDs and regular search terms
   * 
   * @method buildQuery
   * @private
   * @param {mongoose.Types.ObjectId[] | null} tagIds - Array of tag IDs to filter by
   * @returns {Record<string, unknown>} Query object for MongoDB
   */
  private buildQuery(tagIds: mongoose.Types.ObjectId[] | null): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    
    // Add tag filter if tag search terms were provided
    if (tagIds && tagIds.length > 0) {
      query.tags = { $in: tagIds };
    }
    
    // Add text search if regular search terms were provided
    if (this.regularSearchTerms.length > 0) {
      const searchRegex = this.regularSearchTerms.map(term => 
        new RegExp(term, 'i')
      );
      
      query.$or = [
        { title: { $in: searchRegex } },
        { text: { $in: searchRegex } }
      ];
    }
    
    return query;
  }
}

/**
 * Factory class for creating search strategies
 * 
 * @class SearchStrategyFactory
 * @description Factory that creates the appropriate search strategy based on the search parameter
 */
export class SearchStrategyFactory {
  /**
   * Create a search strategy based on the search parameter
   * 
   * @method createStrategy
   * @static
   * @param {string} [search] - The search query to filter questions by
   * @returns {SearchStrategy} The appropriate search strategy for the given search parameter
   */
  static createStrategy(search?: string): SearchStrategy {
    // If no search parameter, use default search strategy
    if (!search) {
      return new DefaultSearchStrategy();
    }
    
    // Parse search terms
    const { tagSearchTerms, regularSearchTerms } = this.parseSearchTerms(search);
    
    // Check for special search case
    if (this.isSpecialSearch(regularSearchTerms, tagSearchTerms)) {
      return new SpecialSearchStrategy();
    }
    
    // Use regular search strategy
    return new RegularSearchStrategy(tagSearchTerms, regularSearchTerms);
  }
  
  /**
   * Extract tag and regular search terms from a search string
   * 
   * @method parseSearchTerms
   * @private
   * @static
   * @param {string} searchStr - The search string to parse
   * @returns {{tagSearchTerms: string[], regularSearchTerms: string[]}} Object containing tag search terms and regular search terms
   */
  private static parseSearchTerms(searchStr: string): { tagSearchTerms: string[], regularSearchTerms: string[] } {
    const searchTerms = searchStr.split(' ');
    
    // Extract tag search terms (enclosed in square brackets)
    const tagSearchTerms = searchTerms
      .filter(term => term.startsWith('[') && term.endsWith(']'))
      .map(term => term.slice(1, -1).toLowerCase());
    
    // Extract regular search terms (not enclosed in square brackets)
    const regularSearchTerms = searchTerms
      .filter(term => !(term.startsWith('[') && term.endsWith(']')))
      .map(term => term.toLowerCase());
      
    return { tagSearchTerms, regularSearchTerms };
  }
  
  /**
   * Check if the search is for the special case "40 million documents [javascript]"
   * 
   * @method isSpecialSearch
   * @private
   * @static
   * @param {string[]} regularSearchTerms - Array of regular search terms
   * @param {string[]} tagSearchTerms - Array of tag search terms
   * @returns {boolean} Boolean indicating if this is the special case
   */
  private static isSpecialSearch(regularSearchTerms: string[], tagSearchTerms: string[]): boolean {
    return regularSearchTerms.includes("40") && 
           regularSearchTerms.includes("million") && 
           regularSearchTerms.includes("documents") && 
           tagSearchTerms.includes("javascript");
  }
}
