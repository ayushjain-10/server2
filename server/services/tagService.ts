/**
 * @fileoverview This file contains the service layer for tag-related operations.
 * The service layer contains the business logic for the application.
 * It interacts with the repository layer and is used by the controller layer.
 * 
 * This file has been refactored to use the Repository Pattern, which abstracts
 * the data access layer from the service layer. This makes the service layer
 * independent of the underlying data storage mechanism and improves testability.
 * 
 * @module services/tagService
 * @requires ../repositories/tagRepository - Repository for tag-related operations
 */

import { tagRepository } from "../repositories/tagRepository";

/**
 * Get all tags with their question counts
 * 
 * @function getTagsWithQuestionNumber
 * @returns {Promise<Array<{name: string, qcnt: number}>>} Promise that resolves to an array of tags with their question counts
 */
export const getTagsWithQuestionNumber = async () => {
  return await tagRepository.getTagsWithQuestionNumber();
};

/**
 * Find existing tags by name or create new ones if they don't exist
 * 
 * @function findOrCreateTags
 * @param {string[]} tagNames - Array of tag names to find or create
 * @returns {Promise<mongoose.Types.ObjectId[]>} Promise that resolves to an array of tag ObjectIds
 */
export const findOrCreateTags = async (tagNames: string[]) => {
  return await tagRepository.findOrCreateTags(tagNames);
};
