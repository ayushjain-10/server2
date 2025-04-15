import mongoose from "mongoose";
import { IQuestionDocument, IQuestionModel } from "../../types/types";

/**
 * The schema for a document in the Question collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQQuestionDocument is used to define the instance methods of the Question document.
 * IQuestionModel is used to define the static methods of the Question model.
*/
const QuestionSchema = new mongoose.Schema<IQuestionDocument, IQuestionModel>(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    asked_by: {
      type: String,
      required: true
    },
    ask_date_time: {
      type: Date,
      required: true,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    },
    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }]
  },
  { collection: "Question" }
);

/**
 * Virtual property to check if a question has answers
 * @returns Boolean indicating if the question has answers
 */
QuestionSchema.virtual('hasAnswers').get(function() {
  return this.answers && this.answers.length > 0;
});

/**
 * Virtual property to get the most recent activity date (either question date or latest answer date)
 * @returns Date of the most recent activity
 */
QuestionSchema.virtual('mostRecentActivity').get(function() {
  if (!this.hasAnswers) {
    return this.ask_date_time;
  }
  
  // Find the most recent answer date
  const answerDates: Date[] = [];
  
  // Handle populated answers (full objects)
  this.answers.forEach(answer => {
    if (typeof answer === 'object' && answer !== null) {
      if ('ans_date_time' in answer) {
        // Direct access to ans_date_time
        const ansDate = (answer as { ans_date_time: Date | string }).ans_date_time;
        answerDates.push(new Date(ansDate));
      } else if (mongoose.isValidObjectId(answer)) {
        // It's just an ObjectId reference, use question date as fallback
        answerDates.push(this.ask_date_time);
      }
    }
  });
  
  if (answerDates.length === 0) {
    return this.ask_date_time;
  }
  
  // Find the most recent date
  const latestAnswerDate = new Date(Math.max(...answerDates.map(date => date.getTime())));
  
  // Return the latest between question date and latest answer date
  return latestAnswerDate > this.ask_date_time ? latestAnswerDate : this.ask_date_time;
});

/**
 * Instance method to increment the views of a question
 * @returns Promise that resolves to the updated question document
 */
QuestionSchema.method('incrementViews', async function() {
  this.views += 1;
  return this.save();
});

/**
 * Instance method to add an answer to a question
 * @param answerId - The ID of the answer to add
 * @returns Promise that resolves to the updated question document
 */
QuestionSchema.method('addAnswer', async function(answerId: mongoose.Types.ObjectId) {
  this.answers.push(answerId);
  return this.save();
});

/**
 * Static method to get all questions sorted by newest first
 * @returns Promise that resolves to an array of question documents
 */
QuestionSchema.static('getNewestQuestions', async function() {
  return this.find()
    .sort({ ask_date_time: -1 })
    .populate('tags')
    .exec();
});

/**
 * Static method to get all questions that have no answers, sorted by newest first
 * @returns Promise that resolves to an array of question documents
 */
QuestionSchema.static('getUnansweredQuestions', async function() {
  return this.find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .populate('tags')
    .exec();
});

/**
 * Static method to get all questions sorted by most recent activity
 * @returns Promise that resolves to an array of question documents
 */
QuestionSchema.static('getActiveQuestions', async function() {
  // First, get all questions with their answers
  const questions = await this.find()
    .populate('tags')
    .populate('answers')
    .exec();
  
  // Sort questions by most recent activity (either question date or latest answer date)
  // This ensures questions with recent answers appear first
  const sortedQuestions = questions.sort((a, b) => {
    const dateA = a.mostRecentActivity instanceof Date ? a.mostRecentActivity : new Date(a.mostRecentActivity);
    const dateB = b.mostRecentActivity instanceof Date ? b.mostRecentActivity : new Date(b.mostRecentActivity);
    return dateB.getTime() - dateA.getTime();
  });
  
  return sortedQuestions;
});

/**
 * Static method to find a question by ID and increment its views
 * @param qid - The ID of the question to find
 * @returns Promise that resolves to the updated question document or null if not found
 */
QuestionSchema.static('findByIdAndIncrementViews', async function(qid: string) {
  const question = await this.findById(qid)
    .populate('tags')
    .populate({
      path: 'answers',
      options: { sort: { 'ans_date_time': -1 } } // Sort answers by newest first
    })
    .exec();
  
  if (!question) {
    return null;
  }
  
  await question.incrementViews();
  return question;
});

export default QuestionSchema;
