"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, menuItems, type MenuItem } from "./data";
import {
  buildMealRecommendation,
  type ShufflerAnswers,
} from "./shuffler";

type Cart = Record<string, number>;
type OverlayKind = "dish" | "cart" | "shuffler";
type ShuffleValue = ShufflerAnswers[keyof ShufflerAnswers];

type ShuffleQuestion = {
  key: keyof ShufflerAnswers;
  eyebrow: string;
  title: string;
  helper: string;
  options: Array<{
    value: ShuffleValue;
    icon: string;
    label: string;
    note: string;
  }>;
};

const shuffleQuestions: ShuffleQuestion[] = [
  {
    key: "mainCourse",
    eyebrow: "START WITH THE MAIN",
    title: "How do you want your main course?",
    helper: "Pick the direction you are craving. We will build the rest of the meal around it.",
    options: [
      { value: "biryani", icon: "🍚", label: "Rice / Biryani", note: "Fragrant, layered and complete" },
      { value: "curry", icon: "🫓", label: "Naan + Curry", note: "Saucy, comforting and scoopable" },
    ],
  },
  {
    key: "diet",
    eyebrow: "YOUR PLATE",
    title: "What feels right today?",
    helper: "This keeps the starter and main aligned with your preference.",
    options: [
      { value: "veg", icon: "🌱", label: "Vegetarian", note: "Keep the whole path meat-free" },
      { value: "nonveg", icon: "🍗", label: "Non-veg", note: "Chicken-led recommendations" },
      { value: "either", icon: "✨", label: "Either", note: "Surprise me with the best fit" },
    ],
  },
  {
    key: "spice",
    eyebrow: "SPICE COMFORT",
    title: "How bold should we go?",
    helper: "We use this to balance your starter and drink around the main.",
    options: [
      { value: "mild", icon: "🙂", label: "Mild", note: "Easy, comforting flavors" },
      { value: "medium", icon: "🌶️", label: "Medium", note: "Noticeable warmth" },
      { value: "bold", icon: "🔥", label: "Bold", note: "Give me the stronger flavors" },
    ],
  },
  {
    key: "finish",
    eyebrow: "THE LAST BITE",
    title: "How do you want to finish?",
    helper: "One final choice and your meal is ready.",
    options: [
      { value: "light", icon: "🌙", label: "Cool & light", note: "Soft, chilled and delicate" },
      { value: "sweet", icon: "🍯", label: "Sweet & indulgent", note: "Warm, rich and syrupy" },
    ],
  },
];

function VegMark({ veg }: { veg: boolean }) {
  return (
    <span className={`veg-mark ${veg ? "is-veg" : "is-nonveg"}`} aria-label={veg ? "Vegetarian" : "Non-vegetarian"}>
      <span />
    </span>
  );
}

