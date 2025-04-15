import "./index.css";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { QuestionsPageQueryFuntionType } from "../../types/functionTypes";
// A type definition for the props of the Header component
interface HeaderProps {
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
}

/**
 * The header component for the Fake Stack Overflow application.
 * It is composed of a title and a search bar.
 * When the user types in the search bar and presses Enter, the page is set to display the search results.
 * @param param0 with the search string and the function to set the page to display the search results
 * @returns the header component
 */
const Header = ({ search, setQuestionPage }: HeaderProps) => {
  const [val, setVal] = useState<string>(search);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.currentTarget.value, "Search Results");
    }
  };

  return (
    <div id="header" className="header">
      <div></div>
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Header;
