const { Q1_DESC, Q2_DESC, Q3_DESC, Q4_DESC, A1_TXT, A2_TXT } = require('../../../server/data/posts_strings.ts');

describe("Question display and creation tests", () => {
  // Test data
  const testQuestions = [
    { title: "Test Question Alpha", text: "Alpha question content", tag: "python", username: "user1" },
    { title: "Test Question Beta", text: "Beta question content", tag: "react", username: "user2" },
    { title: "Test Question Gamma", text: "Gamma question content", tag: "java", username: "user3" }
  ];

  const expectedMetadata = {
    answers: ["0 answers", "1 answers", "2 answers", "3 answers", "2 answers"],
    views: ["0 views", "103 views", "200 views", "121 views", "10 views"]  // Matching original test values
  };

  // Helper functions
  const addQuestion = (question) => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(question.title);
    cy.get("#formTextInput").type(question.text);
    cy.get("#formTagInput").type(question.tag);
    cy.get("#formUsernameInput").type(question.username);
    cy.contains("Post Question").click();
  };

  const addAnswer = (questionTitle, answer) => {
    cy.contains(questionTitle).click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type(answer.username);
    cy.get("#answerTextInput").type(answer.text);
    cy.contains("Post Answer").click();
  };

  const verifyQuestionTitles = (expectedTitles) => {
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", expectedTitles[index]);
    });
  };

  beforeEach(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
    cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
    cy.visit("http://localhost:3000");
  });

  afterEach(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
  });

  it('Shows correct questions in unanswered section after adding questions and answers', () => {
    // Add three questions in sequence (matching original test)
    const sequentialQuestions = [
      { title: "Test Question A", text: "Test Question A Text", tag: "javascript", username: "mks1" },
      { title: "Test Question B", text: "Test Question B Text", tag: "javascript", username: "mks2" },
      { title: "Test Question C", text: "Test Question C Text", tag: "javascript", username: "mks3" }
    ];

    sequentialQuestions.forEach(addQuestion);

    // Add answer to first question
    addAnswer(sequentialQuestions[0].title, {
      username: "abc3",
      text: "Answer Question A"
    });

    cy.contains("Questions").click();
    cy.contains("Unanswered").click();

    verifyQuestionTitles([
      sequentialQuestions[2].title,
      sequentialQuestions[1].title
    ]);
  });

  it("Displays all questions in correct order with existing questions", () => {
    // Add three questions in sequence (matching original test)
    const orderedQuestions = [
      { title: "Test Question 1", text: "Test Question 1 Text", tag: "javascript", username: "joym" },
      { title: "Test Question 2", text: "Test Question 2 Text", tag: "react", username: "abhi" },
      { title: "Test Question 3", text: "Test Question 3 Text", tag: "java", username: "abhi" }
    ];

    orderedQuestions.forEach(addQuestion);

    // Verify all questions including existing ones
    const expectedTitles = [
      orderedQuestions[2].title,
      orderedQuestions[1].title,
      orderedQuestions[0].title,
      Q4_DESC,
      Q3_DESC,
      Q2_DESC,
      Q1_DESC
    ];

    verifyQuestionTitles(expectedTitles);

    // Verify unanswered questions
    cy.contains("Unanswered").click();
    verifyQuestionTitles([
      orderedQuestions[2].title,
      orderedQuestions[1].title,
      orderedQuestions[0].title
    ]);
  });

  it("Displays proper metadata for newly created question", () => {
    const newQuestion = {
      title: "Test Question Q1",
      text: "Test Question Q1 Text T1",
      tag: "javascript",
      username: "new user 32"
    };

    addQuestion(newQuestion);

    // Verify question count and timestamp
    cy.contains("Fake Stack Overflow");
    cy.contains("5 questions");
    cy.contains(`${newQuestion.username} asked 0 seconds ago`);

    // Verify stats for all questions
    cy.get(".postStats").each(($el, index) => {
      cy.wrap($el)
        .should("contain", expectedMetadata.answers[index])
        .and("contain", expectedMetadata.views[index]);
    });

    // Verify unanswered section
    cy.contains("Unanswered").click();
    cy.get(".postTitle").should("have.length", 1);
    cy.contains("1 question");
  });

  it("Validates empty title submission", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("new user 32");
    cy.contains("Post Question").click();
    
    cy.contains("Title cannot be empty", { matchCase: false });
  });

  it("Validates empty text submission", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("new user 32");
    cy.contains("Post Question").click();
    
    cy.contains("Text cannot be empty", { matchCase: false });
  });

  it("Validates empty tag submission", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formUsernameInput").type("new user 32");
    cy.contains("Post Question").click();
    
    cy.contains("Should have at least one tag", { matchCase: false });
  });

  it("Validates empty username submission", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    
    cy.contains("Username cannot be empty", { matchCase: false });
  });

  it("Validates tag count is limited to 5", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript python java c++ ruby html");
    cy.get("#formUsernameInput").type("new user 32");
    cy.contains("Post Question").click();

    cy.contains("More than five tags is not allowed", { matchCase: false });
  });

  it("Validates new tag length is limited to 20 characters", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript12345678901234567890");
    cy.get("#formUsernameInput").type("new user 32");
    cy.contains("Post Question").click();

    cy.contains("New tag length cannot be more than 20", { matchCase: false });
  });

  it("Validates question title length is limited to 100 characters", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("This is a sample string for you. It is exactly one hundred and ten characters long. I hope this is useful!");
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("new user 32");
    cy.contains("Post Question").click();

    cy.contains("Title cannot be more than 100 characters", { matchCase: false });
  });
});