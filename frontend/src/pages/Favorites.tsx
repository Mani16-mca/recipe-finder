import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RecipeCard, { type Recipe } from "../components/RecipeCard.tsx";
import DetailedRecipeView from "../components/RecipeView.tsx";
import bgImage from "../assets/logo/favbg.png";

const LOGO = "https://cdn-icons-png.flaticon.com/128/3183/3183463.png";

interface FavoritesProps {
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: number) => boolean;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, toggleFavorite, isFavorite }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const navigate = useNavigate();
  
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isUserLoggedIn = !!token;

  // Fetch comment counts for favorite recipes
  useEffect(() => {
    favorites.forEach(recipe => {
      fetch(`http://localhost:5000/api/recipes/${recipe.id}/comments`)
        .then(r => r.json())
        .then(comments => {
          setCommentCounts(prev => ({
            ...prev,
            [recipe.id]: comments.length
          }));
        })
        .catch(() => {
          setCommentCounts(prev => ({
            ...prev,
            [recipe.id]: 0
          }));
        });
    });
  }, [favorites]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    if (!isUserLoggedIn) {
      alert("Log in to save recipes to your favorites.");
      return;
    }
    toggleFavorite(recipe);
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100vw",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      position: "relative",
      overflow: "hidden"
    }}>
      
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
              paddingBottom: "4px",
              borderBottom: "3px solid #d97706",
              transition: "color 0.2s"
            }}>
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
            {isUserLoggedIn ? (
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

      {/* Main Content */}
      <div style={{ 
        padding: "140px 0px 40px 60px",
        minHeight: "80vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}>

      {/* Title */}
      <h1 style={{ 
        fontWeight: "700", 
        color: "#2d3748", 
        marginBottom: "8px", 
        fontSize: "28px", 
        fontFamily: "'Georgia', serif",
        lineHeight: "1.2",
        textAlign: "center"
      }}>
        <img src="https://cdn-icons-png.flaticon.com/128/833/833472.png" alt="Favorites" style={{ width: "24px", height: "24px", marginRight: "8px", verticalAlign: "middle" }} />
        My Favorite Recipes
      </h1>

      {/* Subtitle */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "8px", 
        marginBottom: "40px",
        color: "#4a5568",
        fontSize: "16px",
        fontFamily: "'Inter', sans-serif",
        justifyContent: "center"
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        Plan your meals for the week. Click "View Recipe" to see details.
      </div>

      {/* Recipe Cards */}
      {selectedRecipe && <DetailedRecipeView recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      
      {favorites.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "4rem 0", 
          color: "#6b7280"
        }}>
          <img src="https://cdn-icons-png.flaticon.com/128/2674/2674035.png" alt="No Favorites" style={{ width: "60px", height: "60px", marginBottom: "1rem", opacity: 0.7 }} />
          <h5 style={{ fontWeight: "600", color: "#374151", marginBottom: "0.4rem", fontSize: "20px" }}>No favorites yet!</h5>
          <p style={{ fontSize: "16px", color: "#6b7280" }}>Start exploring recipes and click the heart icon to save your favorites here.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(5, 1fr)", 
          gap: "12px",
          padding: "0",
          justifyContent: "start",
          paddingLeft: "40px",
          paddingRight: "40px"
        }}>
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={handleToggleFavorite}
              onViewRecipe={handleViewRecipe}
              commentCount={commentCounts[recipe.id] || 0}
            />
          ))}
        </div>
      )}
      
      </div> {/* Close Main Content */}
    </div>
  );
};

export default Favorites;
