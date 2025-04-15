/**
 * @fileoverview This file contains the route definitions for the API.
 * It maps the routes to the appropriate controller functions.
 * 
 * @module routes
 */

import express from "express";
import * as tagController from "../controllers/tagController";
import * as questionController from "../controllers/questionController";
import * as answerController from "../controllers/answerController";

const router = express.Router();

// Tag routes
router.get('/tag/getTagsWithQuestionNumber', tagController.getTagsWithQuestionNumber);

// Question routes
router.post('/question/addQuestion', questionController.addQuestion);
router.get('/question/getQuestionById/:qid', questionController.getQuestionById);
router.get('/question/getQuestion', questionController.getQuestions);

// Answer routes
router.post('/answer/addAnswer', answerController.addAnswer);

export default router;
