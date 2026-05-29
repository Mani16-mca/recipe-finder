import React, { useState, useEffect } from "react";

interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  ingredients: number;
  category?: string;
  isVeg: boolean;
}

export interface DetailedRecipe {
  _id?: string;
  recipeId?: number;
  id?: number;
  title: string;
  image?: string;
  time?: string;
  cookingTime?: number;
  ingredients?: number;
  ingredientsList?: string[];
  category?: string;
  isVeg?: boolean;
  description?: string;
  steps?: string[];
  author?: string;
  status?: string;
  createdAt?: string;
}

interface Props {
  recipe: Recipe | DetailedRecipe;
  onClose: () => void;
}

const DetailedRecipeView: React.FC<Props> = ({ recipe, onClose }) => {
  const [fullRecipe, setFullRecipe] = useState<DetailedRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch full recipe details from backend
    const fetchRecipeDetails = async () => {
      try {
      const recipeId = (recipe as any).recipeId || (recipe as any).id;
        const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`);
        if (response.ok) {
          const data = await response.json();
          setFullRecipe(data);
        } else {
          // Fallback to provided recipe data
          setFullRecipe(recipe);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setFullRecipe(recipe);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipe]);

  if (loading) {
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "18px", color: "#6b7280" }}>Loading recipe...</div>
        </div>
      </div>
    );
  }

  const displayRecipe = fullRecipe || recipe;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px", width: "900px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'Inter', sans-serif", position: "relative" }}>
        
        {/* Close button - top right */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            fontSize: "18px",
            color: "#6b7280"
          }}
        >
          ✕
        </button>

        {/* Header section with image and recipe info */}
        <div style={{ display: "flex" }}>
          {/* Left side - Image */}
          <div style={{ position: "relative", width: "250px", height: "300px", padding: "20px 0 0 20px" }}>
            <img 
              src={displayRecipe.image || recipe.image} 
              alt={displayRecipe.title}
              style={{
                width: "240px",
                height: "280px",
                objectFit: "cover",
                borderRadius: "16px"
              }}
            />
            {/* Back button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "36px",
                left: "36px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Right side - Recipe info */}
          <div style={{ flex: 1, padding: "32px 32px 24px 32px" }}>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1f2937",
              margin: "0 0 16px 0",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.2"
            }}>
              {displayRecipe.title}
            </h1>

            {/* Time and ingredients */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span style={{ fontSize: "14px" }}>
                  {(displayRecipe as any).cookingTime || ((displayRecipe as any).time ? parseInt(((displayRecipe as any).time).replace(/\D/g, '')) : 20)} min
                </span>
              </div>
              <span style={{ color: "#d1d5db", fontSize: "14px" }}>•</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981" stroke="none">
                  <circle cx="12" cy="12" r="6"/>
                </svg>
                <span style={{ fontSize: "14px" }}>
                  {(displayRecipe as any).ingredientsList?.length || (displayRecipe as any).ingredients || 12} ingredients
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#6b7280",
              margin: "0 0 24px 0"
            }}>
              {(displayRecipe as any).description || "A quick and healthy veggie stir-fry packed with colorful vegetables, aromatic garlic, and a savory sauce. Perfect for a nutritious weeknight dinner!"}
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <button style={{
                padding: "10px 20px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Comments (24)
              </button>
              <button style={{
                padding: "10px 20px",
                background: "#7c9653",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Recipe
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Servings</span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>4</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Difficulty</span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#10b981" }}>Easy</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
                  </svg>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Calories</span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>320 kcal</div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>per serving</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - Ingredients and Instructions */}
        <div style={{ display: "flex", padding: "32px" }}>
          {/* Left Column - Ingredients */}
          <div style={{ width: "280px", paddingRight: "32px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", color: "#1f2937" }}>Ingredients</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { name: "Broccoli (florets)", measurement: "1 cup" },
                { name: "Bell peppers (sliced)", measurement: "1 cup" },
                { name: "Carrots (julienned)", measurement: "1/2 cup" },
                { name: "Snap peas", measurement: "1/2 cup" },
                { name: "Garlic (minced)", measurement: "3 cloves" },
                { name: "Ginger (grated)", measurement: "1 tsp" },
                { name: "Soy sauce", measurement: "3 tbsp" },
                { name: "Sesame oil", measurement: "1 tbsp" },
                { name: "Olive oil", measurement: "1 tbsp" },
                { name: "Cooked rice", measurement: "2 cups" },
                { name: "Green onions (chopped)", measurement: "2 tbsp" },
                { name: "Sesame seeds", measurement: "1 tbsp" }
              ].map((ingredient, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", color: "#374151", padding: "8px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", flexShrink: 0 }}></div>
                    <span>{ingredient.name}</span>
                  </div>
                  <span style={{ color: "#1f2937", fontWeight: "500", marginLeft: "16px" }}>{ingredient.measurement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Instructions */}
          <div style={{ flex: 1, paddingLeft: "32px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", color: "#1f2937" }}>Instructions</h3>
            <div style={{ marginBottom: "24px" }}>
              {[
                "Heat olive oil and sesame oil in a large pan or wok over medium-high heat.",
                "Add minced garlic and grated ginger. Sauté for 30 seconds until fragrant.",
                "Add broccoli, bell peppers, carrots, and snap peas. Stir-fry for 4-5 minutes until vegetables are tender-crisp.",
                "Pour in soy sauce and mix well.",
                "Add cooked rice and toss everything together until well combined and heated through.",
                "Garnish with chopped green onions and sesame seeds. Serve hot!"
              ].map((step, index) => (
                <div key={index} style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    background: "#10b981", 
                    color: "#fff", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "12px", 
                    fontWeight: "600", 
                    flexShrink: 0,
                    marginTop: "2px"
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Chef's Tip */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 .55.45 1 1 1h4v-6zM20 12v3c0 .55-.45 1-1 1h-4v-6h4a2 2 0 0 1 2 2z"/>
                    <path d="M15 7a5 5 0 1 0-6 0"/>
                    <path d="M9 12v6h6v-6"/>
                  </svg>
                </div>
                <span style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#059669"
                }}>
                  Chef's Tip
                </span>
              </div>
              <p style={{
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#065f46",
                margin: 0
              }}>
                Add tofu or grilled chicken for extra protein. You can also use brown rice or quinoa for a healthier twist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedRecipeView;