const { Q1_DESC, Q2_DESC, Q3_DESC, Q4_DESC, A1_TXT, A2_TXT } = require('../../../server/data/posts_strings.ts');

describe("Cypress Tests to verify that all questions are being displayed", () => {
  beforeEach(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
    // Seed the database before each test
    cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
  });

  it("verifies questions are displayed in chronological order (newest first)", () => {
    const expectedQuestions = [
      Q4_DESC,  // Quick question about storage on android
      Q3_DESC,  // Object storage for a web application
      Q2_DESC,  // android studio save string shared preference
      Q1_DESC   // Programmatically navigate using React router
    ];

    cy.visit("http://localhost:3000");
    
    // Verify each question title matches expected order
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el)
        .should("be.visible")
        .and("contain", expectedQuestions[index]);
    });

    // Additional verification for content
    cy.get(".postTitle").first()
      .should("contain", "Quick question about storage on android");
  });

  it("verifies questions display in activity order when 'Active' is selected", () => {
    const expectedActiveOrder = [
      Q1_DESC,  // Most recent activity
      Q2_DESC,  // android studio related
      Q4_DESC,  // android storage question
      Q3_DESC   // Object storage question
    ];

    cy.visit("http://localhost:3000");
    
    // Click the Active sort option
    cy.contains("Active").click();

    // Verify questions are in correct activity order
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el)
        .should("be.visible")
        .and("contain", expectedActiveOrder[index]);
    });
  });
});