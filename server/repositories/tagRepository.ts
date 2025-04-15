/**
 * @fileoverview This file contains the repository for tag-related operations.
 * The Repository Pattern is used to abstract the data access layer from the service layer.
 * 
 * The TagRepository class provides methods to interact with the Tag collection in the database.
 * It encapsulates all database operations related to tags, making the service layer independent
 * of the underlying data storage mechanism.
 * 
 * @module repositories/tagRepository
 * @requires mongoose - MongoDB object modeling tool
 * @requires ../models/tags - Tag model
 */

import mongoose from "mongoose";
import Tag from "../models/tags";

/**
 * Repository for tag-related operations
 * 
 * @class TagRepository
 * @description Handles all database operations related to tags
 */
export class TagRepository {
  /**
   * Get all tags with their associated question counts
   * 
   * @method getTagsWithQuestionNumber
   * @returns {Promise<Array<{name: string, qcnt: number}>>} Promise that resolves to an array of tags with their question counts
   */
  async getTagsWithQuestionNumber(): Promise<{ name: string; qcnt: number }[]> {
    // Get all tags
    const tags = await Tag.find().exec();
    
    // For each tag, count the number of questions that have this tag
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const count = await mongoose.model('Question').countDocuments({ tags: tag._id }).exec();
        return {
          name: tag.name,
          qcnt: count
        };
      })
    );
    
    return tagsWithCounts;
  }
  
  /**
   * Find existing tags by name or create new ones if they don't exist
   * 
   * @method findOrCreateTags
   * @param {string[]} tagNames - Array of tag names to find or create
   * @returns {Promise<mongoose.Types.ObjectId[]>} Promise that resolves to an array of tag ObjectIds
   */
  async findOrCreateTags(tagNames: string[]): Promise<mongoose.Types.ObjectId[]> {
    const tags = await Tag.findOrCreateMany(tagNames);
    return tags.map(tag => new mongoose.Types.ObjectId(tag._id ? tag._id.toString() : ''));
  }
}

// Export a singleton instance of the repository
export const tagRepository = new TagRepository();
