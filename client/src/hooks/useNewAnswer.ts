import { useState } from "react";
import { addAnswer } from "../services/answerService";
import { QuestionIdFunctionType } from "../types/functionTypes";

/**
 * A custom hook to create a new answer. 
 * The hook also validates the input fields and displays error messages if the fields are empty.
 * If the answer is successfully created, the new answer is rendered on the question page.
 * @param qid the question id for which the answer is being created
 * @param handleAnswer the function to render the new answer on the question page
 * @returns the username, answer text, error messages, and a function to post the answer
 */
export const useNewAnswer = (
  qid: string,
  handleAnswer: QuestionIdFunctionType
) => {
  const [usrn, setUsrn] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [usrnErr, setUsrnErr] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");

  const postAnswer = async () => {
    let isValid = true;

    if (!usrn) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    }

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer = {
      text: text,
      ans_by: usrn,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };

  return {
    usrn,
    setUsrn,
    text,
    setText,
    usrnErr,
    textErr,
    postAnswer,
  };
};
