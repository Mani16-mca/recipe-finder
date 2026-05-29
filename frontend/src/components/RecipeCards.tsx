import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DetailedRecipeView from "./RecipeView.tsx";
import LoginPrompt from "./LoginPrompt.tsx";
import RecipeCard, { type Recipe } from "./RecipeCard.tsx";
import bgPageImage from "../assets/logo/image.png";

const featuredRecipes: Recipe[] = [
  { id: 1, title: "Creamy Garlic Chicken", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=250&fit=crop", time: "25 min", ingredients: 10, category: "Dinner", isVeg: false },
  { id: 2, title: "Veggie Stir-Fry", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=250&fit=crop", time: "20 min", ingredients: 12, category: "Vegetarian", isVeg: true },
  { id: 3, title: "Chocolate Chip Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=250&fit=crop", time: "30 min", ingredients: 9, category: "Dessert", isVeg: true },
  { id: 4, title: "Avocado Toast with Eggs", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=250&fit=crop", time: "15 min", ingredients: 6, category: "Breakfast", isVeg: true },
  { id: 9, title: "Mushroom Risotto", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=250&fit=crop", time: "35 min", ingredients: 8, category: "Vegetarian", isVeg: true },
  { id: 10, title: "Greek Salad", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop", time: "10 min", ingredients: 7, category: "Healthy", isVeg: true },
  { id: 11, title: "Beef Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=250&fit=crop", time: "20 min", ingredients: 9, category: "Quick & Easy", isVeg: false },
  { id: 15, title: "Lemon Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=250&fit=crop", time: "18 min", ingredients: 7, category: "Quick & Easy", isVeg: true },
  { id: 17, title: "Pancakes with Berries", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop", time: "20 min", ingredients: 8, category: "Breakfast", isVeg: true },
  { id: 18, title: "Grilled Salmon", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=250&fit=crop", time: "25 min", ingredients: 6, category: "Healthy", isVeg: false },
  { id: 19, title: "Tiramisu", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=250&fit=crop", time: "40 min", ingredients: 10, category: "Dessert", isVeg: true },
  { id: 20, title: "Spinach Omelette", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=250&fit=crop", time: "10 min", ingredients: 5, category: "Breakfast", isVeg: true },
];

const trendingRecipes: Recipe[] = [
  { id: 5, title: "Spaghetti Bolognese", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=250&fit=crop", time: "40 min", ingredients: 10, category: "Dinner", isVeg: false },
  { id: 6, title: "Chicken Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop", time: "25 min", ingredients: 10, category: "Quick & Easy", isVeg: false },
  { id: 7, title: "Caprese Salad", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=250&fit=crop", time: "10 min", ingredients: 10, category: "Healthy", isVeg: true },
  { id: 8, title: "Blueberry Muffins", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=250&fit=crop", time: "35 min", ingredients: 9, category: "Breakfast", isVeg: true },
  { id: 12, title: "Pad Thai", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=250&fit=crop", time: "30 min", ingredients: 12, category: "Dinner", isVeg: false },
  { id: 13, title: "Margherita Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=250&fit=crop", time: "45 min", ingredients: 7, category: "Vegetarian", isVeg: true },
  { id: 14, title: "Caesar Salad", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=250&fit=crop", time: "15 min", ingredients: 6, category: "Healthy", isVeg: true },
  { id: 16, title: "Butter Chicken", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=250&fit=crop", time: "50 min", ingredients: 14, category: "Dinner", isVeg: false },
  { id: 21, title: "Shrimp Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop", time: "25 min", ingredients: 11, category: "Quick & Easy", isVeg: false },
  { id: 22, title: "Veggie Burger", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=250&fit=crop", time: "30 min", ingredients: 10, category: "Vegetarian", isVeg: true },
  { id: 23, title: "Mango Smoothie Bowl", image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=250&fit=crop", time: "10 min", ingredients: 6, category: "Healthy", isVeg: true },
  { id: 24, title: "Cheesecake", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=250&fit=crop", time: "60 min", ingredients: 12, category: "Dessert", isVeg: true },
];

interface Props {
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: number) => boolean;
  searchQuery?: string;
  isLoggedIn?: boolean;
}

const VISIBLE = 6;

const ArrowNavigation: React.FC<{ 
  total: number; 
  current: number; 
  onPrev: () => void; 
  onNext: () => void; 
}> = ({ total, current, onPrev, onNext }) => (
  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <button 
      onClick={onPrev}
      disabled={current === 0}
      style={{ 
        width: "36px", 
        height: "36px", 
        borderRadius: "50%", 
        border: "1px solid #e5e7eb", 
        background: current === 0 ? "#f9fafb" : "#fff", 
        cursor: current === 0 ? "not-allowed" : "pointer", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        transition: "all 0.2s",
        opacity: current === 0 ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (current !== 0) {
          e.currentTarget.style.background = "#f3f4f6";
          e.currentTarget.style.borderColor = "#d1d5db";
        }
      }}
      onMouseLeave={(e) => {
        if (current !== 0) {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={current === 0 ? "#9ca3af" : "#374151"} strokeWidth="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    
    <span style={{ 
      fontSize: "14px", 
      color: "#6b7280", 
      fontFamily: "'Inter',sans-serif",
      minWidth: "40px",
      textAlign: "center"
    }}>
      {current + 1} / {total}
    </span>
    
    <button 
      onClick={onNext}
      disabled={current === total - 1}
      style={{ 
        width: "36px", 
        height: "36px", 
        borderRadius: "50%", 
        border: "1px solid #e5e7eb", 
        background: current === total - 1 ? "#f9fafb" : "#fff", 
        cursor: current === total - 1 ? "not-allowed" : "pointer", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        transition: "all 0.2s",
        opacity: current === total - 1 ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (current !== total - 1) {
          e.currentTarget.style.background = "#f3f4f6";
          e.currentTarget.style.borderColor = "#d1d5db";
        }
      }}
      onMouseLeave={(e) => {
        if (current !== total - 1) {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={current === total - 1 ? "#9ca3af" : "#374151"} strokeWidth="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
);

interface RecipeRowProps {
  recipes: Recipe[];
  page: number;
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: number) => boolean;
  onViewRecipe: (recipe: Recipe) => void;
  commentCounts: Record<number, number>;
}

const RowSlider: React.FC<RecipeRowProps> = ({ recipes, page, toggleFavorite, isFavorite, onViewRecipe, commentCounts }) => {
  const start = page * VISIBLE;
  const visible = recipes.slice(start, start + VISIBLE);

  return (
    <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {visible.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={isFavorite(recipe.id)}
          onToggleFavorite={toggleFavorite}
          onViewRecipe={onViewRecipe}
          commentCount={commentCounts[recipe.id] || 0}
        />
      ))}
    </div>
  );
};

const RecipeCards: React.FC<Props> = ({ toggleFavorite, isFavorite, searchQuery = "", isLoggedIn = false }) => {
  const [featPage, setFeatPage] = useState(0);
  const [trendPage, setTrendPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loginPrompt, setLoginPrompt] = useState<string | null>(null);
  const [dbRecipes, setDbRecipes] = useState<Recipe[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});

  // Fetch all recipes from backend — newest first
  useEffect(() => {
    const fetchRecipes = () => {
      fetch("http://localhost:5000/api/recipes")
        .then(r => r.json())
        .then((data: any[]) => {
          const mapped: Recipe[] = data.map(r => ({
            id: r.recipeId,
            title: r.title,
            image: r.image,
            time: r.time,
            ingredients: r.ingredients,
            category: r.category,
            isVeg: r.isVeg,
          }));
          setDbRecipes(mapped);
          
          // Fetch comment counts for all recipes
          mapped.forEach(recipe => {
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
        })
        .catch(() => {
          setDbRecipes([...featuredRecipes, ...trendingRecipes]);
        });
    };

    fetchRecipes(); // initial load
    const interval = setInterval(fetchRecipes, 10000); // re-fetch every 10s
    return () => clearInterval(interval);
  }, []);

  // Use DB recipes if loaded, otherwise fall back to static
  const allLoaded = dbRecipes.length > 0 ? dbRecipes : [...featuredRecipes, ...trendingRecipes];
  // Newest recipes (first half) → Featured, rest → Trending
  const half = Math.ceil(allLoaded.length / 2);
  const featured = allLoaded.slice(0, half);
  const trending = allLoaded.slice(half);

  const handleViewRecipe = (recipe: Recipe) => {
    if (!isLoggedIn) { setLoginPrompt("Log in to view full recipe details, ingredients and instructions."); return; }
    setSelectedRecipe(recipe);
  };

  const handleFavorite = (recipe: Recipe) => {
    if (!isLoggedIn) { setLoginPrompt("Log in to save recipes to your favorites."); return; }
    toggleFavorite(recipe);
  };

  const q = searchQuery.toLowerCase().trim();

  const allRecipes = allLoaded;

  // If searching, show filtered results flat; otherwise show sections
  if (q) {
    const filtered = allRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.category && r.category.toLowerCase() === q) ||
        (r.category && r.category.toLowerCase().includes(q))
    );
    return (
      <div style={{ background: "#ffffff", padding: "0px 40px 40px 40px", minHeight: "100vh", margin: "0" }}>
        {selectedRecipe && <DetailedRecipeView recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
        {loginPrompt && <LoginPrompt message={loginPrompt} onClose={() => setLoginPrompt(null)} />}
        <h5 style={{ fontWeight: "700", color: "#1f2937", fontSize: "20px", marginBottom: "24px", fontFamily: "'Inter', sans-serif" }}>
          Search results for "{searchQuery}" ({filtered.length})
        </h5>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#9ca3af", fontFamily: "'Inter',sans-serif" }}>
            <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" alt="Search" style={{ width: "40px", height: "40px", marginBottom: "0.8rem", opacity: 0.6 }} />
            <p>No recipes found. Try a different search.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {filtered.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={handleFavorite}
                onViewRecipe={handleViewRecipe}
                commentCount={commentCounts[recipe.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const featPages = Math.ceil(featured.length / VISIBLE);
  const trendPages = Math.ceil(trending.length / VISIBLE);

  return (
    <div style={{ background: "#ffffff", padding: "40px 40px 40px 40px", margin: "0", width: "100%", backgroundImage: `url(${bgPageImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "scroll" }}>
      {selectedRecipe && <DetailedRecipeView recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      {loginPrompt && <LoginPrompt message={loginPrompt} onClose={() => setLoginPrompt(null)} />}
      
      {/* Trending Recipes */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>🔥</span>
            <h2 style={{ 
              fontWeight: "700", 
              color: "#1f2937", 
              fontSize: "18px", 
              margin: 0, 
              fontFamily: "'Georgia', 'Times New Roman', serif" 
            }}>
              Trending Recipes
            </h2>
          </div>
          {trendPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ArrowNavigation 
                total={trendPages} 
                current={trendPage} 
                onPrev={() => setTrendPage(Math.max(0, trendPage - 1))}
                onNext={() => setTrendPage(Math.min(trendPages - 1, trendPage + 1))}
              />
            </div>
          )}
        </div>
        <RowSlider recipes={trending} page={trendPage} toggleFavorite={handleFavorite} isFavorite={isFavorite} onViewRecipe={handleViewRecipe} commentCounts={commentCounts} />
      </div>

      {/* Featured Recipes */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>⭐</span>
            <h2 style={{ 
              fontWeight: "700", 
              color: "#1f2937", 
              fontSize: "18px", 
              margin: 0, 
              fontFamily: "'Georgia', 'Times New Roman', serif" 
            }}>
              Featured Recipes
            </h2>
          </div>
          {featPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ArrowNavigation 
                total={featPages} 
                current={featPage} 
                onPrev={() => setFeatPage(Math.max(0, featPage - 1))}
                onNext={() => setFeatPage(Math.min(featPages - 1, featPage + 1))}
              />
            </div>
          )}
        </div>
        <RowSlider recipes={featured} page={featPage} toggleFavorite={handleFavorite} isFavorite={isFavorite} onViewRecipe={handleViewRecipe} commentCounts={commentCounts} />
      </div>
    </div>
  );
};

export default RecipeCards;
export type { Recipe };
