const { Q1_DESC, Q2_DESC, Q3_DESC, Q4_DESC, A1_TXT, A2_TXT } = require('../../../server/data/posts_strings.ts');

describe("Cypress Tests to verify all questions are displayed after creating a new question", () => {
  beforeEach(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
    // Seed the database before each test
    cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
  });

  it("Creates a new answer and checks if it should be displayed at the top of the answers page", () => {
    const answers = ["This is a test answer", A2_TXT, A1_TXT];
    cy.visit("http://localhost:3000", { timeout: 15000 });
    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("dummyUser");
    cy.get("#answerTextInput").type(answers[0]);
    cy.contains("Post Answer").click();
    cy.get(".answerText").each(($el, index) => {
      cy.wrap($el).should("contain", answers[index]);
    });
    cy.contains("dummyUser");
    cy.contains("0 seconds ago");
  });

  it("Checks that the answer is mandated when creating a new answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("dummyUser");
    cy.contains("Post Answer").click();
    cy.contains("Answer text cannot be empty");
  });

  it("Checks if the username is mandated when creating a new answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("This is testing the answer input");
    cy.contains("Post Answer").click();
    cy.contains("Username cannot be empty");
  });

  it("Verifies whether adding new answers to a question makes it 'active'", () => {
    cy.visit("http://localhost:3000");

    // add a question
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("First test question");
    cy.get("#formTextInput").type("This is the body of the test question");
    cy.get("#formTagInput").type("dummy-tag");
    cy.get("#formUsernameInput").type("dummyUser");
    cy.contains("Post Question").click();

    // add an answer to question of React Router
    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("anotherDummyUser");
    cy.get("#answerTextInput").type("This attempts to answer the question");
    cy.contains("Post Answer").click();

    // go back to main page
    cy.contains("Questions").click();

    // add an answer to question of Android Studio
    cy.contains(
      Q2_DESC
    ).click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("dummyUser2");
    cy.get("#answerTextInput").type("This attempts to answer another question");
    cy.contains("Post Answer").click();

    // go back to main page
    cy.contains("Questions").click();

    // add an answer to question A
    cy.contains("First test question").click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("dummyUserThree");
    cy.get("#answerTextInput").type("This is an answer text");
    cy.contains("Post Answer").click();

    // go back to main page
    cy.contains("Questions").click();

    // clicks active
    cy.contains("Active").click();

    const qTitles = [
      "First test question",
      Q2_DESC,
      Q1_DESC,
      Q4_DESC,
      Q3_DESC,
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});