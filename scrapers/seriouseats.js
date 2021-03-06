const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const seriousEats = url => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("seriouseats.com/")) {
      reject(new Error("url provided must include 'seriouseats.com/'"));
    } else {
      request(url, (error, response, html) => {
        if (!error && response.statusCode === 200) {
          const $ = cheerio.load(html);
          console.log("GOT A 200 response! All good!")
          if (url.includes("seriouseats.com/sponsored/")) {
            reject(
              new Error("seriouseats.com sponsored recipes not supported")
            );
          } else {
            //regularRecipe($, Recipe);
            console.log("IN ELSE LOOP, HERE IS INITIAL RECIPE: ", Recipe);
            // Recipe.name = $("meta[property='og:title']").attr("content")
            // .text()
            // .replace(/\s\s+/g, "");

            Recipe.image = $("meta[property='og:image']").attr("content");

          //   $(".ingredient").each((i, el) => {
          //     const item = $(el).text();
          //     Recipe.ingredients.push(item);
          //   });

          //   $(".recipe-about")
          //   .children("li")
          //   .each((i, el) => {
          //     const label = $(el)
          //       .children(".label")
          //       .text();
          //     const info = $(el)
          //       .children(".info")
          //       .text();
        
          //     if (label.includes("Active")) {
          //       Recipe.time.active = info;
          //     } else if (label.includes("Total")) {
          //       Recipe.time.total = info;
          //     } else if (label.includes("Yield")) {
          //       Recipe.servings = info;
          //     }
          //   });
        
          // $(".recipe-procedure-text").each((i, el) => {
          //   Recipe.instructions.push(
          //     $(el)
          //       .text()
          //       .replace(/\s\s+/g, "")
          //   );
          // });

          console.log("HERE IS FINAL RECIPE: ", Recipe)
          }

          // if (
          //   !Recipe.name ||
          //   !Recipe.ingredients.length          ) {
          //     console.log("NO RECIPE FOUND!!! ", Recipe.name, Recipe.ingredients, Recipe.instructions)
          //   reject(new Error("No recipe found on page", Recipe.name, Recipe.ingredients, Recipe.instructions));
          // } else {
            resolve(Recipe);
          // }
        } else {
          console.log("NO RECIPE FOUND in error loop!!!  ", error)
          reject(new Error(error));
        }
      });
    }
  });
};

const regularRecipe = ($, Recipe) => {
  Recipe.image = $("meta[property='og:image']").attr("content");
  Recipe.name = $(".recipe-title")
    .text()
    .replace(/\s\s+/g, "");

  $(".ingredient").each((i, el) => {
    const item = $(el).text();
    Recipe.ingredients.push(item);
  });

  $(".recipe-about")
    .children("li")
    .each((i, el) => {
      const label = $(el)
        .children(".label")
        .text();
      const info = $(el)
        .children(".info")
        .text();

      if (label.includes("Active")) {
        Recipe.time.active = info;
      } else if (label.includes("Total")) {
        Recipe.time.total = info;
      } else if (label.includes("Yield")) {
        Recipe.servings = info;
      }
    });

  $(".recipe-procedure-text").each((i, el) => {
    Recipe.instructions.push(
      $(el)
        .text()
        .replace(/\s\s+/g, "")
    );
  });
};

module.exports = seriousEats;
