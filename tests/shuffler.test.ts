import test from "node:test";
import assert from "node:assert/strict";
import { buildMealRecommendation } from "../app/shuffler";

function ids(result: ReturnType<typeof buildMealRecommendation>) {
  return result.picks.map((pick) => pick.id);
}

test("non-veg biryani path builds a complete meal", () => {
  const result = buildMealRecommendation({
    mainCourse: "biryani",
    diet: "nonveg",
    spice: "medium",
    finish: "sweet",
  });

  assert.deepEqual(ids(result), [
    "chicken-tikka",
    "chicken-biryani",
    "mango-lassi",
    "gulab-jamun",
  ]);
});

test("vegetarian curry path includes paneer and naan only", () => {
  const result = buildMealRecommendation({
    mainCourse: "curry",
    diet: "veg",
    spice: "mild",
    finish: "light",
  });

  assert.deepEqual(ids(result), [
    "samosa",
    "palak-paneer",
    "garlic-naan",
    "masala-chai",
    "rasmalai",
  ]);

  assert.equal(ids(result).includes("chicken-tikka"), false);
  assert.equal(ids(result).includes("butter-chicken"), false);
});

test("bold flexible biryani path chooses smoky starter", () => {
  const result = buildMealRecommendation({
    mainCourse: "biryani",
    diet: "either",
    spice: "bold",
    finish: "light",
  });

  assert.equal(result.picks[0]?.id, "chicken-tikka");
  assert.equal(result.picks[1]?.id, "chicken-biryani");
  assert.equal(result.picks.at(-1)?.id, "rasmalai");
});

test("curry recommendations always include garlic naan", () => {
  const diets = ["veg", "nonveg", "either"] as const;

  diets.forEach((diet) => {
    const result = buildMealRecommendation({
      mainCourse: "curry",
      diet,
      spice: "medium",
      finish: "sweet",
    });

    assert.equal(ids(result).includes("garlic-naan"), true);
  });
});

test("biryani recommendations do not add naan as a required side", () => {
  const result = buildMealRecommendation({
    mainCourse: "biryani",
    diet: "veg",
    spice: "medium",
    finish: "light",
  });

  assert.equal(ids(result).includes("garlic-naan"), false);
  assert.equal(ids(result).includes("vegetable-biryani"), true);
});

test("finish preference controls dessert choice", () => {
  const light = buildMealRecommendation({
    mainCourse: "curry",
    diet: "nonveg",
    spice: "mild",
    finish: "light",
  });

  const sweet = buildMealRecommendation({
    mainCourse: "curry",
    diet: "nonveg",
    spice: "mild",
    finish: "sweet",
  });

  assert.equal(light.picks.at(-1)?.id, "rasmalai");
  assert.equal(sweet.picks.at(-1)?.id, "gulab-jamun");
});

test("every meal has one starter, main, drink and dessert", () => {
  const result = buildMealRecommendation({
    mainCourse: "biryani",
    diet: "veg",
    spice: "bold",
    finish: "sweet",
  });

  const roles = result.picks.map((pick) => pick.role);
  assert.equal(roles.filter((role) => role === "Starter").length, 1);
  assert.equal(roles.filter((role) => role === "Main").length, 1);
  assert.equal(roles.filter((role) => role === "Drink").length, 1);
  assert.equal(roles.filter((role) => role === "Dessert").length, 1);
});
