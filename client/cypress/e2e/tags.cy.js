const { Q1_DESC, Q2_DESC, Q4_DESC } = require('../../../server/data/posts_strings.ts');

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

  it("Checks if all tags exist", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    const tags = ["react", "javascript", "android-studio", "shared-preferences", "storage", "website"];
    tags.forEach(tag => {
      cy.contains(tag, { matchCase: false });
    });
  });

  it("Clicks on a tag on the homepage and verifies that the questions related to the tag are displayed", () => {
    const tagNames = "storage";

    cy.visit("http://localhost:3000");

    //clicks the 3rd tag associated with the question.
    cy.get(".question_tag_button").eq(2).click();

    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("Clicks on a tag and verifies that the tag is displayed", () => {
    const tagNames = "react";

    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();

    cy.contains(tagNames).click();
    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("Verifies that the appropriate question exists under the tag 'react'", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.contains("react").click();
    cy.contains(Q1_DESC);
  });

  it("Verifies that the appropriate question exists under the tag 'shared-preferences'", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.contains("shared-preferences").click();
    cy.contains(Q2_DESC);
    cy.contains(Q4_DESC);
  });

  it("Checks if all questions exist inside tags", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.contains("6 Tags");
    cy.contains("1 question");
    cy.contains("2 question");
  });

  it("Creates a question with tags, checks that the tags exist", () => {
    cy.visit("http://localhost:3000");

    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("This is a new question");
    cy.get("#formTextInput").type("This is a test answer to a test question");
    cy.get("#formTagInput").type("tag-test-1 tag-test-2 tag-test-3");
    cy.get("#formUsernameInput").type("dummyUser");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("tag-test-1");
    cy.contains("tag-test-2");
    cy.contains("tag-test-3");
  });

  it("Creates a new question with a new tag and finds the question through the created tag", () => {
    cy.visit("http://localhost:3000");

    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("This is a test question");
    cy.get("#formTextInput").type("This is a test answer");
    cy.get("#formTagInput").type("testing-tag");
    cy.get("#formUsernameInput").type("userName");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("testing-tag").click();
    cy.contains("This is a test question");
  });
});