import { useState } from "react";
import { addQuestion } from "../services/questionService";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * A custom hook to handle the state and logic for adding a new question.
 * It creates a new question after validating the input fields and renders the new question on the home page.
 * @param handleQuestions the function to render the new question on the home page
 * @returns the state and logic required to add a new question
 */
export const useNewQuestion = (handleQuestions: VoidFunctionType) => {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [usrn, setUsrn] = useState<string>("");

  const [titleErr, setTitleErr] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");
  const [tagErr, setTagErr] = useState<string>("");
  const [usrnErr, setUsrnErr] = useState<string>("");

  const postQuestion = async () => {
    let isValid = true;

    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    }

    const tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least one tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("More than five tags is not allowed");
      isValid = false;
    }

    for (const tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        isValid = false;
        break;
      }
    }

    const tagObjects = tags.map((tag) => ({ name: tag }));

    if (!usrn) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const question = {
      title: title,
      text: text,
      tags: tagObjects,
      asked_by: usrn,
      ask_date_time: new Date(),
    };

    const res = await addQuestion(question);
    if (res && res._id) {
      handleQuestions();
    }
  };

  return {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    usrn,
    setUsrn,
    titleErr,
    textErr,
    tagErr,
    usrnErr,
    postQuestion,
  };
};