function Spice({ level, compact = false }: { level: number; compact?: boolean }) {
  return (
    <span className={`spice-meter ${compact ? "compact" : ""}`} aria-label={`Spice level ${level} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < level ? "chilli active" : "chilli"} aria-hidden="true">🌶️</span>
      ))}
      {!compact && level === 0 && <small>No spice</small>}
    </span>
  );
}

function IngredientExplorer({ item }: { item: MenuItem }) {
  const [activeName, setActiveName] = useState(item.ingredients[0]?.name ?? "");
  const ingredient = item.ingredients.find((entry) => entry.name === activeName) ?? item.ingredients[0];

  useEffect(() => {
    setActiveName(item.ingredients[0]?.name ?? "");
  }, [item.id, item.ingredients]);

  if (!ingredient) return null;

  return (
    <section className="detail-section ingredient-section">
      <div className="section-label-row">
        <div>
          <p className="eyebrow gold">INGREDIENT EXPLORER</p>
          <h3>What&apos;s inside?</h3>
          <p className="section-hint">Tap an ingredient to learn what it adds to the dish.</p>
        </div>
      </div>

      <div className="ingredient-chips" role="list" aria-label="Ingredients">
        {item.ingredients.map((entry) => (
          <button
            type="button"
            key={entry.name}
            className={activeName === entry.name ? "ingredient-chip active" : "ingredient-chip"}
            onClick={() => setActiveName(entry.name)}
            aria-pressed={activeName === entry.name}
          >
            {entry.name}
          </button>
        ))}
      </div>

      <div className="ingredient-focus" key={ingredient.name} aria-live="polite">
        <div className="ingredient-icon">✦</div>
        <div>
          <b>{ingredient.name}</b>
          <p>{ingredient.note}</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [splash, setSplash] = useState(true);
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [shufflerOpen, setShufflerOpen] = useState(false);
  const [shuffleStep, setShuffleStep] = useState(0);
  const [shuffleAnswers, setShuffleAnswers] = useState<Partial<ShufflerAnswers>>({});
  const [cart, setCart] = useState<Cart>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    let closed = false;

    const closeSplash = () => {
      if (closed) return;
      closed = true;
      setSplash(false);
    };

    const timer = window.setTimeout(closeSplash, 2600);
    const safetyTimer = window.setTimeout(closeSplash, 4200);

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) closeSplash();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && performance.now() > 3000) {
        closeSplash();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);

    try {
      const saved = window.localStorage.getItem("chennai-dosa-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}

    // A refreshed modal URL should always come back as the menu.
    if (window.location.hash.startsWith("#dish") || window.location.hash === "#cart" || window.location.hash === "#shuffler") {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(safetyTimer);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setSelected(null);
      setCartOpen(false);
      setShufflerOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("chennai-dosa-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = selected || cartOpen || shufflerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected, cartOpen, shufflerOpen]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      const searchable = [
        item.name,
        item.category,
        item.subtitle,
        ...item.taste,
        ...item.ingredients.map((ingredient) => ingredient.name),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !term || searchable.includes(term);
      const matchesDiet =
        vegOnly === nonVegOnly ||
        (vegOnly && item.veg) ||
        (nonVegOnly && !item.veg);
      const matchesCategory = category === "All" || item.category === category;

      return matchesQuery && matchesDiet && matchesCategory;
    });
  }, [query, vegOnly, nonVegOnly, category]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = menuItems.reduce(
    (sum, item) => sum + (cart[item.id] || 0) * item.price,
    0,
  );

  const completeShuffle =
    shuffleAnswers.mainCourse &&
    shuffleAnswers.diet &&
    shuffleAnswers.spice &&
    shuffleAnswers.finish;

  const recommendation =
    completeShuffle
      ? buildMealRecommendation(shuffleAnswers as ShufflerAnswers)
      : null;

  const recommendationTotal =
    recommendation?.picks.reduce((sum, pick) => {
      const item = menuItems.find((menuItem) => menuItem.id === pick.id);
      return sum + (item?.price ?? 0);
    }, 0) ?? 0;

  function pushOverlay(kind: OverlayKind, suffix?: string) {
    const hash =
      kind === "dish"
        ? `#dish=${suffix ?? ""}`
        : kind === "cart"
          ? "#cart"
          : "#shuffler";

    window.history.pushState({ digitalMenuOverlay: kind }, "", hash);
  }

  function replaceOverlay(kind: OverlayKind, suffix?: string) {
    const hash =
      kind === "dish"
        ? `#dish=${suffix ?? ""}`
        : kind === "cart"
          ? "#cart"
          : "#shuffler";

    window.history.replaceState({ digitalMenuOverlay: kind }, "", hash);
  }

  function closeOverlay() {
    if (window.history.state?.digitalMenuOverlay) {
      window.history.back();
      return;
    }

    setSelected(null);
    setCartOpen(false);
    setShufflerOpen(false);
  }

  function openDish(item: MenuItem, replaceCurrent = false) {
    setCartOpen(false);
    setShufflerOpen(false);
    setSelected(item);

    if (replaceCurrent && window.history.state?.digitalMenuOverlay) {
      replaceOverlay("dish", item.id);
    } else {
      pushOverlay("dish", item.id);
    }
  }

  function openCart() {
    setSelected(null);
    setShufflerOpen(false);
    setCartOpen(true);
    pushOverlay("cart");
  }

  function openShuffler() {
    setSelected(null);
    setCartOpen(false);
    setShuffleStep(0);
    setShuffleAnswers({});
    setShufflerOpen(true);
    pushOverlay("shuffler");
  }

  function add(id: string) {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));

    setJustAdded(id);
    window.setTimeout(() => {
      setJustAdded((current) => (current === id ? null : current));
    }, 850);
  }

  function addMeal() {
    if (!recommendation) return;

    setCart((current) => {
      const next = { ...current };
      recommendation.picks.forEach((pick) => {
        next[pick.id] = (next[pick.id] || 0) + 1;
      });
      return next;
    });

    setJustAdded("meal");
    window.setTimeout(() => {
      setJustAdded((current) => (current === "meal" ? null : current));
    }, 1100);
  }

  function change(id: string, delta: number) {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[id] || 0) + delta);
      const next = { ...current };

      if (!nextQuantity) delete next[id];
      else next[id] = nextQuantity;

      return next;
    });
  }

  function chooseShuffle(value: ShuffleValue) {
    if (shuffleStep >= shuffleQuestions.length) return;
    const question = shuffleQuestions[shuffleStep];

    setShuffleAnswers((current) => ({
      ...current,
      [question.key]: value,
    }));
  }

  const pairingsWith = selected?.pairings.filter((pairing) => pairing.moment === "with") ?? [];
  const pairingsAfter = selected?.pairings.filter((pairing) => pairing.moment === "after") ?? [];
  const currentQuestion = shuffleQuestions[shuffleStep];
  const selectedShuffleValue = currentQuestion ? shuffleAnswers[currentQuestion.key] : undefined;

  return (
    <>
      {splash && (
        <div className="splash" aria-hidden="false">
          <div className="splash-glow splash-glow-one" />
          <div className="splash-glow splash-glow-two" />
          <div className="aroma aroma-one" />
          <div className="aroma aroma-two" />
          <div className="aroma aroma-three" />
          <div className="splash-grain" />

          <div className="splash-card">
            <div className="splash-logo-shell">
              <img src="/chennai-dosa-logo.png" alt="" className="splash-logo" />
            </div>
            <p className="eyebrow splash-welcome">VANAKKAM · WELCOME</p>
            <h1>Chennai Dosa</h1>
            <p className="splash-tagline">quality is trust</p>
            <div className="splash-divider"><span /></div>
            <p className="splash-message">Aromatic. Fresh. Made to be discovered.</p>
            <button type="button" className="splash-skip" onClick={() => setSplash(false)}>
              Enter menu
            </button>
          </div>
        </div>
      )}

      <main className="app" id="menu">
        <header className="hero">
          <div className="ambient ambient-a" />
          <div className="ambient ambient-b" />

          <nav className="topbar">
            <div className="brand">
              <span className="brand-logo-shell">
                <img src="/chennai-dosa-logo.png" alt="Chennai Dosa" className="brand-logo" />
              </span>
              <span className="brand-copy">
                <b>Chennai Dosa</b>
                <small>quality is trust</small>
              </span>
            </div>

            <button className="mini-cart" onClick={openCart} aria-label="Open cart">
              <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 4h2.2l1.9 9.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20.2 8H7.1" />
                <circle cx="9.5" cy="18.5" r="1.35" />
                <circle cx="17.2" cy="18.5" r="1.35" />
              </svg>
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
          </nav>

          <div className="shuffle-launcher">
            <button className="shuffle-cloud" onClick={openShuffler} aria-label="Try the Food Shuffler">
              <b>Food Shuffler</b>
              <span>Try something new, matched to your taste.</span>
            </button>
            <button className="shuffle-fab" onClick={openShuffler} aria-label="Open Food Shuffler">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h2.2c4.8 0 5.5 10 10.5 10H20" />
                <path d="m17 14 3 3-3 3" />
                <path d="M4 17h2.1c1.6 0 2.8-1.2 3.8-2.8" />
                <path d="M14.2 9.8C15 8.2 15.8 7 17 7h3" />
                <path d="m17 4 3 3-3 3" />
              </svg>
            </button>
          </div>

          <section className="hero-copy">
            <p className="kicker">A taste of India, made easier to explore.</p>
            <h2>Find your next<br /><em>favorite bite.</em></h2>
            <p className="hero-sub">Explore flavor first. Pick with confidence.</p>
          </section>

          <div className="search-shell">
            <span className="search-icon">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dish, flavor or ingredient..."
              aria-label="Search menu"
            />
            {query && (
              <button onClick={() => setQuery("")} className="clear-btn" aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        </header>

        <section className="controls">
          <div className="diet-row">
            <button
              className={`diet-toggle ${vegOnly ? "active veg-active" : ""}`}
              onClick={() => setVegOnly((value) => !value)}
              aria-pressed={vegOnly}
            >
              <VegMark veg />
              <span>Veg</span>
              <i>{vegOnly ? "✓" : "+"}</i>
            </button>

            <button
              className={`diet-toggle ${nonVegOnly ? "active nonveg-active" : ""}`}
              onClick={() => setNonVegOnly((value) => !value)}
              aria-pressed={nonVegOnly}
            >
              <VegMark veg={false} />
              <span>Non-veg</span>
              <i>{nonVegOnly ? "✓" : "+"}</i>
            </button>
          </div>

          <div className="category-scroll" aria-label="Menu categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? "category-chip active" : "category-chip"}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="menu-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow gold">CURATED FOR YOU</p>
              <h3>{category === "All" ? "The menu" : category}</h3>
            </div>
            <span>{filtered.length} {filtered.length === 1 ? "dish" : "dishes"}</span>
          </div>

          <div className="menu-grid">
            {filtered.map((item, index) => (
              <article
                className="food-card"
                key={item.id}
                style={{ "--delay": `${Math.min(index * 45, 360)}ms` } as React.CSSProperties}
              >
                <button
                  className="card-main"
                  onClick={() => openDish(item)}
                  aria-label={`View ${item.name}`}
                >
                  <div className="food-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="food-image"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                    <div className="image-shade" />
                    <span className="category-label">{item.category}</span>
                    <span className="diet-float"><VegMark veg={item.veg} /></span>
                  </div>

                  <div className="card-copy">
                    <div className="card-title-row">
                      <h4>{item.name}</h4>
                      <b>${item.price}</b>
                    </div>
                    <p>{item.subtitle}</p>

                    <div className="taste-row">
                      {item.taste.slice(0, 2).map((taste) => (
                        <span key={taste}>{taste}</span>
                      ))}
                    </div>

                    <div className="card-meta">
                      <span className="spice-label">SPICE</span>
                      <Spice level={item.spice} compact />
                      <span className="explore">Explore <b>↗</b></span>
                    </div>
                  </div>
                </button>

                <button
                  className={`quick-add ${justAdded === item.id ? "added" : ""}`}
                  onClick={() => add(item.id)}
                  aria-label={`Add ${item.name} to cart`}
                >
                  {justAdded === item.id ? "✓" : "+"}
                </button>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div>✦</div>
              <h4>No dish found</h4>
              <p>Try another flavor, category or dietary filter.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setVegOnly(false);
                  setNonVegOnly(false);
                  setCategory("All");
                }}
              >
                Reset menu
              </button>
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span className="brand-mark faded">CD</span>
          <p>Made for curious appetites.</p>
          <small>Chennai Dosa · Digital Menu Demo</small>
        </footer>

        <div className={`cart-dock-wrap ${cartCount ? "show" : ""}`}>
          <button className="cart-dock" onClick={openCart}>
            <span className="cart-bubble">{cartCount}</span>
            <span className="cart-copy">
              <b>View cart</b>
              <small>Ready when you are</small>
            </span>
            <strong>${cartTotal.toFixed(2)} <i>→</i></strong>
          </button>
        </div>
      </main>

      {selected && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label={selected.name}>
          <button className="modal-backdrop" onClick={closeOverlay} aria-label="Close details" />

          <section className="detail-sheet">
            <div className="sheet-handle" />

            <div className="detail-hero">
              <img src={selected.image} alt={selected.name} />
              <div className="detail-shade" />
              <button className="round-close" onClick={closeOverlay} aria-label="Back to menu">×</button>
              <div className="detail-badge">
                <VegMark veg={selected.veg} />
                {selected.veg ? "VEGETARIAN" : "NON-VEGETARIAN"}
              </div>
            </div>

            <div className="detail-content">
              <p className="eyebrow gold">{selected.category}</p>
              <div className="detail-title">
                <h2>{selected.name}</h2>
                <b>${selected.price}</b>
              </div>
              <p className="detail-subtitle">{selected.subtitle}</p>
              <p className="detail-description">{selected.description}</p>

              <div className="detail-stats detail-stats-three">
                <div>
                  <small>SPICE</small>
                  <Spice level={selected.spice} />
                </div>
                <div>
                  <small>STYLE</small>
                  <strong>{selected.veg ? "Vegetarian" : "Non-veg"}</strong>
                </div>
                <div className="allergen-stat">
                  <small>ALLERGENS</small>
                  <div className="allergen-tags">
                    {selected.allergens.length > 0 ? (
                      selected.allergens.map((allergen) => (
                        <span className="allergen-pill" key={allergen}>{allergen}</span>
                      ))
                    ) : (
                      <span className="allergen-none">None listed</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="allergen-note">
                Allergen information is for this demo recipe only. Restaurants should verify ingredients and cross-contact before publishing.
              </p>

              <section className="detail-section taste-profile">
                <div className="section-label-row">
                  <div>
                    <p className="eyebrow gold">TASTE PROFILE</p>
                    <h3>How it feels on your palate</h3>
                  </div>
                  <span>Flavor DNA</span>
                </div>

                <div className="taste-bars">
                  {selected.tasteProfile.map((metric) => (
                    <div className="taste-metric" key={metric.label}>
                      <div>
                        <span>{metric.label}</span>
                        <b>{metric.value}%</b>
                      </div>
                      <div className="taste-track">
                        <i style={{ width: `${metric.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <IngredientExplorer key={selected.id} item={selected} />

              <section className="detail-section like-card">
                <span className="like-spark">✦</span>
                <div>
                  <p className="eyebrow gold">YOU&apos;LL PROBABLY LIKE THIS IF...</p>
                  <p>{selected.likeIf}</p>
                </div>
              </section>

              <section className="detail-section pairing-section">
                <div className="section-label-row pairing-heading">
                  <div>
                    <p className="eyebrow gold">SMART PAIRINGS</p>
                    <h3>Make it a complete experience</h3>
                  </div>
                  <span>Curated</span>
                </div>

                {pairingsWith.length > 0 && (
                  <div className="pairing-group">
                    <small className="pairing-kicker">BEST WITH</small>
                    <div className="pairing-list">
                      {pairingsWith.map((pairing) => {
                        const item = menuItems.find((menuItem) => menuItem.id === pairing.id);
                        if (!item) return null;

                        return (
                          <article className="pairing-card" key={`with-${pairing.id}`}>
                            <button className="pairing-view" onClick={() => openDish(item, true)}>
                              <img src={item.image} alt="" />
                              <span>
                                <b>{item.name}</b>
                                <small>{pairing.why}</small>
                              </span>
                            </button>
                            <button
                              className={`pairing-add ${justAdded === item.id ? "added" : ""}`}
                              onClick={() => add(item.id)}
                              aria-label={`Add ${item.name}`}
                            >
                              {justAdded === item.id ? "✓" : "+"}
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}

                {pairingsAfter.length > 0 && (
                  <div className="pairing-group after">
                    <small className="pairing-kicker">FINISH WITH</small>
                    <div className="pairing-list">
                      {pairingsAfter.map((pairing) => {
                        const item = menuItems.find((menuItem) => menuItem.id === pairing.id);
                        if (!item) return null;

                        return (
                          <article className="pairing-card finish" key={`after-${pairing.id}`}>
                            <button className="pairing-view" onClick={() => openDish(item, true)}>
                              <img src={item.image} alt="" />
                              <span>
                                <b>{item.name}</b>
                                <small>{pairing.why}</small>
                              </span>
                            </button>
                            <button
                              className={`pairing-add ${justAdded === item.id ? "added" : ""}`}
                              onClick={() => add(item.id)}
                              aria-label={`Add ${item.name}`}
                            >
                              {justAdded === item.id ? "✓" : "+"}
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              <button
                className={`add-detail ${justAdded === selected.id ? "added" : ""}`}
                onClick={() => add(selected.id)}
              >
                <span>{justAdded === selected.id ? "Added to cart ✓" : "Add to cart"}</span>
                <b>
                  {justAdded === selected.id
                    ? `${cart[selected.id] || 1} in cart`
                    : `$${selected.price.toFixed(2)}`}
                </b>
              </button>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Your cart">
          <button className="modal-backdrop" onClick={closeOverlay} aria-label="Close cart" />

          <section className="cart-sheet">
            <div className="sheet-handle" />

            <div className="cart-header">
              <div>
                <p className="eyebrow gold">YOUR SELECTION</p>
                <h2>Ready to order</h2>
              </div>
              <button className="round-close light" onClick={closeOverlay} aria-label="Back to menu">×</button>
            </div>

            <div className="cart-items">
              {cartCount === 0 ? (
                <div className="empty-cart">
                  <span>◇</span>
                  <h4>Your cart is empty</h4>
                  <p>Add something delicious from the menu.</p>
                  <button onClick={closeOverlay}>Browse menu</button>
                </div>
              ) : (
                menuItems
                  .filter((item) => cart[item.id])
                  .map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <div className="cart-item-copy">
                        <div>
                          <VegMark veg={item.veg} />
                          <b>{item.name}</b>
                        </div>
                        <small>${item.price} each</small>
                      </div>
                      <div className="qty">
                        <button onClick={() => change(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                        <b>{cart[item.id]}</b>
                        <button onClick={() => change(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {cartCount > 0 && (
              <div className="cart-summary">
                <div>
                  <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
                  <b>${cartTotal.toFixed(2)}</b>
                </div>
                <p>This demo cart helps you remember your choices when ordering with your waiter.</p>
                <button className="show-waiter">
                  <span>Show my order</span>
                  <i>↗</i>
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {shufflerOpen && (
        <div className="modal-layer shuffler-layer" role="dialog" aria-modal="true" aria-label="Food Shuffler">
          <button className="modal-backdrop" onClick={closeOverlay} aria-label="Close Food Shuffler" />

          <section className="shuffler-sheet">
            <div className="sheet-handle" />

            <div className="shuffler-top">
              <button
                className="shuffler-back"
                onClick={() => {
                  if (shuffleStep > 0) setShuffleStep((step) => step - 1);
                  else closeOverlay();
                }}
                aria-label={shuffleStep > 0 ? "Previous question" : "Close Food Shuffler"}
              >
                ←
              </button>

              <div className="shuffler-brand">
                <span>✦</span>
                <div>
                  <small>CHENNAI DOSA</small>
                  <b>Food Shuffler</b>
                </div>
              </div>

              <button className="round-close light" onClick={closeOverlay} aria-label="Close Food Shuffler">×</button>
            </div>

            {shuffleStep < shuffleQuestions.length && currentQuestion ? (
              <div className="shuffler-body">
                <div className="shuffle-progress">
                  {shuffleQuestions.map((question, index) => (
                    <span
                      key={question.key}
                      className={index === shuffleStep ? "active" : index < shuffleStep ? "done" : ""}
                    />
                  ))}
                </div>

                <p className="eyebrow gold">{currentQuestion.eyebrow}</p>
                <h2>{currentQuestion.title}</h2>
                <p className="shuffle-helper">{currentQuestion.helper}</p>

                <div className="shuffle-options">
                  {currentQuestion.options.map((option) => {
                    const active = selectedShuffleValue === option.value;

                    return (
                      <button
                        key={option.value}
                        className={active ? "shuffle-option active" : "shuffle-option"}
                        onClick={() => chooseShuffle(option.value)}
                        aria-pressed={active}
                      >
                        <span className="shuffle-option-icon">{option.icon}</span>
                        <span>
                          <b>{option.label}</b>
                          <small>{option.note}</small>
                        </span>
                        <i>{active ? "✓" : "›"}</i>
                      </button>
                    );
                  })}
                </div>

                <button
                  className="shuffle-next"
                  disabled={!selectedShuffleValue}
                  onClick={() => setShuffleStep((step) => Math.min(step + 1, shuffleQuestions.length))}
                >
                  <span>{shuffleStep === shuffleQuestions.length - 1 ? "Build my meal" : "Continue"}</span>
                  <b>→</b>
                </button>
              </div>
            ) : recommendation ? (
              <div className="shuffler-body shuffle-result">
                <div className="result-confetti" aria-hidden="true">
                  <span>✦</span><span>·</span><span>✦</span>
                </div>

                <p className="eyebrow gold">MATCHED TO YOUR TASTE</p>
                <h2>{recommendation.title}</h2>
                <p className="shuffle-helper">{recommendation.subtitle}</p>

                <div className="meal-journey">
                  {recommendation.picks.map((pick, index) => {
                    const item = menuItems.find((menuItem) => menuItem.id === pick.id);
                    if (!item) return null;

                    return (
                      <article className="meal-pick" key={`${pick.role}-${pick.id}`}>
                        <div className="meal-step-line">
                          <span>{index + 1}</span>
                          {index < recommendation.picks.length - 1 && <i />}
                        </div>

                        <button className="meal-pick-main" onClick={() => openDish(item, true)}>
                          <img src={item.image} alt="" />
                          <span className="meal-pick-copy">
                            <small>{pick.role}</small>
                            <b>{item.name}</b>
                            <p>{pick.reason}</p>
                          </span>
                          <strong>${item.price}</strong>
                        </button>

                        <button
                          className={`meal-pick-add ${justAdded === item.id ? "added" : ""}`}
                          onClick={() => add(item.id)}
                          aria-label={`Add ${item.name}`}
                        >
                          {justAdded === item.id ? "✓" : "+"}
                        </button>
                      </article>
                    );
                  })}
                </div>

                <div className="meal-total">
                  <span>Suggested meal total</span>
                  <b>${recommendationTotal.toFixed(2)}</b>
                </div>

                <button
                  className={`shuffle-add-meal ${justAdded === "meal" ? "added" : ""}`}
                  onClick={addMeal}
                >
                  <span>{justAdded === "meal" ? "Meal added ✓" : "Add this meal to cart"}</span>
                  <b>{recommendation.picks.length} items</b>
                </button>

                <button
                  className="shuffle-again"
                  onClick={() => {
                    setShuffleAnswers({});
                    setShuffleStep(0);
                  }}
                >
                  ↻ Shuffle again
                </button>
              </div>
            ) : (
              <div className="shuffler-body">
                <p>Choose your preferences to build a meal.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
