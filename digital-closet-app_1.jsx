
import { useState, useRef, useCallback, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0a0f",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",
  accent: "#c9a96e",
  accentSoft: "rgba(201,169,110,0.15)",
  accentGlow: "rgba(201,169,110,0.35)",
  text: "#f0ece4",
  textMuted: "rgba(240,236,228,0.45)",
  textDim: "rgba(240,236,228,0.25)",
  danger: "#e07070",
  success: "#70c49a",
  glass: "rgba(15,14,22,0.7)",
};

const CATEGORIES = ["Top", "Bottom", "Shoes", "Accessory"];
const TAGS = ["Casual", "Formal", "Gym", "Winter", "Summer", "Beach", "Party", "Work"];
const CLOTHING_COLORS = ["Black", "White", "Navy", "Grey", "Beige", "Brown", "Red", "Blue", "Green", "Yellow", "Pink", "Purple"];

const CATEGORY_ICONS = { Top: "👕", Bottom: "👖", Shoes: "👟", Accessory: "👜" };
const CATEGORY_EMOJIS_BIG = { Top: "🧥", Bottom: "👖", Shoes: "👠", Accessory: "💍" };

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const SAMPLE_ITEMS = [
  { id: "s1", name: "White Linen Shirt", category: "Top", tags: ["Casual", "Summer"], color: "White", emoji: "👔", favorite: false, uploadedAt: Date.now() - 86400000 * 5 },
  { id: "s2", name: "Black Blazer", category: "Top", tags: ["Formal", "Work"], color: "Black", emoji: "🧥", favorite: true, uploadedAt: Date.now() - 86400000 * 4 },
  { id: "s3", name: "Slim Chinos", category: "Bottom", tags: ["Casual", "Work"], color: "Beige", emoji: "👖", favorite: false, uploadedAt: Date.now() - 86400000 * 3 },
  { id: "s4", name: "Black Jeans", category: "Bottom", tags: ["Casual", "Party"], color: "Black", emoji: "👖", favorite: true, uploadedAt: Date.now() - 86400000 * 2 },
  { id: "s5", name: "White Sneakers", category: "Shoes", tags: ["Casual", "Gym"], color: "White", emoji: "👟", favorite: false, uploadedAt: Date.now() - 86400000 },
  { id: "s6", name: "Oxford Loafers", category: "Shoes", tags: ["Formal", "Work"], color: "Brown", emoji: "👞", favorite: false, uploadedAt: Date.now() },
  { id: "s7", name: "Leather Belt", category: "Accessory", tags: ["Formal", "Casual"], color: "Brown", emoji: "🧣", favorite: false, uploadedAt: Date.now() },
  { id: "s8", name: "Gold Watch", category: "Accessory", tags: ["Formal", "Party"], color: "Yellow", emoji: "⌚", favorite: true, uploadedAt: Date.now() },
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const useAnimMount = (delay = 0) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return visible;
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    
    * { margin:0; padding:0; box-sizing:border-box; }
    
    body, #root {
      background: ${COLORS.bg};
      color: ${COLORS.text};
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 2px; }
    
    .serif { font-family: 'Cormorant Garamond', serif; }
    
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(201,169,110,0.2); }
      50% { box-shadow: 0 0 40px rgba(201,169,110,0.45); }
    }
    
    .anim-fade-up { animation: fadeUp 0.5s ease forwards; }
    .anim-fade-in { animation: fadeIn 0.4s ease forwards; }
    .anim-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
    
    .card-hover {
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-4px) scale(1.01);
      border-color: rgba(201,169,110,0.3) !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,169,110,0.12);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #c9a96e, #e8c98a);
      color: #0a0a0f;
      border: none;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.05em;
      transition: all 0.25s ease;
      border-radius: 12px;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 30px rgba(201,169,110,0.4);
      filter: brightness(1.08);
    }
    .btn-primary:active { transform: translateY(0px); }
    
    .btn-ghost {
      background: transparent;
      border: 1px solid ${COLORS.border};
      color: ${COLORS.textMuted};
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      transition: all 0.2s ease;
      border-radius: 10px;
    }
    .btn-ghost:hover {
      border-color: rgba(201,169,110,0.4);
      color: ${COLORS.accent};
      background: ${COLORS.accentSoft};
    }
    
    .tag-pill {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.03em;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: ${COLORS.textMuted};
    }
    
    .input-field {
      background: rgba(255,255,255,0.04);
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 10px 14px;
      color: ${COLORS.text};
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      width: 100%;
      transition: border-color 0.2s ease;
    }
    .input-field:focus { border-color: rgba(201,169,110,0.5); }
    .input-field option { background: #15141f; }
    
    .glass-card {
      background: ${COLORS.glass};
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid ${COLORS.border};
      border-radius: 20px;
    }
    
    .nav-link {
      padding: 8px 16px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: all 0.2s ease;
      border: none;
      background: transparent;
      font-family: 'DM Sans', sans-serif;
    }
    
    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: #15141f;
      border: 1px solid ${COLORS.border};
      border-radius: 14px;
      padding: 8px;
      min-width: 180px;
      z-index: 100;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      animation: scaleIn 0.2s ease forwards;
    }
    .dropdown-item {
      padding: 9px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.15s ease;
      color: ${COLORS.textMuted};
    }
    .dropdown-item:hover { background: rgba(255,255,255,0.07); color: ${COLORS.text}; }
    
    .outfit-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      border: 1px dashed rgba(201,169,110,0.25);
      background: rgba(201,169,110,0.04);
      transition: all 0.3s ease;
      padding: 20px 16px;
      gap: 8px;
      animation: float 3s ease-in-out infinite;
    }
    
    .heart-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      transition: transform 0.2s ease;
      line-height: 1;
      padding: 2px;
    }
    .heart-btn:hover { transform: scale(1.3); }
    
    .shimmer-text {
      background: linear-gradient(90deg, ${COLORS.accent}, #fff, ${COLORS.accent});
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }

    .drag-zone {
      border: 2px dashed ${COLORS.border};
      border-radius: 20px;
      transition: all 0.25s ease;
    }
    .drag-zone.dragging {
      border-color: ${COLORS.accent};
      background: ${COLORS.accentSoft};
    }
    
    .page-enter { opacity: 0; animation: fadeUp 0.4s ease forwards; }
    
    @media (max-width: 640px) {
      .hide-mobile { display: none !important; }
      .mobile-full { width: 100% !important; }
    }
  `}</style>
);

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, darkMode, setDarkMode }) {
  const navItems = [
    { id: "dashboard", label: "Closet" },
    { id: "generate", label: "Generate" },
    { id: "saved", label: "Saved" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(10,10,15,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 24px",
      height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <button
        onClick={() => setPage("landing")}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "linear-gradient(135deg, #c9a96e, #e8c98a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>✦</div>
        <span className="serif" style={{ fontSize: 20, fontWeight: 600, color: COLORS.text, letterSpacing: "0.02em" }}>
          Armoire
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navItems.map(n => (
          <button
            key={n.id}
            className="nav-link"
            onClick={() => setPage(n.id)}
            style={{
              color: page === n.id ? COLORS.accent : COLORS.textMuted,
              background: page === n.id ? COLORS.accentSoft : "transparent",
            }}
          >{n.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="btn-ghost"
          onClick={() => setDarkMode(!darkMode)}
          style={{ padding: "7px 12px", fontSize: 16 }}
          title="Toggle theme"
        >{darkMode ? "☀️" : "🌙"}</button>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a96e40, #e8c98a40)",
          border: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, cursor: "pointer",
        }}>✦</div>
      </div>
    </nav>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  const [hovered, setHovered] = useState(null);
  const visible = useAnimMount(100);
  const features = [
    { icon: "📸", title: "Upload & Organize", desc: "Drag & drop your clothes, tag them, and keep everything in order" },
    { icon: "🎲", title: "Generate Outfits", desc: "Let Armoire randomly combine pieces into stunning looks" },
    { icon: "❤️", title: "Save Favorites", desc: "Bookmark outfits you love and revisit them anytime" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px", position: "relative", overflow: "hidden" }}>
      {/* Ambient bg */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", maxWidth: 680, opacity: visible ? 1 : 0, transition: "opacity 0.6s ease, transform 0.6s ease", transform: visible ? "none" : "translateY(20px)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: COLORS.accentSoft, border: `1px solid rgba(201,169,110,0.2)`, marginBottom: 32 }}>
          <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em" }}>YOUR DIGITAL WARDROBE</span>
        </div>

        <h1 className="serif shimmer-text" style={{ fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.01em" }}>
          Dress with<br />
          <em>intention.</em>
        </h1>

        <p style={{ color: COLORS.textMuted, fontSize: 18, lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
          Armoire is your personal stylist — organize every piece in your wardrobe, generate perfect outfits in seconds, and never wonder "what to wear" again.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => setPage("dashboard")} style={{ padding: "14px 36px", fontSize: 15, borderRadius: 14 }}>
            Open My Closet →
          </button>
          <button className="btn-ghost" onClick={() => setPage("generate")} style={{ padding: "14px 28px", fontSize: 15 }}>
            Generate Outfit
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 80, maxWidth: 760, width: "100%" }}>
        {features.map((f, i) => (
          <div
            key={i}
            className="glass-card card-hover"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "28px 24px", textAlign: "center",
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.3s ease`,
              transform: visible ? "none" : "translateY(20px)",
              borderColor: hovered === i ? "rgba(201,169,110,0.25)" : COLORS.border,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <p style={{ color: COLORS.textDim, fontSize: 12, marginTop: 60, letterSpacing: "0.05em" }}>
        CRAFTED WITH CARE · NO ACCOUNT NEEDED · ALL LOCAL
      </p>
    </div>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", category: "Top", tags: [], color: "", emoji: "" });
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState(1);
  const fileRef = useRef();

  const EMOJI_MAP = { Top: "👕", Bottom: "👖", Shoes: "👟", Accessory: "👜" };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    if (!form.name) setForm(f => ({ ...f, name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") }));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }, []);

  const toggleTag = (tag) => setForm(f => ({
    ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
  }));

  const handleSubmit = () => {
    if (!form.name || !form.category) return;
    onAdd({
      id: uid(), ...form,
      emoji: EMOJI_MAP[form.category],
      imageUrl: preview,
      favorite: false,
      uploadedAt: Date.now(),
    });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.2s ease",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card anim-scale-in" style={{
        width: "100%", maxWidth: 520,
        background: "#13121c",
        border: `1px solid ${COLORS.border}`,
        padding: 32,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400 }}>Add to Closet</h2>
            <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>Upload a new piece to your wardrobe</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Drop Zone */}
        <div
          className={`drag-zone ${dragging ? "dragging" : ""}`}
          style={{
            minHeight: 160, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            marginBottom: 24, cursor: "pointer", position: "relative", overflow: "hidden",
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])} />
          {preview ? (
            <img src={preview} alt="preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 16 }} />
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📸</div>
              <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Drag & drop or <span style={{ color: COLORS.accent }}>browse</span></p>
              <p style={{ color: COLORS.textDim, fontSize: 12, marginTop: 4 }}>PNG, JPG, WEBP up to 10MB</p>
            </>
          )}
        </div>

        {/* Form */}
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>ITEM NAME</label>
            <input className="input-field" placeholder="e.g. White Linen Shirt" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>CATEGORY</label>
              <select className="input-field" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>COLOR</label>
              <select className="input-field" value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}>
                <option value="">— Select —</option>
                {CLOTHING_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>TAGS</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid",
                  fontFamily: "DM Sans, sans-serif",
                  background: form.tags.includes(tag) ? COLORS.accentSoft : "transparent",
                  borderColor: form.tags.includes(tag) ? COLORS.accent : COLORS.border,
                  color: form.tags.includes(tag) ? COLORS.accent : COLORS.textMuted,
                  transition: "all 0.15s ease",
                }}>{tag}</button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} style={{ padding: "13px", marginTop: 8 }}>
            Add to Closet ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CLOTHING CARD ────────────────────────────────────────────────────────────
