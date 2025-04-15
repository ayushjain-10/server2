/**
 * @fileoverview This file contains the error handling middleware.
 * It handles errors that occur during request processing.
 * 
 * @module middleware/errorHandler
 */

import { Request, Response } from "express";

/**
 * Error handling middleware
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 */
export const errorHandler = (
  err: Record<string, unknown>,
  req: Request,
  res: Response
) => {
  if (err.status && err.errors) {
    console.log("err", err);
    const status = typeof err.status === 'number' ? err.status : 500;
    res.status(status).json({
      message: err.message as string,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      message: err.message as string || 'Internal Server Error',
    });
  }
};
