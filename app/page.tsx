"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, menuItems, type MenuItem } from "./data";

type Cart = Record<string, number>;

function VegMark({ veg }: { veg: boolean }) {
  return <span className={`veg-mark ${veg ? "is-veg" : "is-nonveg"}`} aria-label={veg ? "Vegetarian" : "Non-vegetarian"}><span /></span>;
}

function Heat({ level, compact = false }: { level: number; compact?: boolean }) {
  if (level === 0) return <span className="heat mild">No heat</span>;
  return (
    <span className={`heat ${compact ? "compact" : ""}`} aria-label={`Heat level ${level} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => <span key={i} className={i < level ? "lit" : ""}>●</span>)}
    </span>
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
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setSplash(false), 1650);
    try {
      const saved = window.localStorage.getItem("chennai-dosa-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem("chennai-dosa-cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = selected || cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected, cartOpen]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const q = !term || [item.name, item.category, item.subtitle, ...item.taste].join(" ").toLowerCase().includes(term);
      const type = vegOnly === nonVegOnly || (vegOnly && item.veg) || (nonVegOnly && !item.veg);
      const cat = category === "All" || item.category === category;
      return q && type && cat;
    });
  }, [query, vegOnly, nonVegOnly, category]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = menuItems.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function change(id: string, delta: number) {
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      const out = { ...c };
      if (!next) delete out[id]; else out[id] = next;
      return out;
    });
  }

  return (
    <>
      <div className={`splash ${splash ? "" : "splash-away"}`} aria-hidden={!splash}>
        <div className="splash-orbit orbit-one" />
        <div className="splash-orbit orbit-two" />
        <div className="splash-mark">CD</div>
        <p className="eyebrow">WELCOME TO</p>
        <h1>Chennai Dosa</h1>
        <p className="splash-tagline">quality is trust</p>
        <div className="splash-line" />
      </div>

      <main className={splash ? "app app-hidden" : "app"}>
        <header className="hero">
          <div className="ambient ambient-a" />
          <div className="ambient ambient-b" />

          <nav className="topbar">
            <div className="brand">
              <span className="brand-mark">CD</span>
              <span><b>Chennai Dosa</b><small>quality is trust</small></span>
            </div>
            <button className="mini-cart" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <span>⌁</span>{cartCount > 0 && <b>{cartCount}</b>}
            </button>
          </nav>

          <section className="hero-copy">
            <p className="kicker">A taste of India, made easier to explore.</p>
            <h2>Find your next<br/><em>favorite bite.</em></h2>
            <p className="hero-sub">Explore flavor first. Pick with confidence.</p>
          </section>

          <div className="search-shell">
            <span className="search-icon">⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dish, flavor or category..." aria-label="Search menu" />
            {query && <button onClick={() => setQuery("")} className="clear-btn" aria-label="Clear search">×</button>}
          </div>
        </header>

        <section className="controls">
          <div className="diet-row">
            <button className={`diet-toggle ${vegOnly ? "active veg-active" : ""}`} onClick={() => setVegOnly(v => !v)}>
              <VegMark veg /> <span>Veg</span><i>{vegOnly ? "✓" : "+"}</i>
            </button>
            <button className={`diet-toggle ${nonVegOnly ? "active nonveg-active" : ""}`} onClick={() => setNonVegOnly(v => !v)}>
              <VegMark veg={false} /> <span>Non-veg</span><i>{nonVegOnly ? "✓" : "+"}</i>
            </button>
          </div>

          <div className="category-scroll" aria-label="Menu categories">
            {categories.map((cat) => (
              <button key={cat} className={category === cat ? "category-chip active" : "category-chip"} onClick={() => setCategory(cat)}>{cat}</button>
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
              <article className="food-card" key={item.id} style={{ "--delay": `${Math.min(index * 45, 360)}ms` } as React.CSSProperties}>
                <button className="card-main" onClick={() => setSelected(item)} aria-label={`View ${item.name}`}>
                  <div className="food-image-wrap">
                    <img src={item.image} alt={item.name} className="food-image" loading={index < 3 ? "eager" : "lazy"} />
                    <div className="image-shade" />
                    <span className="category-label">{item.category}</span>
                    <span className="diet-float"><VegMark veg={item.veg} /></span>
                  </div>
                  <div className="card-copy">
                    <div className="card-title-row"><h4>{item.name}</h4><b>${item.price}</b></div>
                    <p>{item.subtitle}</p>
                    <div className="taste-row">
                      {item.taste.slice(0,2).map(t => <span key={t}>{t}</span>)}
                    </div>
                    <div className="card-meta">
                      <span className="spice-label">HEAT</span><Heat level={item.heat} compact />
                      <span className="explore">Explore <b>↗</b></span>
                    </div>
                  </div>
                </button>
                <button className="quick-add" onClick={() => add(item.id)} aria-label={`Add ${item.name} to cart`}>+</button>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div>✦</div><h4>No dish found</h4><p>Try another flavor, category or dietary filter.</p>
              <button onClick={() => { setQuery(""); setVegOnly(false); setNonVegOnly(false); setCategory("All"); }}>Reset menu</button>
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span className="brand-mark faded">CD</span>
          <p>Made for curious appetites.</p>
          <small>Chennai Dosa · Digital Menu Demo</small>
        </footer>

        <div className={`cart-dock-wrap ${cartCount ? "show" : ""}`}>
          <button className="cart-dock" onClick={() => setCartOpen(true)}>
            <span className="cart-bubble">{cartCount}</span>
            <span className="cart-copy"><b>View cart</b><small>Ready when you are</small></span>
            <strong>${cartTotal.toFixed(2)} <i>→</i></strong>
          </button>
        </div>
      </main>

      {selected && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label={selected.name}>
          <button className="modal-backdrop" onClick={() => setSelected(null)} aria-label="Close details" />
          <section className="detail-sheet">
            <div className="sheet-handle" />
            <div className="detail-hero">
              <img src={selected.image} alt={selected.name} />
              <div className="detail-shade" />
              <button className="round-close" onClick={() => setSelected(null)}>×</button>
              <div className="detail-badge"><VegMark veg={selected.veg} /> {selected.veg ? "VEGETARIAN" : "NON-VEGETARIAN"}</div>
            </div>
            <div className="detail-content">
              <p className="eyebrow gold">{selected.category}</p>
              <div className="detail-title"><h2>{selected.name}</h2><b>${selected.price}</b></div>
              <p className="detail-subtitle">{selected.subtitle}</p>
              <p className="detail-description">{selected.description}</p>

              <div className="detail-stats">
                <div><small>HEAT</small><Heat level={selected.heat} /></div>
                <div><small>STYLE</small><strong>{selected.veg ? "Vegetarian" : "Non-veg"}</strong></div>
              </div>

              <div className="flavor-block">
                <small>TASTE AT A GLANCE</small>
                <div>{selected.taste.map(t => <span key={t}>{t}</span>)}</div>
              </div>

              <div className="phase-note">
                <span>✦</span><div><b>More is coming</b><p>Taste profiles, ingredient explorer, pairings and food discovery arrive in the next phases.</p></div>
              </div>

              <button className="add-detail" onClick={() => add(selected.id)}>
                <span>Add to cart</span><b>${selected.price.toFixed(2)}</b>
              </button>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Your cart">
          <button className="modal-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart" />
          <section className="cart-sheet">
            <div className="sheet-handle" />
            <div className="cart-header"><div><p className="eyebrow gold">YOUR SELECTION</p><h2>Ready to order</h2></div><button className="round-close light" onClick={() => setCartOpen(false)}>×</button></div>

            <div className="cart-items">
              {cartCount === 0 ? (
                <div className="empty-cart"><span>◇</span><h4>Your cart is empty</h4><p>Add something delicious from the menu.</p><button onClick={() => setCartOpen(false)}>Browse menu</button></div>
              ) : menuItems.filter(i => cart[i.id]).map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="cart-item-copy"><div><VegMark veg={item.veg}/><b>{item.name}</b></div><small>${item.price} each</small></div>
                  <div className="qty"><button onClick={() => change(item.id,-1)}>−</button><b>{cart[item.id]}</b><button onClick={() => change(item.id,1)}>+</button></div>
                </div>
              ))}
            </div>

            {cartCount > 0 && (
              <div className="cart-summary">
                <div><span>{cartCount} {cartCount === 1 ? "item" : "items"}</span><b>${cartTotal.toFixed(2)}</b></div>
                <p>This demo cart is designed to help you remember your choices when ordering with your waiter.</p>
                <button className="show-waiter"><span>Show my order</span><i>↗</i></button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
