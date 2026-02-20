"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const WINE_REGIONS = {
  "Napa Valley, California": { lat: 38.5025, lng: -122.2654, country: "USA", description: "World-class Cab Sauv country", icon: "🍇" },
  "Sonoma County, California": { lat: 38.2921, lng: -122.458, country: "USA", description: "Diverse wines, relaxed vibes", icon: "🌿" },
  "Paso Robles, California": { lat: 35.6266, lng: -120.691, country: "USA", description: "Bold reds, emerging gem", icon: "🌄" },
  "Santa Barbara, California": { lat: 34.6148, lng: -120.0381, country: "USA", description: "Pinot & Chard paradise", icon: "🏖" },
  "Willamette Valley, Oregon": { lat: 45.0721, lng: -123.0868, country: "USA", description: "Premier Pinot Noir", icon: "🌲" },
  "Walla Walla, Washington": { lat: 46.0646, lng: -118.343, country: "USA", description: "Rich Syrah & Cab blends", icon: "🏔" },
  "Bordeaux, France": { lat: 44.8378, lng: -0.5792, country: "France", description: "Iconic Cab & Merlot blends", icon: "🏰" },
  "Burgundy, France": { lat: 47.0522, lng: 4.3834, country: "France", description: "Legendary Pinot & Chard", icon: "🍷" },
  "Champagne, France": { lat: 49.2583, lng: 3.77, country: "France", description: "The sparkling OG", icon: "🥂" },
  "Loire Valley, France": { lat: 47.3941, lng: 0.6848, country: "France", description: "Chenin & Sauv Blanc", icon: "🌸" },
  "Rhône Valley, France": { lat: 44.127, lng: 4.8057, country: "France", description: "Syrah & Grenache heartland", icon: "☀️" },
  "Provence, France": { lat: 43.5298, lng: 5.4474, country: "France", description: "World-famous rosé", icon: "🌹" },
  "Tuscany, Italy": { lat: 43.3188, lng: 11.3308, country: "Italy", description: "Sangiovese & Chianti", icon: "🇮🇹" },
  "Piedmont, Italy": { lat: 44.6942, lng: 8.0354, country: "Italy", description: "Barolo & Barbaresco", icon: "⛰" },
  "Veneto, Italy": { lat: 45.4415, lng: 12.3326, country: "Italy", description: "Prosecco & Amarone", icon: "🫧" },
  "Rioja, Spain": { lat: 42.465, lng: -2.4456, country: "Spain", description: "Tempranillo tradition", icon: "🇪🇸" },
  "Ribera del Duero, Spain": { lat: 41.632, lng: -3.7043, country: "Spain", description: "Powerful Tempranillo", icon: "🏜" },
  "Douro Valley, Portugal": { lat: 41.162, lng: -7.7889, country: "Portugal", description: "Port wine & bold reds", icon: "⛵" },
  "Mendoza, Argentina": { lat: -32.8895, lng: -68.8458, country: "Argentina", description: "Malbec at altitude", icon: "🏔" },
  "Barossa Valley, Australia": { lat: -34.561, lng: 138.9519, country: "Australia", description: "Bold Shiraz country", icon: "🦘" },
  "Margaret River, Australia": { lat: -33.9535, lng: 115.0732, country: "Australia", description: "Premium Cab & Chard", icon: "🏄" },
  "Marlborough, New Zealand": { lat: -41.5134, lng: 173.9612, country: "New Zealand", description: "Sauv Blanc capital", icon: "🐑" },
  "Central Otago, New Zealand": { lat: -45.0312, lng: 169.1862, country: "New Zealand", description: "Southernmost Pinot", icon: "❄️" },
  "Stellenbosch, South Africa": { lat: -33.9321, lng: 18.8602, country: "South Africa", description: "Cape Winelands", icon: "🌍" },
  "Mosel, Germany": { lat: 49.9929, lng: 6.5826, country: "Germany", description: "Steep-slope Riesling", icon: "🍋" },
};

const VIBES = [
  { id: "luxury", label: "Luxury & Prestige", emoji: "✨", color: "#E8D5B7" },
  { id: "casual", label: "Laid-Back & Chill", emoji: "☀️", color: "#F5E6C8" },
  { id: "romantic", label: "Romantic Escape", emoji: "🕯", color: "#F2D5D5" },
  { id: "educational", label: "Wine Nerd Mode", emoji: "🧪", color: "#D5E0E8" },
  { id: "foodie", label: "Food + Wine", emoji: "🍽", color: "#E2D8EF" },
  { id: "adventure", label: "Adventure Day", emoji: "🚴", color: "#D5E8D9" },
];

