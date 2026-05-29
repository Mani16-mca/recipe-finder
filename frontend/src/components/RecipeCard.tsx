import React, { useState } from "react";
import CommentsModal from "./CommentsModal.tsx";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  ingredients: number;
  category?: string;
  isVeg: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  onViewRecipe: (recipe: Recipe) => void;
  commentCount?: number;
}

const Heart = ({ on }: { on: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={on ? "#e05a5a" : "none"} stroke={on ? "#e05a5a" : "#888"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onViewRecipe,
  commentCount = 0
}) => {
  const [expandedComments, setExpandedComments] = useState(false);

  const handleComments = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      alert("Log in to view and add comments.");
      return;
    }
    setExpandedComments(true);
  };

  return (
    <>
      {expandedComments && <CommentsModal recipeId={recipe.id} onClose={() => setExpandedComments(false)} />}
      <div
        style={{
          width: "240px",
          minWidth: "240px",
          height: "260px",
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          transition: "box-shadow 0.3s, transform 0.3s",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.15)";
          e.currentTarget.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
          />
          <button
            onClick={() => onToggleFavorite(recipe)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
          >
            <Heart on={isFavorite} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div>
            <h6
              style={{
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "6px",
                fontSize: "16px",
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.4"
              }}
            >
              {recipe.title}
            </h6>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#9ca3af",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {recipe.time}
              </span>
              <span style={{ color: "#e5e7eb" }}>|</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#7C9653" stroke="none">
                  <circle cx="12" cy="12" r="6" />
                </svg>
                {recipe.ingredients} ingredients
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            <button
              onClick={handleComments}
              style={{
                flex: 1,
                padding: "8px 0",
                background: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "600",
                color: "#6c757d",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e9ecef";
                e.currentTarget.style.borderColor = "#dee2e6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8f9fa";
                e.currentTarget.style.borderColor = "#e9ecef";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments ({commentCount})
            </button>
            <button
              style={{
                flex: 1,
                padding: "8px 0",
                background: "#7C9653",
                border: "none",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "700",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#5a9432";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#7C9653";
              }}
              onClick={() => {
                const token = localStorage.getItem("token");
                const user = localStorage.getItem("user");
                if (!token || !user) {
                  alert("Log in to view full recipe details.");
                  return;
                }
                onViewRecipe(recipe);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default RecipeCard;
