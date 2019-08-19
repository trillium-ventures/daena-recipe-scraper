"use strict";
const expect = require("chai").expect;
const assert = require("chai").assert;

const ambitiousKitchen = require("../scrapers/ambitiouskitchen");
const Constants = require("./constants/ambitiouskitchenConstants");

describe("ambitiousKitchen", () => {
  it("should fetch the expected recipe", async () => {
    let actualRecipe = await ambitiousKitchen(Constants.testUrl);
    expect(JSON.stringify(Constants.expectedRecipe)).to.equal(
      JSON.stringify(actualRecipe)
    );
  });

  it("should throw an error if invalid url is used", async () => {
    try {
      await ambitiousKitchen(Constants.invalidUrl);
      assert.fail("was not supposed to succeed");
    } catch (error) {
      expect(error.message).to.equal(
        "url provided must include 'ambitiouskitchen.com'"
      );
    }
  });

  it("should throw an error if non-recipe page is used", async () => {
    try {
      await ambitiousKitchen(Constants.nonRecipeUrl);
      assert.fail("was not supposed to succeed");
    } catch (error) {
      expect(error.message).to.equal("No recipe found on page");
    }
  });
});
