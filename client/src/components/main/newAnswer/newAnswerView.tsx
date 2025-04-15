import "./newAnswerView.css";
import Form from "../baseComponents/form/formView";
import Input from "../baseComponents/input/inputView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewAnswer } from "../../../hooks/useNewAnswer";
import { QuestionIdFunctionType } from "../../../types/functionTypes";

// The type definition for the props of the NewAnswer component
interface NewAnswerProps {
  qid: string;
  handleAnswer: QuestionIdFunctionType;
}

/**
 * The component renders a form to post a new answer to a question.
 * It uses a hook to manage the state of the form and the submission of the answer.
 * When the form is submitted, the answer is saved to the database
 * and the handleAnswer function is called to render the new answer.
 * @param props contains the question id and the handleAnswer function to render the newly created answer
 * @returns the NewAnswer component
 */
const NewAnswer = ({ qid, handleAnswer }: NewAnswerProps) => {
  const { usrn, setUsrn, text, setText, usrnErr, textErr, postAnswer } =
    useNewAnswer(qid, handleAnswer);

  return (
    <Form>
      <Input
        title={"Username"}
        id={"answerUsernameInput"}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button className="form_postBtn" onClick={postAnswer}>
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