function ClothingCard({ item, onFavorite, onDelete, compact }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="card-hover glass-card anim-fade-up" style={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: 18, overflow: "hidden",
      position: "relative", cursor: "default",
    }}>
      {/* Image / Emoji area */}
      <div style={{
        background: `radial-gradient(circle at 40% 40%, rgba(201,169,110,0.08), transparent 70%), rgba(255,255,255,0.02)`,
        height: compact ? 100 : 140,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: compact ? 42 : 52,
        position: "relative", overflow: "hidden",
      }}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : item.emoji}
        {/* Fav button */}
        <button className="heart-btn" onClick={() => onFavorite(item.id)} style={{
          position: "absolute", top: 8, right: 8,
          filter: item.favorite ? "none" : "grayscale(1) opacity(0.4)",
        }}>
          {item.favorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: compact ? "10px 12px" : "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 500, fontSize: compact ? 13 : 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
              <span className="tag-pill" style={{ background: COLORS.accentSoft, borderColor: "rgba(201,169,110,0.2)", color: COLORS.accent }}>
                {CATEGORY_ICONS[item.category]} {item.category}
              </span>
              {item.color && <span className="tag-pill">{item.color}</span>}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", fontSize: 18, padding: "0 2px", lineHeight: 1 }}>⋯</button>
            {showMenu && (
              <div className="dropdown" style={{ left: "auto", right: 0 }}>
                <div className="dropdown-item" onClick={() => { onFavorite(item.id); setShowMenu(false); }}>
                  {item.favorite ? "💔 Unfavorite" : "❤️ Favorite"}
                </div>
                <div className="dropdown-item" onClick={() => { onDelete(item.id); setShowMenu(false); }} style={{ color: COLORS.danger }}>
                  🗑 Remove
                </div>
              </div>
            )}
          </div>
        </div>
        {!compact && item.tags.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {item.tags.slice(0, 3).map(t => <span key={t} className="tag-pill">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
function FilterBar({ activeCategory, setActiveCategory, activeTag, setActiveTag, search, setSearch }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 28 }}>
      <input
        className="input-field"
        placeholder="🔍  Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 200, padding: "8px 14px" }}
      />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} className="nav-link" onClick={() => setActiveCategory(cat === "All" ? null : cat)} style={{
            fontSize: 13, padding: "6px 14px",
            color: activeCategory === (cat === "All" ? null : cat) ? COLORS.accent : COLORS.textMuted,
            background: activeCategory === (cat === "All" ? null : cat) ? COLORS.accentSoft : "transparent",
            border: `1px solid ${activeCategory === (cat === "All" ? null : cat) ? "rgba(201,169,110,0.3)" : COLORS.border}`,
          }}>
            {cat === "All" ? cat : `${CATEGORY_ICONS[cat]} ${cat}`}
          </button>
        ))}
      </div>
      {activeTag && (
        <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setActiveTag(null)}>
          × {activeTag}
        </button>
      )}
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ items, setItems }) {
  const [showUpload, setShowUpload] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");
  const visible = useAnimMount(50);

  const handleAdd = (item) => setItems(prev => [item, ...prev]);
  const handleFavorite = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i));
  const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const filtered = items.filter(item => {
    if (activeCategory && item.category !== activeCategory) return false;
    if (activeTag && !item.tags.includes(activeTag)) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div style={{ padding: "90px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16, opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <div>
          <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, letterSpacing: "-0.01em" }}>My Closet</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 6 }}>
            {items.length} items · {items.filter(i => i.favorite).length} favorites
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(true)} style={{ padding: "12px 24px" }}>
          + Add Item
        </button>
      </div>

      <FilterBar {...{ activeCategory, setActiveCategory, activeTag, setActiveTag, search, setSearch }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>👗</div>
          <h3 className="serif" style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Your closet is empty</h3>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24 }}>Add your first piece to get started</p>
          <button className="btn-primary" onClick={() => setShowUpload(true)} style={{ padding: "12px 24px" }}>Add First Item</button>
        </div>
      ) : activeCategory ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {filtered.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${i * 40}ms` }}>
              <ClothingCard item={item} onFavorite={handleFavorite} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 22 }}>{CATEGORY_ICONS[cat]}</span>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 400 }}>{cat}s</h2>
              <div style={{ flex: 1, height: 1, background: COLORS.border, marginLeft: 8 }} />
              <span style={{ color: COLORS.textDim, fontSize: 13 }}>{catItems.length} items</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
              {catItems.map((item, i) => (
                <div key={item.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <ClothingCard item={item} onFavorite={handleFavorite} onDelete={handleDelete} compact />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onAdd={handleAdd} />}
    </div>
  );
}

// ─── GENERATE PAGE ─────────────────────────────────────────────────────────────
function GeneratePage({ items, savedOutfits, setSavedOutfits }) {
  const [outfit, setOutfit] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const visible = useAnimMount(50);

  const byCategory = (cat) => items.filter(i => i.category === cat);

  const generate = () => {
    const tops = byCategory("Top");
    const bottoms = byCategory("Bottom");
    const shoes = byCategory("Shoes");
    const accessories = byCategory("Accessory");

    if (!tops.length || !bottoms.length || !shoes.length) {
      alert("Add at least 1 Top, 1 Bottom, and 1 Shoes to generate an outfit!");
      return;
    }

    setGenerating(true);
    setSaved(false);

    setTimeout(() => {
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const newOutfit = {
        id: uid(),
        top: pick(tops),
        bottom: pick(bottoms),
        shoes: pick(shoes),
        accessory: accessories.length ? pick(accessories) : null,
        generatedAt: Date.now(),
      };
      setOutfit(newOutfit);
      setHistory(h => [newOutfit, ...h].slice(0, 5));
      setGenerating(false);
    }, 800);
  };

  const saveOutfit = () => {
    if (!outfit) return;
    setSavedOutfits(prev => {
      if (prev.find(o => o.id === outfit.id)) return prev;
      return [outfit, ...prev];
    });
    setSaved(true);
  };

  const OutfitSlot = ({ item, label, delay }) => (
    <div className="outfit-slot" style={{ animationDelay: `${delay}ms`, flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      {item ? (
        <>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 8, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.emoji}
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, textAlign: "center", maxWidth: 130 }}>{item.name}</p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {item.color && <span className="tag-pill" style={{ fontSize: 10 }}>{item.color}</span>}
          </div>
        </>
      ) : (
        <div style={{ color: COLORS.textDim, fontSize: 24 }}>—</div>
      )}
    </div>
  );

  return (
    <div style={{ padding: "90px 24px 60px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, letterSpacing: "-0.01em", marginBottom: 10 }}>Outfit Generator</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 15 }}>Let fate decide your look for today</p>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <div key={cat} className="glass-card" style={{ padding: "10px 18px", display: "flex", gap: 8, alignItems: "center" }}>
              <span>{CATEGORY_ICONS[cat]}</span>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{byCategory(cat).length} {cat}s</span>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <button className="btn-primary" onClick={generate} disabled={generating} style={{
            padding: "18px 52px", fontSize: 17, borderRadius: 18,
            position: "relative", overflow: "hidden",
            opacity: generating ? 0.8 : 1,
            animation: !outfit && !generating ? "glow 2s ease-in-out infinite" : "none",
          }}>
            {generating ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite", fontSize: 16 }}>✦</span>
                Styling...
              </span>
            ) : "✦  Generate Outfit"}
          </button>
        </div>

        {/* Outfit Display */}
        {(outfit || generating) && (
          <div className="glass-card anim-scale-in" style={{ padding: "40px 32px", marginBottom: 24, border: `1px solid rgba(201,169,110,0.15)` }}>
            {generating ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, animation: "pulse 1s ease-in-out infinite, float 2s ease-in-out infinite" }}>✦</div>
                <p style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 14 }}>Curating your look...</p>
              </div>
            ) : outfit && (
              <>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
                  <OutfitSlot item={outfit.top} label="TOP" delay={0} />
                  <OutfitSlot item={outfit.bottom} label="BOTTOM" delay={100} />
                  <OutfitSlot item={outfit.shoes} label="SHOES" delay={200} />
                  {outfit.accessory && <OutfitSlot item={outfit.accessory} label="ACCESSORY" delay={300} />}
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={saveOutfit} disabled={saved} style={{ padding: "11px 24px", opacity: saved ? 0.6 : 1 }}>
                    {saved ? "✓ Saved!" : "❤️ Save Outfit"}
                  </button>
                  <button className="btn-ghost" onClick={generate} style={{ padding: "11px 24px" }}>
                    🔀 Regenerate
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, marginBottom: 16 }}>Recent Generations</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {history.slice(1).map((h, i) => (
                <div key={h.id} className="glass-card" style={{ padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", opacity: 1 - i * 0.15, cursor: "pointer" }}
                  onClick={() => { setOutfit(h); setSaved(!!savedOutfits.find(o => o.id === h.id)); }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[h.top, h.bottom, h.shoes].map((item, j) => (
                      <div key={j} style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden" }}>
                        {item?.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item?.emoji}
                      </div>
                    ))}
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
                    {h.top?.name} · {h.bottom?.name} · {h.shoes?.name}
                  </div>
                  <div style={{ marginLeft: "auto", color: COLORS.textDim, fontSize: 12 }}>
                    {new Date(h.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SAVED OUTFITS PAGE ────────────────────────────────────────────────────────
function SavedPage({ savedOutfits, setSavedOutfits }) {
  const visible = useAnimMount(50);
  const removeOutfit = (id) => setSavedOutfits(prev => prev.filter(o => o.id !== id));

  return (
    <div style={{ padding: "90px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, letterSpacing: "-0.01em" }}>Saved Outfits</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 6 }}>{savedOutfits.length} outfit{savedOutfits.length !== 1 ? "s" : ""} saved</p>
        </div>

        {savedOutfits.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💫</div>
            <h3 className="serif" style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>No saved outfits yet</h3>
            <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Generate and save outfits to see them here</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {savedOutfits.map((outfit, i) => (
              <div
                key={outfit.id}
                className="glass-card card-hover"
                style={{ padding: 24, animationDelay: `${i * 60}ms` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14 }}>Outfit #{savedOutfits.length - i}</p>
                    <p style={{ color: COLORS.textDim, fontSize: 11, marginTop: 2 }}>
                      {new Date(outfit.generatedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <button onClick={() => removeOutfit(outfit.id)} style={{ background: "none", border: "none", color: COLORS.danger, cursor: "pointer", fontSize: 16, opacity: 0.7, transition: "opacity 0.15s ease" }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.7}>
                    🗑
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { item: outfit.top, label: "Top" },
                    { item: outfit.bottom, label: "Bottom" },
                    { item: outfit.shoes, label: "Shoes" },
                    outfit.accessory && { item: outfit.accessory, label: "Accessory" },
                  ].filter(Boolean).map(({ item, label }) => (
                    <div key={label} style={{
                      background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "12px",
                      border: `1px solid ${COLORS.border}`, display: "flex", gap: 10, alignItems: "center",
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden", flexShrink: 0 }}>
                        {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.emoji}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: "0.06em" }}>{label.toUpperCase()}</p>
                        <p style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[outfit.top, outfit.bottom, outfit.shoes, outfit.accessory].filter(Boolean).flatMap(i => i.tags || []).filter((t, i, a) => a.indexOf(t) === i).slice(0, 4).map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // Apply dark/light mode body override
  useEffect(() => {
    document.body.style.background = darkMode ? COLORS.bg : "#f4f1ec";
    document.body.style.color = darkMode ? COLORS.text : "#1a1814";
  }, [darkMode]);

  const renderPage = () => {
    const props = { items, setItems, savedOutfits, setSavedOutfits, setPage };
    switch (page) {
      case "landing": return <LandingPage setPage={setPage} />;
      case "dashboard": return <DashboardPage {...props} />;
      case "generate": return <GeneratePage {...props} />;
      case "saved": return <SavedPage {...props} />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: COLORS.bg }}>
        {page !== "landing" && (
          <Navbar page={page} setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
        <main key={page} className="page-enter">
          {renderPage()}
        </main>
      </div>
    </>
  );
}
