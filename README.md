# Chennai Dosa — Digital Menu

Premium mobile-first digital menu demo for **Chennai Dosa** — *quality is trust*.

## Phase 1

- 1–2 second animated welcome experience
- 12-item Indian demo menu
- Search by dish, flavor, or category
- Veg / non-veg selection filters
- Horizontal category navigation
- Rich menu cards with photo, taste, category, price, and heat
- Mobile bottom-sheet item details
- Add-to-cart from menu cards or item details
- Persistent local cart using browser localStorage
- Quantity controls and running total
- Waiter-oriented cart flow
- Responsive phone-first design
- Reduced-motion accessibility support
- Lazy-loaded food photography where appropriate

## Stack

- Next.js
- React
- TypeScript
- Custom CSS visual system

The first phase intentionally avoids a database. Menu data lives in `app/data.ts` so the prototype stays fast and easy to deploy.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Demo photography

Phase 1 currently references externally hosted demo photography. Before commercial use, replace these with restaurant-owned or properly licensed assets and host optimized local WebP/AVIF versions. The demo asset set covers all 12 menu items and is isolated in `app/data.ts` for easy replacement.

## Roadmap

**Phase 2:** detailed taste profiles, separate heat and spice-complexity scales, ingredient explorer, dietary/allergen information, and familiar-food comparisons.

**Phase 3:** discovery, meal-building, smart pairings, and recommendation flows.

**Phase 4:** advanced 3D/WebGL presentation and premium visual effects, with strict mobile performance limits.