const GROUPS = [
  { id: "couple", label: "Couple", emoji: "💕" },
  { id: "friends", label: "Friends", emoji: "👯" },
  { id: "solo", label: "Solo", emoji: "🧘" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "corporate", label: "Team Outing", emoji: "💼" },
  { id: "bachelorette", label: "Bach Party", emoji: "🎉" },
];

const BUDGETS = [
  { id: "budget", label: "$", desc: "Budget-friendly" },
  { id: "moderate", label: "$$", desc: "Moderate" },
  { id: "splurge", label: "$$$", desc: "Splurge" },
  { id: "no_limit", label: "$$$$", desc: "No limit" },
];

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

function StopCard({ stop, index, isLast, isActive, onClick }) {
  const resColors = { "Walk-in": "#5B8C5A", Recommended: "#C49B3F", Required: "#C4705A" };
  const typeEmoji = { winery: "🍷", restaurant: "🍴", experience: "⭐" };

  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 9,
          background: index === 0 ? "linear-gradient(135deg,#C4705A,#E8967E)" : isActive ? "#5B5F52" : "#E8E2DA",
          color: index === 0 || isActive ? "#fff" : "#8A8478",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, transition: "all 0.2s",
        }}>{index + 1}</div>
        {!isLast && <div style={{ width: 2, flex: 1, minHeight: 16, background: "#E8E2DA" }} />}
      </div>
      <div onClick={onClick} style={{
        flex: 1, background: isActive ? "#fff" : "#FDFBF8",
        borderRadius: 14, padding: "14px 16px", marginBottom: isLast ? 0 : 8,
        cursor: "pointer",
        border: isActive ? "1.5px solid #C4705A" : "1px solid #EDE8E1",
        boxShadow: isActive ? "0 6px 24px rgba(196,112,90,0.12)" : "0 1px 3px rgba(0,0,0,0.03)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {stop.time && (
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#C4705A",
                  background: "#FDF3EF", padding: "3px 10px", borderRadius: 20,
                }}>{stop.time}</span>
              )}
              <span style={{ fontSize: 13 }}>{typeEmoji[stop.type] || "📍"}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#3D3A35" }}>{stop.name}</span>
            </div>
            {stop.subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#A09A90" }}>{stop.subtitle}</p>}
          </div>
          {stop.rating && (
            <div style={{
              background: "linear-gradient(135deg,#5B5F52,#7A7E6F)", color: "#fff",
              padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            }}>★ {stop.rating}</div>
          )}
        </div>
        {isActive && (
          <div style={{
            marginTop: 14, fontSize: 13, color: "#5C574F", lineHeight: 1.65,
            animation: "fadeUp 0.3s ease",
          }}>
            {stop.vibe && (
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <span style={tagStyle("#F5EDE8")}>🌿 {stop.vibe}</span>
              </div>
            )}
            {stop.wineHighlights && (
              <p style={{ margin: "0 0 8px" }}>
                <span style={{ fontWeight: 600, color: "#3D3A35" }}>Must-try →</span> {stop.wineHighlights}
              </p>
            )}
            {stop.wineRating && (
              <p style={{ margin: "0 0 8px" }}>
                <span style={{ fontWeight: 600, color: "#3D3A35" }}>Ratings →</span> {stop.wineRating}
              </p>
            )}
            {stop.reservation && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, color: "#3D3A35" }}>Reso →</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: resColors[stop.reservation] || "#888",
                  background: `${resColors[stop.reservation] || "#888"}15`,
                  padding: "3px 10px", borderRadius: 20,
                }}>{stop.reservation}</span>
                {stop.reservationNote && <span style={{ fontSize: 12, color: "#A09A90" }}>{stop.reservationNote}</span>}
              </div>
            )}
            {stop.driveTime && (
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#A09A90" }}>🚗 {stop.driveTime}</p>
            )}
            {stop.proTip && (
              <div style={{
                marginTop: 10, padding: "10px 14px",
                background: "linear-gradient(135deg,#FDF8F0,#FFF5E9)", borderRadius: 10,
                border: "1px solid #F0E4D0", fontSize: 12, color: "#8A7750",
              }}>
                💡 <strong>Pro tip:</strong> {stop.proTip}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const tagStyle = (bg) => ({
  fontSize: 11, padding: "4px 12px", borderRadius: 20,
  background: bg, color: "#6B665E", fontWeight: 500,
});

function PillSelect({ options, value, onChange, multi = false }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            style={{
              padding: "8px 16px", borderRadius: 24,
              border: selected ? "2px solid #C4705A" : "1.5px solid #E8E2DA",
              background: selected ? "linear-gradient(135deg,#FDF3EF,#FFF8F5)" : "#FDFBF8",
              color: selected ? "#C4705A" : "#7A756C",
              fontWeight: selected ? 700 : 500,
              fontSize: 13, fontFamily: "'Outfit', sans-serif",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: selected ? "0 2px 12px rgba(196,112,90,0.12)" : "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            {o.emoji && <span>{o.emoji}</span>}
            <span>{o.label}</span>
            {o.desc && <span style={{ fontSize: 11, opacity: 0.6 }}>· {o.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vibe, setVibe] = useState("");
  const [group, setGroup] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [activeStop, setActiveStop] = useState(0);
  const [step, setStep] = useState(0);

  const canGenerate = region && startDate && endDate && vibe;
  const regionInfo = region ? WINE_REGIONS[region] : null;

  const regionsByCountry = {};
  Object.entries(WINE_REGIONS).forEach(([name, info]) => {
    if (!regionsByCountry[info.country]) regionsByCountry[info.country] = [];
    regionsByCountry[info.country].push({ name, ...info });
  });

  async function generate() {
    setLoading(true); setError(""); setItinerary(null); setStep(1);
    const vibeInfo = VIBES.find(v => v.id === vibe);
    const groupInfo = GROUPS.find(g => g.id === group);
    const budgetInfo = BUDGETS.find(b => b.id === budget);
    const r = WINE_REGIONS[region];

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region, startDate, endDate,
          vibe: `${vibeInfo?.label} — ${vibeInfo?.emoji}`,
          group: groupInfo?.label || "",
          budget: `${budgetInfo?.label || ""} ${budgetInfo?.desc || ""}`,
          regionLat: r.lat,
          regionLng: r.lng,
        }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Server error");
      const parsed = await response.json();
      setItinerary(parsed);
      setActiveDay(0); setActiveStop(0);
    } catch (e) {
      console.error(e);
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStops = itinerary?.days?.[activeDay]?.stops || [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #F9F6F1 0%, #F3EDE4 50%, #EDE7DC 100%)",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes gentlePulse { 0%,100% { opacity:1 } 50% { opacity:0.6 } }
        @keyframes gradientShift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        ::selection { background: #C4705A30; }
        ::-webkit-scrollbar { width: 5px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: #D4CFC6; border-radius: 10px }
      `}</style>

      <div style={{
        padding: "40px 32px 32px",
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #C4705A, #E8967E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 16px rgba(196,112,90,0.25)",
            }}>🍷</div>
            <div>
              <h1 style={{
                margin: 0, fontSize: 26,
                fontFamily: "'Fraunces', serif", fontWeight: 700,
                color: "#3D3A35", letterSpacing: "-0.03em",
              }}>vine route</h1>
            </div>
          </div>
          <p style={{
            margin: "8px 0 0 52px", fontSize: 14, color: "#A09A90", fontWeight: 400,
            maxWidth: 400, lineHeight: 1.5,
          }}>
            pick a region, set the vibe, get an AI-crafted driving itinerary with ratings & reservation intel
          </p>
        </div>
        {step === 1 && itinerary && (
          <button onClick={() => { setStep(0); setItinerary(null); }}
            style={{
              padding: "10px 20px", borderRadius: 24,
              border: "1.5px solid #E8E2DA", background: "#FDFBF8",
              color: "#7A756C", fontWeight: 600, fontSize: 13,
              fontFamily: "'Outfit',sans-serif", cursor: "pointer",
            }}>← New trip</button>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 60px" }}>

        {step === 0 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>

            <div style={{
              background: "#fff", borderRadius: 20, padding: "28px 32px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)", border: "1px solid #EDE8E1",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: "#C4705A", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                }}>1</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#3D3A35" }}>Where to?</span>
              </div>
              {Object.entries(regionsByCountry).map(([country, regions]) => (
                <div key={country} style={{ marginBottom: 12 }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: "#A09A90",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    marginBottom: 8,
                  }}>{country}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {regions.map((r) => {
                      const sel = region === r.name;
                      return (
                        <button key={r.name} onClick={() => setRegion(r.name)}
                          style={{
                            padding: "8px 14px", borderRadius: 24,
                            border: sel ? "2px solid #C4705A" : "1.5px solid #EDE8E1",
                            background: sel ? "linear-gradient(135deg,#FDF3EF,#FFF8F5)" : "#FDFBF8",
                            color: sel ? "#C4705A" : "#7A756C",
                            fontWeight: sel ? 700 : 500, fontSize: 13,
                            fontFamily: "'Outfit',sans-serif", cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: sel ? "0 2px 12px rgba(196,112,90,0.1)" : "none",
                            display: "flex", alignItems: "center", gap: 6,
                          }}>
                          <span>{r.icon}</span>
                          <span>{r.name.split(",")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#fff", borderRadius: 20, padding: "28px 32px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)", border: "1px solid #EDE8E1",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: "#C4705A", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                }}>2</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#3D3A35" }}>When?</span>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <label style={fLabel}>Start date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    style={dateInput} />
                </div>
                <div>
                  <label style={fLabel}>End date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    min={startDate} style={dateInput} />
                </div>
              </div>
            </div>

            <div style={{
              background: "#fff", borderRadius: 20, padding: "28px 32px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)", border: "1px solid #EDE8E1",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: "#C4705A", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                }}>3</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#3D3A35" }}>What's the vibe?</span>
              </div>
              <PillSelect options={VIBES} value={vibe} onChange={setVibe} />
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
            }}>
              <div style={{
                background: "#fff", borderRadius: 20, padding: "24px 28px",
                boxShadow: "0 2px 20px rgba(0,0,0,0.04)", border: "1px solid #EDE8E1",
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#3D3A35", marginBottom: 12 }}>Who's coming?</p>
                <PillSelect options={GROUPS} value={group} onChange={setGroup} />
              </div>
              <div style={{
                background: "#fff", borderRadius: 20, padding: "24px 28px",
                boxShadow: "0 2px 20px rgba(0,0,0,0.04)", border: "1px solid #EDE8E1",
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#3D3A35", marginBottom: 12 }}>Budget</p>
                <PillSelect options={BUDGETS} value={budget} onChange={setBudget} />
              </div>
            </div>

            <button onClick={generate} disabled={!canGenerate}
              style={{
                width: "100%", padding: "16px 32px", borderRadius: 16,
                border: "none",
                background: canGenerate
                  ? "linear-gradient(135deg, #C4705A 0%, #D4846F 50%, #C4705A 100%)"
                  : "#D4CFC6",
                backgroundSize: "200% 200%",
                animation: canGenerate ? "gradientShift 3s ease infinite" : "none",
                color: "#fff", fontSize: 16, fontWeight: 700,
                fontFamily: "'Outfit',sans-serif", cursor: canGenerate ? "pointer" : "not-allowed",
                boxShadow: canGenerate ? "0 8px 32px rgba(196,112,90,0.3)" : "none",
                transition: "all 0.3s",
                letterSpacing: "0.01em",
              }}>
              {canGenerate ? "✨ Plan my trip" : "Fill in the details above to get started"}
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>

            {loading && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "80px 20px", gap: 20,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "linear-gradient(135deg,#C4705A,#E8967E)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, animation: "gentlePulse 1.5s ease infinite",
                  boxShadow: "0 8px 32px rgba(196,112,90,0.25)",
                }}>🍷</div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#3D3A35", margin: "0 0 4px" }}>
                    Crafting your itinerary...
                  </p>
                  <p style={{ fontSize: 13, color: "#A09A90" }}>
                    Searching for the best stops, ratings & reservation info
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div style={{
                padding: 24, background: "#FFF5F3", borderRadius: 16,
                border: "1px solid #F0D5CE", textAlign: "center",
              }}>
                <p style={{ fontSize: 14, color: "#C4705A", fontWeight: 600 }}>{error}</p>
                <button onClick={() => setStep(0)} style={{
                  marginTop: 12, padding: "8px 20px", borderRadius: 24,
                  border: "1.5px solid #C4705A", background: "transparent",
                  color: "#C4705A", fontWeight: 600, fontSize: 13,
                  fontFamily: "'Outfit',sans-serif", cursor: "pointer",
                }}>← Go back</button>
              </div>
            )}

            {itinerary && (
              <>
                <div style={{
                  background: "linear-gradient(135deg, #C4705A10, #E8967E08)",
                  borderRadius: 20, padding: "28px 32px", marginBottom: 20,
                  border: "1px solid #EDE8E1",
                }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: "#C4705A",
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    marginBottom: 6,
                  }}>Your itinerary</p>
                  <h2 style={{
                    fontFamily: "'Fraunces', serif", fontSize: 28,
                    color: "#3D3A35", margin: "0 0 8px", fontWeight: 700,
                    letterSpacing: "-0.03em",
                  }}>{itinerary.title}</h2>
                  <p style={{ fontSize: 14, color: "#7A756C", lineHeight: 1.6, margin: 0 }}>
                    {itinerary.summary}
                  </p>
                </div>

                {itinerary.days?.length > 1 && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {itinerary.days.map((day, i) => (
                      <button key={i} onClick={() => { setActiveDay(i); setActiveStop(0); }}
                        style={{
                          padding: "10px 22px", borderRadius: 24,
                          border: activeDay === i ? "2px solid #C4705A" : "1.5px solid #E8E2DA",
                          background: activeDay === i ? "linear-gradient(135deg,#C4705A,#D4846F)" : "#fff",
                          color: activeDay === i ? "#fff" : "#7A756C",
                          fontWeight: 700, fontSize: 13,
                          fontFamily: "'Outfit',sans-serif", cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow: activeDay === i ? "0 4px 16px rgba(196,112,90,0.2)" : "none",
                        }}>
                        Day {day.dayNumber} · {day.title}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{
                  display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
                  gap: 16, minHeight: 540,
                }}>
                  <div style={{
                    borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    border: "1px solid #EDE8E1",
                  }}>
                    <MapView stops={currentStops} regionLat={regionInfo?.lat} regionLng={regionInfo?.lng} />
                  </div>

                  <div style={{
                    background: "#fff", borderRadius: 20,
                    padding: "24px 20px", border: "1px solid #EDE8E1",
                    overflowY: "auto", maxHeight: 600,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                  }}>
                    <p style={{
                      fontSize: 11, fontWeight: 700, color: "#A09A90",
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      marginBottom: 16,
                    }}>
                      {itinerary.days?.[activeDay]?.title || `Day ${activeDay + 1}`} · {currentStops.length} stops
                    </p>

                    {currentStops.map((stop, i) => (
                      <StopCard key={i} stop={stop} index={i}
                        isLast={i === currentStops.length - 1}
                        isActive={activeStop === i}
                        onClick={() => setActiveStop(activeStop === i ? -1 : i)}
                      />
                    ))}
                  </div>
                </div>

                {(itinerary.packingTips || itinerary.bestTimeToVisit) && (
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: 16, marginTop: 16,
                  }}>
                    {itinerary.packingTips && (
                      <div style={{
                        padding: "20px 24px", background: "#fff",
                        borderRadius: 16, border: "1px solid #EDE8E1",
                      }}>
                        <p style={{
                          fontSize: 11, fontWeight: 700, color: "#C4705A",
                          textTransform: "uppercase", letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}>🧳 Packing tips</p>
                        <p style={{ fontSize: 13, color: "#5C574F", lineHeight: 1.6, margin: 0 }}>
                          {itinerary.packingTips}
                        </p>
                      </div>
                    )}
                    {itinerary.bestTimeToVisit && (
                      <div style={{
                        padding: "20px 24px", background: "#fff",
                        borderRadius: 16, border: "1px solid #EDE8E1",
                      }}>
                        <p style={{
                          fontSize: 11, fontWeight: 700, color: "#5B8C5A",
                          textTransform: "uppercase", letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}>📅 Best time to visit</p>
                        <p style={{ fontSize: 13, color: "#5C574F", lineHeight: 1.6, margin: 0 }}>
                          {itinerary.bestTimeToVisit}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const fLabel = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "#A09A90", textTransform: "uppercase",
  letterSpacing: "0.08em", marginBottom: 6,
};

const dateInput = {
  padding: "10px 14px", borderRadius: 12,
  border: "1.5px solid #EDE8E1", background: "#FDFBF8",
  fontSize: 14, fontFamily: "'Outfit',sans-serif",
  color: "#3D3A35", outline: "none", cursor: "pointer",
  minWidth: 180,
};
