# Chennai Dosa — Digital Menu

Premium mobile-first digital menu demo for **Chennai Dosa** — *quality is trust*.

## Demo features

- Animated 1–3 second Chennai Dosa welcome experience
- 12-item Indian demo menu
- Search by dish, flavor, category, or ingredient
- Veg / non-veg filters
- Horizontal category navigation
- Rich menu cards with photo, taste, category, price, and chilli-based spice level
- Mobile bottom-sheet dish details
- Taste-profile / Flavor DNA visualization
- Interactive ingredient explorer
- Dietary style and allergen summary
- Familiar-food guidance: “You’ll probably like this if…”
- Smart pairings with “Best with” and “Finish with” suggestions
- Add-to-cart from cards, details, pairings, and recommendations
- Persistent cart using browser localStorage
- Quantity controls and running total
- Waiter-oriented “Show my order” flow
- Browser Back closes dish/cart/shuffler overlays before leaving the site
- Mobile touch reliability safeguards
- Reduced-motion accessibility support

## Food Shuffler

The Food Shuffler is a guided four-question meal builder:

1. Biryani/rice vs. naan + curry
2. Vegetarian / non-vegetarian / either
3. Mild / medium / bold spice comfort
4. Cool/light vs. sweet/indulgent finish

It returns an actual meal made from the demo menu:

**Starter → Main → Side (when relevant) → Drink → Dessert**

Recommendations are deterministic and tested, so the same preferences produce a consistent meal. Customers can inspect individual recommended dishes or add the complete suggested meal to the cart.

## Stack

- Next.js
- React
- TypeScript
- Custom mobile-first CSS / glassmorphism system
- Local browser storage for the demo cart
- Node test runner + TSX for recommendation tests
- GitHub Actions verification

The demo intentionally avoids a database so it stays fast and simple to deploy.

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Real-phone preview on your local network

Use the production-style mobile preview rather than the Next.js HMR development path:

```bash
npm run mobile
```

Then open:

```text
http://YOUR-LAPTOP-IP:3000
```

on a phone connected to the same Wi-Fi.

## Verification

```bash
npm run verify
```

This runs:

- TypeScript type checking
- Food Shuffler unit tests
- Next.js production build

GitHub Actions runs the same checks for the main branch.

## Vercel

This repository is structured as a standard Next.js application and can be imported directly into Vercel. No database or environment variables are required for the current demo.

## Demo photography

The current demo references externally hosted food photography. Before commercial use, replace those images with restaurant-owned or properly licensed assets and host optimized local WebP/AVIF files.

## Future product ideas

Potential post-demo additions include table-aware ordering, multilingual dish explanations, restaurant admin controls, item availability, analytics, POS/payment integration, and advanced 3D/WebGL food presentation.
