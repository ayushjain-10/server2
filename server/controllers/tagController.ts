/**
 * @fileoverview This file contains the controller layer for tag-related operations.
 * The controller layer handles HTTP requests and responses.
 * It uses the service layer to perform business logic.
 * 
 * @module controllers/tagController
 */

import { Request, Response, NextFunction } from "express";
import * as tagService from "../services/tagService";

/**
 * GET /tag/getTagsWithQuestionNumber
 * Get all tags with their question counts
 */
export const getTagsWithQuestionNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagsWithCounts = await tagService.getTagsWithQuestionNumber();
    res.json(tagsWithCounts);
  } catch (error) {
    next(error);
  }
};
