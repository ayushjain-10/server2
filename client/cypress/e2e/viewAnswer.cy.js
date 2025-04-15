const { Q3_DESC, Q4_DESC, A7_TXT, A6_TXT, A8_TXT } = require('../../../server/data/posts_strings.ts');

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

  it("Checks if the correct answers exist on the page related to question 3", () => {
    const answers = [
      A7_TXT,
      A6_TXT,
    ];
    cy.visit("http://localhost:3000");
    cy.contains(Q3_DESC).click();
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
  });

  it("Checks if the correct answer exists in the page related to question 4", () => {
    cy.visit("http://localhost:3000");
    cy.contains(Q4_DESC).click();
    cy.contains(A8_TXT);
  });
});