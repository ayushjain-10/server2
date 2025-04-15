import "./newQuestionView.css";
import Form from "../baseComponents/form/formView";
import Input from "../baseComponents/input/inputView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewQuestion } from "../../../hooks/useNewQuestion";
import { VoidFunctionType } from "../../../types/functionTypes";

// Type definition for props passed to NewQuestion component
interface NewQuestionProps {
  handleQuestions: VoidFunctionType;
}

/**
 * The component renders the form for posting a new question.
 * It uses the useNewQuestion hook to manage the state of the form 
 * and to save the new question to the database. After saving the
 * question, it calls the handleQuestions function to update the view.
 * @param props contains the handleQuestions function to update the view which renders the new question 
 * @returns the NewQuestion component.
 */
const NewQuestion = ({ handleQuestions }: NewQuestionProps) => {
  const {
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
  } = useNewQuestion(handleQuestions);

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <Input
        title={"Username"}
        id={"formUsernameInput"}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <div className="btn_indicator_container">
        <button className="form_postBtn" onClick={postQuestion}>
          Post Question
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestion;
