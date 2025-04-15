/**
 * @fileoverview This file contains utility functions for converting Mongoose documents to plain objects.
 * 
 * The utility functions in this file are used to convert Mongoose documents to plain JavaScript objects
 * with string IDs instead of ObjectId instances. This is necessary because the client expects string IDs,
 * not ObjectId instances. This file centralizes the conversion logic to avoid code duplication across services.
 * 
 * @module utils/documentConverter
 * @requires mongoose - MongoDB object modeling tool
 */

import mongoose from "mongoose";

/**
 * Convert MongoDB document to plain object with string IDs
 * 
 * This function converts Mongoose documents to plain JavaScript objects with string IDs
 * instead of ObjectId instances. It handles nested objects and arrays, ensuring all ObjectIds
 * are converted to strings. This is necessary because the client expects string IDs, not ObjectId instances.
 * 
 * @function convertToPlainObject
 * @param {unknown} doc - The Mongoose document or object to convert
 * @returns {Record<string, unknown>} A plain JavaScript object with string IDs
 */
export const convertToPlainObject = (doc: unknown): Record<string, unknown> => {
  // Convert Mongoose document to plain JavaScript object
  const plainObj = typeof doc === 'object' && doc !== null && 'toObject' in doc && typeof doc.toObject === 'function'
    ? doc.toObject()
    : JSON.parse(JSON.stringify(doc));
  
  // Convert _id to string
  if (plainObj._id) {
    plainObj._id = plainObj._id.toString();
  }
  
  // Convert tag _ids to strings
  if (plainObj.tags && Array.isArray(plainObj.tags)) {
    plainObj.tags = plainObj.tags.map((tag: Record<string, unknown>) => {
      if (tag && typeof tag === 'object' && tag._id) {
        return {
          ...tag,
          _id: tag._id.toString()
        };
      }
      return tag;
    });
  }
  
  // Convert answer _ids to strings
  if (plainObj.answers && Array.isArray(plainObj.answers)) {
    plainObj.answers = plainObj.answers.map((answer: unknown) => {
      if (answer && typeof answer === 'object' && '_id' in (answer as Record<string, unknown>)) {
        return {
          ...(answer as Record<string, unknown>),
          _id: ((answer as Record<string, unknown>)._id as mongoose.Types.ObjectId).toString()
        };
      } else if (answer) {
        return String(answer);
      }
      return answer;
    });
  }
  
  return plainObj;
};
