import { useEffect, useState } from "react";
import { getQuestionById } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";

/**
 * The custom hook is used to fetch a question by its id.
 * @param qid the id of the question to fetch
 * @returns the state of the question viewer component.
 */
export const useAnswerPage = (qid: string) => {
  const [question, setQuestion] = useState<QuestionResponseType | null>(null);

  /**
   * A useEffect hook in React is used to manage side effects of a component.
   * A side effect is an operation that interacts with the outside world, e.g., an API call.
   * The hook ensures that the side effect is executed when the component is rendered and only when its dependencies change.
   * 
   * In this case, the hook will execute only when the question is rendered and if the question id changes.
   * The question id is passed as a dependency to the hook.
   * 
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionById(qid);
        setQuestion(res || null);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchData();
  }, [qid]);

  return { question };
};
