export type TasteMetric = {
  label: string;
  value: number;
};

export type Ingredient = {
  name: string;
  note: string;
};

export type Pairing = {
  id: string;
  moment: "with" | "after";
  why: string;
};

export type MenuItem = {
  id: string;
  name: string;
  subtitle: string;
  category: "Starter" | "Curry" | "Biryani" | "Bread" | "South Indian" | "Drink" | "Dessert";
  veg: boolean;
  price: number;
  spice: 0 | 1 | 2 | 3 | 4 | 5;
  taste: string[];
  tasteProfile: TasteMetric[];
  ingredients: Ingredient[];
  allergens: string[];
  likeIf: string;
  pairings: Pairing[];
  description: string;
  image: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "samosa",
    name: "Samosa",
    subtitle: "Crisp, savory, warmly spiced",
    category: "Starter",
    veg: true,
    price: 7,
    spice: 2,
    taste: ["Crispy", "Savory", "Warm spice"],
    tasteProfile: [
      { label: "Savory", value: 85 },
      { label: "Crispy", value: 95 },
      { label: "Tangy", value: 25 },
      { label: "Rich", value: 55 },
    ],
    ingredients: [
      { name: "Potato", note: "Soft, comforting filling that carries the spices." },
      { name: "Green peas", note: "Adds a gentle sweetness and bite." },
      { name: "Cumin", note: "Warm, earthy spice common in Indian savory cooking." },
      { name: "Coriander", note: "Fresh, citrusy-herbal flavor." },
      { name: "Pastry shell", note: "Thin wheat shell fried until crisp and flaky." },
    ],
    allergens: ["Gluten"],
    likeIf: "You enjoy crispy savory pastries, potato snacks, empanadas or lightly spiced appetizers.",
    pairings: [
      { id: "masala-chai", moment: "with", why: "Warm chai balances the crisp, savory filling." },
      { id: "gulab-jamun", moment: "after", why: "A warm syrupy sweet makes an easy finish after a salty starter." },
    ],
    description: "Golden pastry filled with seasoned potato and peas, served hot with chutney.",
    image: "https://bharatjalpaan.ae/assets/images/samosa.png",
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    subtitle: "Smoky, charred, juicy",
    category: "Starter",
    veg: false,
    price: 14,
    spice: 3,
    taste: ["Smoky", "Savory", "Tangy"],
    tasteProfile: [
      { label: "Smoky", value: 92 },
      { label: "Savory", value: 90 },
      { label: "Tangy", value: 48 },
      { label: "Rich", value: 68 },
    ],
    ingredients: [
      { name: "Chicken", note: "Boneless pieces stay juicy while charring around the edges." },
      { name: "Yogurt", note: "Tenderizes the chicken and adds a gentle tang." },
      { name: "Ginger", note: "Fresh warmth and brightness." },
      { name: "Garlic", note: "Deep savory aroma." },
      { name: "Tikka spices", note: "Aromatic blend that gives the dish its signature roasted flavor." },
    ],
    allergens: ["Dairy"],
    likeIf: "You enjoy grilled chicken, BBQ, smoky meats or kebabs.",
    pairings: [
      { id: "garlic-naan", moment: "with", why: "Soft buttery naan rounds out the smoky grilled chicken." },
      { id: "mango-lassi", moment: "with", why: "Cool mango yogurt softens the spice and char." },
      { id: "rasmalai", moment: "after", why: "A chilled creamy dessert gives the meal a gentle finish." },
    ],
    description: "Yogurt-marinated chicken grilled until tender with caramelized, charred edges.",
    image: "https://static.wixstatic.com/media/6e28fb_57ea7b17375e47aa853a0253b3ccb01a~mv2.png/v1/fill/w_980,h_815,al_c,q_90,enc_avif,quality_auto/6e28fb_57ea7b17375e47aa853a0253b3ccb01a~mv2.png",
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    subtitle: "Creamy, buttery, gently sweet",
    category: "Curry",
    veg: false,
    price: 18,
    spice: 2,
    taste: ["Creamy", "Rich", "Mild"],
    tasteProfile: [
      { label: "Creamy", value: 95 },
      { label: "Savory", value: 82 },
      { label: "Sweet", value: 38 },
      { label: "Tangy", value: 34 },
      { label: "Smoky", value: 30 },
    ],
    ingredients: [
      { name: "Chicken", note: "Tender chicken pieces soak up the rich sauce." },
      { name: "Tomato", note: "Creates the sauce's gentle tang and deep color." },
      { name: "Butter", note: "Adds the signature silky richness." },
      { name: "Cream", note: "Softens the spices and makes the sauce smooth." },
      { name: "Kasuri methi", note: "Dried fenugreek leaves with a savory, slightly earthy aroma." },
      { name: "Garam masala", note: "A warm aromatic Indian spice blend." },
    ],
    allergens: ["Dairy"],
    likeIf: "You enjoy creamy tomato sauces, rich comfort food and tender grilled chicken.",
    pairings: [
      { id: "garlic-naan", moment: "with", why: "The soft bread is ideal for scooping up the creamy sauce." },
      { id: "vegetable-biryani", moment: "with", why: "Fragrant rice adds texture and aromatic contrast." },
      { id: "mango-lassi", moment: "with", why: "Cooling mango yogurt keeps a rich curry feeling balanced." },
      { id: "gulab-jamun", moment: "after", why: "A classic warm Indian sweet rounds out the meal." },
    ],
    description: "Tender chicken in a silky tomato-butter sauce with a mellow, comforting finish.",
    image: "https://b.zmtcdn.com/data/dish_photos/9bc/75f5a8ef577ac9f3b706f3701d9539bc.jpeg",
  },
  {
    id: "palak-paneer",
    name: "Palak Paneer",
    subtitle: "Earthy, creamy, comforting",
    category: "Curry",
    veg: true,
    price: 16,
    spice: 2,
    taste: ["Earthy", "Creamy", "Aromatic"],
    tasteProfile: [
      { label: "Earthy", value: 88 },
      { label: "Creamy", value: 74 },
      { label: "Savory", value: 80 },
      { label: "Tangy", value: 18 },
    ],
    ingredients: [
      { name: "Paneer", note: "A mild, firm Indian cheese that stays soft without melting." },
      { name: "Spinach", note: "Forms the smooth green base and gives an earthy flavor." },
      { name: "Ginger", note: "Adds clean warmth." },
      { name: "Garlic", note: "Adds savory depth." },
      { name: "Cumin", note: "Warm and earthy, especially good with spinach." },
      { name: "Cream", note: "Rounds out the greens and spices." },
    ],
    allergens: ["Dairy"],
    likeIf: "You enjoy creamed spinach, mild cheese, comforting vegetarian dishes or earthy flavors.",
    pairings: [
      { id: "garlic-naan", moment: "with", why: "Garlic naan is perfect for scooping the thick spinach sauce." },
      { id: "vegetable-biryani", moment: "with", why: "Fragrant rice keeps the meal filling without adding meat." },
      { id: "rasmalai", moment: "after", why: "A chilled saffron-milk dessert gives a delicate finish." },
    ],
    description: "Soft paneer cubes folded through a smooth spinach curry with fragrant spices.",
    image: "https://images.slurrp.com/prod/recipe_images/transcribe/main%20course/Palak-Paneer.webp?height=675&impolicy=slurrp-20210601&width=1200",
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    subtitle: "Fragrant, layered, bold",
    category: "Biryani",
    veg: false,
    price: 19,
    spice: 3,
    taste: ["Aromatic", "Savory", "Layered"],
    tasteProfile: [
      { label: "Aromatic", value: 96 },
      { label: "Savory", value: 91 },
      { label: "Rich", value: 78 },
      { label: "Fresh", value: 42 },
      { label: "Smoky", value: 35 },
    ],
    ingredients: [
      { name: "Basmati rice", note: "Long, fragrant grains that stay light and separate." },
      { name: "Chicken", note: "Cooked with the rice so the flavors layer together." },
      { name: "Fried onion", note: "Adds sweetness, texture and a roasted aroma." },
      { name: "Mint", note: "Fresh herbal lift between the richer spices." },
      { name: "Saffron", note: "Adds floral aroma and golden color." },
      { name: "Whole spices", note: "Cardamom, cloves and cinnamon create the biryani's perfume." },
    ],
    allergens: [],
    likeIf: "You enjoy seasoned rice bowls, roasted chicken, pilaf or deeply aromatic one-pot meals.",
    pairings: [
      { id: "mango-lassi", moment: "with", why: "The cold, creamy drink cools the spice between bites." },
      { id: "chicken-tikka", moment: "with", why: "A smoky starter adds char before the aromatic rice." },
      { id: "rasmalai", moment: "after", why: "A cool creamy dessert is a gentle contrast to a bold biryani." },
    ],
    description: "Long-grain basmati rice layered with spiced chicken, herbs, saffron notes and fried onions.",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2024/11/14/98341df0-d993-4ad2-aef4-98a17b4cbcb2_990241.jpg",
  },
  {
    id: "vegetable-biryani",
    name: "Vegetable Biryani",
    subtitle: "Fragrant, colorful, aromatic",
    category: "Biryani",
    veg: true,
    price: 16,
    spice: 3,
    taste: ["Fragrant", "Savory", "Fresh"],
    tasteProfile: [
      { label: "Aromatic", value: 93 },
      { label: "Savory", value: 78 },
      { label: "Fresh", value: 70 },
      { label: "Rich", value: 58 },
    ],
    ingredients: [
      { name: "Basmati rice", note: "Fragrant long-grain rice with a light texture." },
      { name: "Mixed vegetables", note: "Adds color, bite and natural sweetness." },
      { name: "Mint", note: "Fresh herbal aroma." },
      { name: "Fried onion", note: "Deep sweetness and crisp edges." },
      { name: "Whole spices", note: "Cardamom, clove and cinnamon perfume the rice." },
    ],
    allergens: [],
    likeIf: "You enjoy vegetable rice bowls, pilaf and aromatic meat-free comfort food.",
    pairings: [
      { id: "palak-paneer", moment: "with", why: "Creamy spinach paneer adds a rich vegetarian side." },
      { id: "mango-lassi", moment: "with", why: "A cooling drink balances the warm spices." },
      { id: "gulab-jamun", moment: "after", why: "A warm sweet finish contrasts nicely with fragrant rice." },
    ],
    description: "Basmati rice layered with vegetables, herbs, warm spices and crisp fried onions.",
    image: "https://tb-static.uber.com/prod/image-proc/processed_images/2cf3b8f2e83b2852c4d3b6f33328abcd/c67fc65e9b4e16a553eb7574fba090f1.jpeg",
  },
  {
    id: "garlic-naan",
    name: "Garlic Naan",
    subtitle: "Buttery, soft, lightly charred",
    category: "Bread",
    veg: true,
    price: 5,
    spice: 0,
    taste: ["Buttery", "Garlicky", "Toasty"],
    tasteProfile: [
      { label: "Buttery", value: 88 },
      { label: "Garlicky", value: 85 },
      { label: "Toasty", value: 72 },
      { label: "Savory", value: 74 },
    ],
    ingredients: [
      { name: "Wheat flour", note: "Creates the soft, chewy flatbread." },
      { name: "Garlic", note: "Bold savory aroma on the surface." },
      { name: "Butter", note: "Brushed on hot for richness and shine." },
      { name: "Cilantro", note: "Adds a fresh herbal finish." },
    ],
    allergens: ["Gluten","Dairy"],
    likeIf: "You enjoy soft flatbreads, garlic bread, buttery rolls or lightly charred bread.",
    pairings: [
      { id: "butter-chicken", moment: "with", why: "One of the easiest and most satisfying curry-and-bread combinations." },
      { id: "palak-paneer", moment: "with", why: "Its soft texture is perfect for scooping thick spinach curry." },
      { id: "masala-chai", moment: "after", why: "Warm chai makes a cozy finish to a bread-and-curry meal." },
    ],
    description: "Soft tandoor-baked flatbread brushed with butter, garlic and herbs.",
    image: "https://www.midamarhalal.com/cdn/shop/files/GarlicNaan_635d9283-15a8-4df2-9894-cd20bcaad918.jpg?v=1740159148",
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    subtitle: "Crispy, tangy, savory",
    category: "South Indian",
    veg: true,
    price: 13,
    spice: 2,
    taste: ["Crispy", "Tangy", "Savory"],
    tasteProfile: [
      { label: "Crispy", value: 96 },
      { label: "Savory", value: 82 },
      { label: "Tangy", value: 48 },
      { label: "Light", value: 74 },
    ],
    ingredients: [
      { name: "Rice", note: "Part of the fermented batter that creates the crisp shell." },
      { name: "Urad dal", note: "A lentil used in the fermented batter for body and flavor." },
      { name: "Potato masala", note: "Soft seasoned potato filling inside the dosa." },
      { name: "Mustard seed", note: "Tiny seeds with a nutty, sharp aroma when tempered." },
      { name: "Curry leaves", note: "Highly aromatic leaves used throughout South Indian cooking." },
      { name: "Sambar", note: "Tangy lentil-vegetable stew served alongside." },
    ],
    allergens: [],
    likeIf: "You enjoy crispy crepes, savory breakfast foods, potato fillings or foods meant for dipping.",
    pairings: [
      { id: "masala-chai", moment: "with", why: "Warm spiced tea complements the crisp dosa and savory filling." },
      { id: "mango-lassi", moment: "with", why: "A cool drink is refreshing alongside sambar and chutney." },
      { id: "rasmalai", moment: "after", why: "A chilled, delicate dessert keeps the finish light." },
    ],
    description: "A thin crisp fermented crepe wrapped around seasoned potato, with chutney and sambar.",
    image: "https://www.kaufmann.wtf/countries/images/recipes/india-masala-dosa.jpg",
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    subtitle: "Creamy, fruity, cooling",
    category: "Drink",
    veg: true,
    price: 6,
    spice: 0,
    taste: ["Creamy", "Sweet", "Fruity"],
    tasteProfile: [
      { label: "Creamy", value: 91 },
      { label: "Fruity", value: 95 },
      { label: "Sweet", value: 78 },
      { label: "Tangy", value: 32 },
    ],
    ingredients: [
      { name: "Mango", note: "Ripe tropical sweetness and bright fruit flavor." },
      { name: "Yogurt", note: "Creamy body with a gentle tang." },
      { name: "Milk", note: "Keeps the drink smooth and pourable." },
      { name: "Cardamom", note: "Optional aromatic note that makes the drink distinctly Indian." },
    ],
    allergens: ["Dairy"],
    likeIf: "You enjoy mango smoothies, yogurt drinks or creamy fruit shakes.",
    pairings: [
      { id: "chicken-biryani", moment: "with", why: "Its cooling sweetness works especially well with aromatic spicy rice." },
      { id: "chicken-tikka", moment: "with", why: "The cold yogurt drink balances smoky grilled chicken." },
      { id: "gulab-jamun", moment: "after", why: "If you want a fully sweet finish, follow it with a warm syrupy dessert." },
    ],
    description: "A chilled mango and yogurt drink with a smooth, refreshing finish.",
    image: "https://static.wixstatic.com/media/726cb8_bcfc2f50345e4f1a871b0e83d83dc3a8~mv2.jpg/v1/fill/w_980,h_1225,al_c,q_85,enc_avif,quality_auto/726cb8_bcfc2f50345e4f1a871b0e83d83dc3a8~mv2.jpg",
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    subtitle: "Warm, aromatic, cozy",
    category: "Drink",
    veg: true,
    price: 4,
    spice: 0,
    taste: ["Warm spice", "Milky", "Aromatic"],
    tasteProfile: [
      { label: "Aromatic", value: 93 },
      { label: "Warm spice", value: 88 },
      { label: "Creamy", value: 62 },
      { label: "Sweet", value: 42 },
    ],
    ingredients: [
      { name: "Black tea", note: "Strong tea base that stands up to milk and spices." },
      { name: "Milk", note: "Softens the tea and gives chai its comforting body." },
      { name: "Ginger", note: "Fresh warming bite." },
      { name: "Cardamom", note: "Sweet, floral aroma." },
      { name: "Cinnamon", note: "Warm woody sweetness." },
      { name: "Clove", note: "Deep aromatic spice used in small amounts." },
    ],
    allergens: ["Dairy"],
    likeIf: "You enjoy chai lattes, spiced tea, milky black tea or warm cinnamon-cardamom flavors.",
    pairings: [
      { id: "samosa", moment: "with", why: "Crispy savory samosa and hot chai are a classic snack pairing." },
      { id: "masala-dosa", moment: "with", why: "A warm cup works well alongside a crisp savory dosa." },
      { id: "gulab-jamun", moment: "after", why: "Tea helps balance the sweetness of a syrupy dessert." },
    ],
    description: "Black tea simmered with milk and warming spices for a fragrant, comforting cup.",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Masala_chai.jpg",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    subtitle: "Soft, syrupy, floral",
    category: "Dessert",
    veg: true,
    price: 7,
    spice: 0,
    taste: ["Sweet", "Soft", "Floral"],
    tasteProfile: [
      { label: "Sweet", value: 96 },
      { label: "Soft", value: 94 },
      { label: "Floral", value: 52 },
      { label: "Rich", value: 78 },
    ],
    ingredients: [
      { name: "Milk solids", note: "Forms the soft, tender dumpling." },
      { name: "Sugar syrup", note: "Soaks into the dumpling for its signature sweetness." },
      { name: "Cardamom", note: "Adds a sweet aromatic note." },
      { name: "Rose", note: "A light floral aroma may be added to the syrup." },
      { name: "Pistachio", note: "Nutty garnish and a little texture." },
    ],
    allergens: ["Dairy","Tree nuts"],
    likeIf: "You enjoy doughnut holes, syrup-soaked cakes or very soft warm desserts.",
    pairings: [
      { id: "masala-chai", moment: "with", why: "Warm tea cuts through the dessert's syrupy sweetness." },
      { id: "mango-lassi", moment: "with", why: "A cool mango drink turns dessert into a playful sweet pairing." },
    ],
    description: "Warm milk-solid dumplings soaked in fragrant syrup, finished with pistachio.",
    image: "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/08/Gulab-Jamun.jpg?size=%2A%3A900",
  },
  {
    id: "rasmalai",
    name: "Rasmalai",
    subtitle: "Milky, delicate, saffron-kissed",
    category: "Dessert",
    veg: true,
    price: 8,
    spice: 0,
    taste: ["Creamy", "Sweet", "Delicate"],
    tasteProfile: [
      { label: "Creamy", value: 93 },
      { label: "Sweet", value: 75 },
      { label: "Milky", value: 95 },
      { label: "Floral", value: 54 },
    ],
    ingredients: [
      { name: "Chhena", note: "Soft fresh cheese that forms the tender dumplings." },
      { name: "Milk", note: "Reduced into a rich, chilled sauce." },
      { name: "Saffron", note: "Adds a floral aroma and golden tone." },
      { name: "Cardamom", note: "Sweet aromatic spice." },
      { name: "Pistachio", note: "Nutty garnish and delicate crunch." },
    ],
    allergens: ["Dairy","Tree nuts"],
    likeIf: "You enjoy cheesecake, tres leches, panna cotta or chilled milk-based desserts.",
    pairings: [
      { id: "masala-chai", moment: "with", why: "Hot aromatic tea contrasts beautifully with chilled rasmalai." },
      { id: "mango-lassi", moment: "with", why: "Mango and saffron create a soft, fragrant dessert-and-drink pairing." },
    ],
    description: "Soft cheese dumplings in chilled sweetened milk with saffron and pistachio.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/46/Rasmalai.jpg",
  },
];

export const categories = ["All", "Starter", "Curry", "Biryani", "Bread", "South Indian", "Drink", "Dessert"] as const;
