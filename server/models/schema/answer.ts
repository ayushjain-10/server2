import mongoose from "mongoose";
import { IAnswerDocument, IAnswerModel } from "../../types/types";

/**
 * The schema for a document in the Answer collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel> (
  {
    text: {
      type: String,
      required: true
    },
    ans_by: {
      type: String,
      required: true
    },
    ans_date_time: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { collection: "Answer" }
);

/**
 * Static method to get the most recent answer for a list of answer IDs
 * @param answers - Array of answer IDs
 * @returns Promise that resolves to an array of answer documents
 */
AnswerSchema.static('getMostRecent', async function(answers: mongoose.Types.ObjectId[]) {
  if (!answers || answers.length === 0) {
    return [];
  }
  
  return this.find({ _id: { $in: answers } })
    .sort({ ans_date_time: -1 })
    .limit(1)
    .exec();
});

/**
 * Static method to get the latest answer date from a list of answer documents
 * @param answers - Array of answer documents
 * @returns Promise that resolves to the latest answer date or undefined if no answers
 */
AnswerSchema.static('getLatestAnswerDate', async function(answers) {
  if (!answers || answers.length === 0) {
    return undefined;
  }
  
  // Sort answers by date in descending order and return the first one's date
  const sortedAnswers = [...answers].sort((a, b) => {
    const dateA = a.ans_date_time instanceof Date ? a.ans_date_time : new Date(a.ans_date_time);
    const dateB = b.ans_date_time instanceof Date ? b.ans_date_time : new Date(b.ans_date_time);
    return dateB.getTime() - dateA.getTime();
  });
  
  const latestAnswer = sortedAnswers[0];
  return latestAnswer.ans_date_time instanceof Date 
    ? latestAnswer.ans_date_time 
    : new Date(latestAnswer.ans_date_time);
});

export default AnswerSchema;
