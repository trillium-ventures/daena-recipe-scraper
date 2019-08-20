const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");
const puppeteerFetch = require("../helpers/puppeteerFetch");

const ambitiousKitchen = url => {
  return new Promise(async (resolve, reject) => {
    if (!url.includes("ambitiouskitchen.com")) {
      reject(new Error("url provided must include 'ambitiouskitchen.com'"));
    } else {
      try {
        let html = await puppeteerFetch(url);
        var Recipe = new RecipeSchema();
        const $ = cheerio.load(html);

        Recipe.name = $('[itemprop="name"]').text();

        $('[itemprop="ingredients"]').each((i, el) => {
          const item = $(el)
            .text()
            .replace(/\s\s+/g, "");
          Recipe.ingredients.push(item);
        });

        $('[itemprop="recipeInstructions"]').each((i, el) => {
          const step = $(el)
            .text()
            .replace(/\s\s+/g, "");
          Recipe.instructions.push(step);
        });

        Recipe.time.prep = $("time[itemprop=prepTime]").text() || "";
        Recipe.time.cook = $("time[itemprop=cookTime]").text() || "";
        Recipe.time.ready = $("time[itemprop=totalTime]").text() || "";

        if (
          !Recipe.name ||
          !Recipe.ingredients.length ||
          !Recipe.instructions.length
        ) {
          reject(new Error("No recipe found on page"));
        } else {
          resolve(Recipe);
        }
      } catch (error) {
        reject(error);
      }
    }
  });
};

module.exports = ambitiousKitchen;