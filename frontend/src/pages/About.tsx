
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import aboutBg from "../assets/logo/aboutUs.jpeg";

const LOGO = "https://cdn-icons-png.flaticon.com/128/3183/3183463.png";

const About: React.FC = () => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <div style={{ 
        padding: "35px 80px 0px 80px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "50px",
          padding: "10px 30px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "80%",
          boxSizing: "border-box",
          gap: "30px"
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <img src={LOGO} alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <span style={{ color: "#1f2937", fontSize: "15px", fontWeight: "700", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
              Recipe <span style={{ color: "#d97706" }}>Finder</span>
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <div style={{ display: "flex", gap: "30px", alignItems: "center", margin: "0 auto" }}>
            <Link to="/home" style={{ 
              textDecoration: "none",
              color: "#6b7280", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")} 
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <img src="https://cdn-icons-png.flaticon.com/128/747/747376.png" alt="Home" style={{ width: "16px", height: "16px" }} />
              Home
            </Link>

            <Link to="/favorites" style={{ 
              textDecoration: "none",
              color: "#6b7280", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s"
            }} 
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")} 
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <img src="https://cdn-icons-png.flaticon.com/128/833/833472.png" alt="Favorites" style={{ width: "16px", height: "16px" }} />
              Favorites
            </Link>

            <Link to="/mealplanner" style={{ 
              textDecoration: "none",
              color: "#6b7280", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s"
            }} 
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")} 
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <img src="https://cdn-icons-png.flaticon.com/128/3145/3145768.png" alt="Meal Planner" style={{ width: "16px", height: "16px" }} />
              Meal Planner
            </Link>

            <Link to="/about" style={{ 
              textDecoration: "none",
              color: "#d97706", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              paddingBottom: "4px",
              borderBottom: "3px solid #d97706",
              transition: "color 0.2s"
            }}>
              <img src="https://cdn-icons-png.flaticon.com/128/1995/1995505.png" alt="About Us" style={{ width: "16px", height: "16px" }} />
              About Us
            </Link>
          </div>

          {/* Auth section - Right */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
            {isLoggedIn ? (
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    cursor: "pointer", 
                    padding: "6px 12px", 
                    borderRadius: "20px",
                    background: "#e8f5e9",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#c8e6c9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#e8f5e9")}
                >
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#7C9653", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "11px" }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span style={{ color: "#1f2937", fontWeight: "500", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>{user.name || "User"}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#6b7280" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {userMenuOpen && (
                  <div style={{ 
                    position: "absolute", 
                    right: 0, 
                    top: "100%", 
                    background: "#fff", 
                    borderRadius: "8px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
                    minWidth: "180px", 
                    padding: "8px", 
                    zIndex: 1001, 
                    marginTop: "6px"
                  }}>
                    <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "6px", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#7C9653", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "#1a1a1a", fontSize: "12px" }}>{user.name}</div>
                          <div style={{ color: "#6b7280", fontSize: "10px" }}>{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                      style={{ 
                        width: "100%", 
                        padding: "6px", 
                        background: "#fef2f2", 
                        border: "1px solid #fca5a5", 
                        borderRadius: "4px", 
                        color: "#e05a5a", 
                        fontWeight: "500", 
                        fontSize: "12px", 
                        cursor: "pointer", 
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button
                    style={{ 
                      background: "transparent", 
                      border: "none", 
                      color: "#6b7280", 
                      fontSize: "13px", 
                      fontWeight: "500", 
                      padding: "6px 12px", 
                      cursor: "pointer", 
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                  >
                    Log In
                  </button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button
                    style={{ 
                      background: "#7c9653", 
                      color: "white", 
                      border: "none", 
                      padding: "8px 16px", 
                      borderRadius: "4px", 
                      fontSize: "13px", 
                      fontWeight: "500", 
                      cursor: "pointer", 
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#6a8347")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#7c9653")}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={{ backgroundImage: `url(${aboutBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", padding: "140px 0 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.85)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ background: "#f0f0e8", border: "1px solid #d4d0c8", borderRadius: "20px", padding: "4px 16px", fontSize: "11px", fontWeight: "600", color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase" }}>About Recipe Finder</span>
        </div>
        <h1 style={{ textAlign: "center", fontWeight: "900", fontSize: "42px", color: "#1a1a1a", lineHeight: "1.2", marginBottom: "0.5rem", fontFamily: "'Georgia', serif" }}>Your Kitchen Companion</h1>
        <h1 style={{ textAlign: "center", fontWeight: "900", fontSize: "42px", color: "#d97941", lineHeight: "1.2", marginBottom: "1rem", fontFamily: "'Georgia', serif" }}>for Smarter, Healthier Cooking</h1>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "15px", lineHeight: "1.7", maxWidth: "720px", margin: "0 auto 2.5rem" }}>
          Your all-in-one platform for discovering, saving, and planning delicious meals —<br />
          built for home cooks who love great food and everyday simplicity.
        </p>
        

      {/* OUR PURPOSE — aboutUs.jpeg bg */}
      <div style={{ 
        backgroundImage: `url(${aboutBg})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.45)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2rem", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{ background: "rgba(255, 248, 240, 0.95)", border: "1px solid #f0d0b0", borderRadius: "20px", padding: "6px 18px", fontSize: "11px", fontWeight: "600", color: "#d97941", letterSpacing: "1.5px", textTransform: "uppercase", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>Our Purpose</span>
          <h2 style={{ fontWeight: "900", fontSize: "32px", color: "#1a1a1a", margin: "1.5rem 0 1rem", fontFamily: "'Georgia', serif", textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}>
            Making Home Cooking Easier, Healthier & More Enjoyable
          </h2>
          <p style={{ color: "#2d3748", fontSize: "16px", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto", fontWeight: "500", textShadow: "0 1px 1px rgba(255,255,255,0.7)" }}>
            At Recipe Finder, our mission is to help you cook with confidence and creativity. We provide thousands of easy-to-follow,
            handpicked recipes for everyday meals, special occasions, and everything in between. Whether you're cooking for one, your family,
            or a crowd, we make it simple to eat well and enjoy every bite.
          </p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: "#e8f0e0", padding: "3rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ background: "#eef0e8", border: "1px solid #d0d4c0", borderRadius: "20px", padding: "4px 16px", fontSize: "11px", fontWeight: "600", color: "#7C9653", letterSpacing: "1.5px", textTransform: "uppercase" }}>How It Works</span>
        </div>
        <h2 style={{ textAlign: "center", fontWeight: "900", fontSize: "28px", color: "#1a1a1a", marginBottom: "2rem", fontFamily: "'Georgia', serif" }}>
          Find. Save. Plan. Cook. All in One Place.
        </h2>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0", width: "100%" }}>
          {[
            { step: "1", icon: "https://cdn-icons-png.flaticon.com/128/751/751463.png", title: "Search Recipes", desc: "Find the perfect dish seconds with smart, easy search." },
            { step: "2", icon: "https://cdn-icons-png.flaticon.com/128/716/716784.png", title: "Browse Categories", desc: "Explore a wide range of cuisines, diets, and meal types." },
            { step: "3", icon: "https://cdn-icons-png.flaticon.com/128/833/833472.png", title: "Save Favorites", desc: "Bookmark recipes you love and access them anytime." },
            { step: "4", icon: "https://cdn-icons-png.flaticon.com/128/2693/2693507.png", title: "Plan Meals", desc: "Organize your weekly meals and create shopping lists." },
            { step: "5", icon: "https://cdn-icons-png.flaticon.com/128/1046/1046784.png", title: "Cook with Confidence", desc: "Follow clear instructions for perfect results every time." },
            { step: "6", icon: "https://cdn-icons-png.flaticon.com/128/1256/1256650.png", title: "Enjoy & Share", desc: "Enjoy delicious meals and share with family and friends." },
          ].map((s, i, arr) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ background: "rgba(255,252,248,0.9)", borderRadius: "12px", padding: "1.8rem 1rem 1.4rem", textAlign: "center", position: "relative", flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.13)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#7C9653", color: "#fff", fontWeight: "800", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.step}</div>
                <img src={s.icon} alt={s.title} style={{ width: "40px", height: "40px", objectFit: "contain", marginBottom: "8px", marginTop: "4px" }} />
                <div style={{ fontWeight: "700", fontSize: "12px", color: "#1a1a1a", marginBottom: "4px" }}>{s.title}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: "1.5" }}>{s.desc}</div>
              </div>
              {i < arr.length - 1 && <div style={{ color: "#9ca3af", fontSize: "18px", padding: "0 4px", flexShrink: 0 }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* WHAT YOU'LL FIND */}
      <div style={{ background: "#ffffff", padding: "2.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <span style={{ background: "#fff8f0", border: "1px solid #f0d0b0", borderRadius: "20px", padding: "4px 16px", fontSize: "11px", fontWeight: "600", color: "#d97941", letterSpacing: "1.5px", textTransform: "uppercase" }}>What You'll Find</span>
        </div>
        <h2 style={{ textAlign: "center", fontWeight: "900", fontSize: "24px", color: "#1a1a1a", marginBottom: "1.5rem", fontFamily: "'Georgia', serif" }}>
          Everything You Need for a Better Cooking Experience
        </h2>
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=180&fit=crop", icon: "https://cdn-icons-png.flaticon.com/128/2515/2515183.png", title: "Healthy & Nutritious", desc: "Wholesome recipes for balanced and mindful eating." },
            { img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=180&fit=crop", icon: "https://cdn-icons-png.flaticon.com/128/3075/3075977.png", title: "Quick & Easy", desc: "Simple recipes for busy days, ready in less time." },
            { img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=300&h=180&fit=crop", icon: "https://cdn-icons-png.flaticon.com/128/10552/10552112.png", title: "Seasonal & Fresh", desc: "Make the most of fresh ingredients all year round." },
            { img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=180&fit=crop", icon: "https://cdn-icons-png.flaticon.com/128/3081/3081840.png", title: "Treats & Special Occasions", desc: "Delicious desserts and celebration-worthy dishes." },
            { img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=180&fit=crop", icon: "https://cdn-icons-png.flaticon.com/128/2693/2693507.png", title: "Meal Planning Tools", desc: "Plan meals, create grocery lists, and stay organized." },
            { img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=180&fit=crop", icon: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png", title: "Personalized for You", desc: "Get suggestions tailored to your tastes and lifestyle." },
          ].map(c => (
            <div key={c.title} style={{ flex: 1, background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s, transform 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.13)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <img src={c.img} alt={c.title} style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "10px 10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                  <img src={c.icon} alt="" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                  <span style={{ fontWeight: "700", fontSize: "12px", color: "#1a1a1a" }}>{c.title}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <div style={{ padding: "0.5rem 2rem 1.5rem" }}>
        <div style={{ background: "#fdf0e8", borderRadius: "12px", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", border: "1px solid #f5d5b8", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src="https://cdn-icons-png.flaticon.com/128/1279/1279504.png" alt="Chef" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#d97941", padding: "8px", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", color: "#1a1a1a", marginBottom: "3px" }}>Ready to make cooking easier, healthier, and more enjoyable?</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Discover new recipes, stay organized, and enjoy the journey — one delicious meal at a time.</div>
            </div>
          </div>
          <button onClick={() => navigate("/home")}
            style={{ padding: "10px 22px", background: "#d97941", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c17a4a")}
            onMouseLeave={e => (e.currentTarget.style.background = "#d97941")}
          >
            Get Started →
          </button>
        </div>
      </div>

        </div>
      </div>
    </div>
  );
};

export default About;

