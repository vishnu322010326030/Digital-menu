export type MainCourseStyle = "biryani" | "curry";
export type DietPreference = "veg" | "nonveg" | "either";
export type SpicePreference = "mild" | "medium" | "bold";
export type FinishPreference = "light" | "sweet";

export type ShufflerAnswers = {
  mainCourse: MainCourseStyle;
  diet: DietPreference;
  spice: SpicePreference;
  finish: FinishPreference;
};

export type MealPick = {
  role: "Starter" | "Main" | "Side" | "Drink" | "Dessert";
  id: string;
  reason: string;
};

export type MealRecommendation = {
  title: string;
  subtitle: string;
  picks: MealPick[];
};

export function buildMealRecommendation(answers: ShufflerAnswers): MealRecommendation {
  const wantsVeg = answers.diet === "veg";
  const wantsNonVeg = answers.diet === "nonveg";

  const starter =
    wantsVeg
      ? "samosa"
      : wantsNonVeg
        ? (answers.spice === "mild" ? "samosa" : "chicken-tikka")
        : (answers.spice === "bold" ? "chicken-tikka" : "samosa");

  const main =
    answers.mainCourse === "biryani"
      ? (wantsVeg ? "vegetable-biryani" : "chicken-biryani")
      : (wantsVeg ? "palak-paneer" : "butter-chicken");

  const drink =
    answers.spice === "mild" && answers.mainCourse === "curry"
      ? "masala-chai"
      : "mango-lassi";

  const dessert = answers.finish === "light" ? "rasmalai" : "gulab-jamun";

  const picks: MealPick[] = [
    {
      role: "Starter",
      id: starter,
      reason:
        starter === "chicken-tikka"
          ? "A smoky, grilled opening that works well before a bolder main."
          : "A crisp, savory start that is easy to enjoy and does not overpower the main course.",
    },
    {
      role: "Main",
      id: main,
      reason:
        main === "chicken-biryani"
          ? "Fragrant rice, layered spices and tender chicken fit your rice-first choice."
          : main === "vegetable-biryani"
            ? "Aromatic basmati rice and vegetables give you a complete vegetarian rice main."
            : main === "palak-paneer"
              ? "Creamy spinach and mild paneer give you a comforting vegetarian curry."
              : "Creamy, gently spiced butter chicken is an approachable curry with naan.",
    },
  ];

  if (answers.mainCourse === "curry") {
    picks.push({
      role: "Side",
      id: "garlic-naan",
      reason: "Soft, buttery garlic naan is made for scooping up a rich curry sauce.",
    });
  }

  picks.push({
    role: "Drink",
    id: drink,
    reason:
      drink === "mango-lassi"
        ? "Cool mango yogurt balances spice and refreshes the palate."
        : "Warm masala chai keeps a mild, comforting meal aromatic without adding heat.",
  });

  picks.push({
    role: "Dessert",
    id: dessert,
    reason:
      dessert === "rasmalai"
        ? "A chilled, delicate milk dessert gives the meal a lighter finish."
        : "Warm, syrupy gulab jamun gives you a classic indulgent Indian finish.",
  });

  return {
    title: answers.mainCourse === "biryani" ? "Your biryani journey" : "Your curry & naan journey",
    subtitle:
      answers.diet === "veg"
        ? "A vegetarian path built around your spice and finish preferences."
        : answers.diet === "nonveg"
          ? "A non-vegetarian path built around your spice and finish preferences."
          : "A balanced path chosen from both vegetarian and non-vegetarian favorites.",
    picks,
  };
}
