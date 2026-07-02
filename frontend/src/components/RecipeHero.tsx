import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPrompt from "./LoginPrompt.tsx";
import headerBg from "../assets/logo/headerbg.png";

const LOGO = "https://cdn-icons-png.flaticon.com/128/3183/3183463.png";

interface HeroProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (v: boolean) => void;
}

const RecipeHero: React.FC<HeroProps> = ({ searchQuery, onSearch, isLoggedIn = false, setIsLoggedIn }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn?.(false);
    navigate("/");
  };

  const categories = [
    { icon: "https://cdn-icons-png.flaticon.com/128/8775/8775411.png", label: "Vegetarian" },
    { icon: "https://cdn-icons-png.flaticon.com/128/668/668219.png", label: "Quick & Easy" },
    { icon: "https://cdn-icons-png.flaticon.com/128/6566/6566011.png", label: "Healthy" },
    { icon: "https://cdn-icons-png.flaticon.com/128/13280/13280447.png", label: "Dinner" },
    { icon: "https://cdn-icons-png.flaticon.com/128/11899/11899746.png", label: "Dessert" },
    { icon: "https://cdn-icons-png.flaticon.com/128/2652/2652631.png", label: "Breakfast" },
  ];

  return (
    <div 
      style={{ 
        background: "#faf8f3",
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        margin: "0",
        position: "relative",
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingTop: "20px",
        boxSizing: "border-box"
      }}
    >
      {showPrompt && <LoginPrompt message="Log in to search and filter recipes." onClose={() => setShowPrompt(false)} />}
      
      {/* Navbar - Full width horizontal design */}
      <div style={{ 
        padding: "15px 80px 0px 80px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
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
              paddingBottom: "4px",
              borderBottom: "3px solid #d97706",
              transition: "color 0.2s"
            }}>
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

      {/* Hero Content - Below navbar, inside same background */}
      <div style={{ 
        padding: "100px 120px 0px 250px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        gap: "80px", 
        flex: 1,
        marginTop: "0"
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, maxWidth: "550px" }}>
          <h1 style={{ 
            fontSize: "48px", 
            fontWeight: "700", 
            color: "#1f2937", 
            marginBottom: "16px", 
            fontFamily: "'Georgia', 'Times New Roman', serif", 
            lineHeight: "1.15",
            letterSpacing: "-0.01em"
          }}>
            Discover Delicious<br />
            <span style={{ color: "#d97706" }}>Recipes</span>, Anytime!
          </h1>

          <p style={{ 
            fontSize: "17px", 
            color: "#6b7280", 
            marginBottom: "28px", 
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.6",
            fontWeight: "400"
          }}>
            Explore easy, healthy, and tasty recipes for every mood and occasion.
          </p>

          {/* Search bar */}
          <div style={{ 
            display: "flex", 
            marginBottom: "24px", 
            border: "1px solid #e5e7eb", 
            borderRadius: "50px", 
            overflow: "hidden", 
            background: "#fff", 
            maxWidth: "700px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "0",
            alignItems: "center",
            height: "50px"
          }}>
            <div style={{ display: "flex", alignItems: "center", color: "#9ca3af", padding: "0 18px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => { if (!isLoggedIn) { setShowPrompt(true); return; } onSearch(e.target.value); }}
              onFocus={() => { if (!isLoggedIn) setShowPrompt(true); }}
              onKeyDown={(e) => e.key === "Enter" && isLoggedIn && onSearch(searchQuery)}
              style={{ 
                flex: 1, 
                padding: "14px 16px", 
                border: "none", 
                outline: "none", 
                fontSize: "15px", 
                fontFamily: "'Inter', sans-serif", 
                color: "#374151", 
                background: "transparent", 
                cursor: isLoggedIn ? "text" : "pointer" 
              }}
            />
            <button
              onClick={() => { if (!isLoggedIn) { setShowPrompt(true); return; } onSearch(searchQuery); }}
              style={{ 
                padding: "12px 20px", 
                background: "#7c9653", 
                color: "#fff", 
                border: "none", 
                borderRadius: "50px",
                fontSize: "14px", 
                fontWeight: "600", 
                cursor: "pointer", 
                fontFamily: "'Inter', sans-serif", 
                transition: "background 0.2s",
                margin: "5px",
                minWidth: "90px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#6b8547";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#7c9653";
              }}
            >
              Search
            </button>
          </div>

          {/* Category buttons */}
          <div style={{ display: "flex", flexWrap: "nowrap", gap: "8px", overflow: "visible", minWidth: "0" }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => { if (!isLoggedIn) { setShowPrompt(true); return; } onSearch(cat.label); }}
                style={{ 
                  padding: "8px 14px", 
                  background: searchQuery === cat.label ? "#7c9653" : "#fff", 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "22px", 
                  fontSize: "13px", 
                  fontWeight: "500", 
                  color: searchQuery === cat.label ? "#fff" : "#4b5563", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "5px", 
                  transition: "all 0.2s", 
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  minHeight: "38px"
                }}
                onMouseEnter={(e) => { 
                  if (searchQuery !== cat.label) { 
                    e.currentTarget.style.background = "#7c9653"; 
                    e.currentTarget.style.color = "#fff"; 
                    e.currentTarget.style.borderColor = "#7c9653";
                  } 
                }}
                onMouseLeave={(e) => { 
                  if (searchQuery !== cat.label) { 
                    e.currentTarget.style.background = "#fff"; 
                    e.currentTarget.style.color = "#4b5563"; 
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  } 
                }}
              >
                <img src={cat.icon} alt={cat.label} style={{ width: "18px", height: "18px" }} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHero;
