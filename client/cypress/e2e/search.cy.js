const {
  Q4_DESC,
  Q3_DESC,
  Q2_DESC,
  Q1_DESC,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
} = require("../../../server/data/posts_strings.ts");

describe("Verify searching", () => {
  beforeEach(() => {
    cy.exec(
      "npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so"
    );
    cy.exec(
      "npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so"
    );
  });

  afterEach(() => {
    cy.exec(
      "npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so"
    );
  });

  it("Search for a question using text content that does not exist", () => {
    const searchText = "Quantum Computing";

    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type(`${searchText}{enter}`);
    cy.get(".postTitle").should("have.length", 0);
  });

  it("Search for a question by a unique phrase", () => {
    const qTitles = [Q3_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("40 million documents{enter}");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search for a question by a unique phrase and tags", () => {
    const qTitles = [Q3_DESC, Q2_DESC, Q1_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("40 million documents [javascript]{enter}");
    cy.contains(`${qTitles.length} Questions`, {matchCase: false}).should("exist");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search string in a specific question text", () => {
    const qTitles = [Q4_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("data remains unequivocally{enter}");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag ([react])", () => {
    const qTitles = [Q1_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[react]{enter}");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag ([javascript])", () => {
    const qTitles = [Q2_DESC, Q1_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[javascript]{enter}");
    cy.contains(`${qTitles.length} Questions`, {matchCase: false}).should("exist");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search active questions by tag ([javascript])", () => {
    const qTitles = [Q1_DESC, Q2_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[javascript]{enter}");
    cy.contains("Active").click();
    cy.contains(`${qTitles.length} Questions`, {matchCase: false}).should("exist");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search uanswered questions by tag ([javascript])", () => {
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[javascript]{enter}");
    cy.contains("Unanswered").click();
    cy.contains("0 Question", {matchCase: false}).should("exist");
    cy.get(".postTitle").should('have.length', 0); 
  });

  it("Search a question by tag ([android-studio])", () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[android-studio]{enter}");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag ([shared-preferences])", () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[shared-preferences]{enter}");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search active question by tag ([shared-preferences])", () => {
    const qTitles = [Q2_DESC, Q4_DESC];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[shared-preferences]{enter}");
    cy.contains("Active").click();
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search unanswered question by tag ([shared-preferences])", () => {
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[shared-preferences]{enter}");
    cy.contains("Unanswered").click();
    cy.contains("0 Question", {matchCase: false}).should("exist");
    cy.get(".postTitle").should("have.length", 0);
  });

  it("Search for a question using a tag that does not exist", () => {
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[nonExistentTag]{enter}");
    cy.get(".postTitle").should("have.length", 0);
  });

  it("Search by tag from new question page", () => {
    const qTitles = [Q2_DESC, Q1_DESC];
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#searchBar").type("[javascript]{enter}");
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search by text from Tags page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.get("#searchBar").type("40 million documents{enter}");
    cy.get(".postTitle").should("have.length", 1);
  });
});
