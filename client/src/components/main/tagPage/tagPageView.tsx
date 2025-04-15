import "./tagPageView.css";
import Tag from "./tag/tagView";
import { useTagPage } from "../../../hooks/useTagPage";
import {
  VoidFunctionType,
  ClickTagFunctionType,
} from "../../../types/functionTypes";

// The type definition for the props of the TagPage component
interface TagPageProps {
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * The component that renders all the tags in the application.
 * It composed of Tag components.
 * @param param0 containing the functions to render the questions of a tag and to add a new question
 * @returns the TagPage component
 */
const TagPage = ({ clickTag, handleNewQuestion }: TagPageProps) => {
  const { tlist } = useTagPage();

  return (
    <>
      <div className="space_between right_padding">
        <div className="bold_title">{tlist.length} Tags</div>
        <div className="bold_title">All Tags</div>
        <button className="bluebtn" onClick={handleNewQuestion}>
          Ask a Question
        </button>
      </div>
      <div className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
    </>
  );
};

export default TagPage;
