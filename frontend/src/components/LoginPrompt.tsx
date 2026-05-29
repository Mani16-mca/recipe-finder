import React from "react";
import { useNavigate } from "react-router-dom";
import { BsPersonFill, BsPersonPlus } from "react-icons/bs";

interface Props {
  onClose: () => void;
  message?: string;
}

const LoginPrompt: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "420px",
          padding: "0 0 1.2rem 0",
          textAlign: "center",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          fontFamily: "'Inter',sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "14px", right: "14px", background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "15px", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}
        >✕</button>

        {/* Lock icon area with radial glow */}
        <div style={{ background: "radial-gradient(ellipse at center top, rgba(255,200,50,0.18) 0%, rgba(255,255,255,0) 70%)", paddingTop: "1.5rem", paddingBottom: "0.5rem" }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {/* Glow circle */}
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,50,0.3) 0%, rgba(255,200,50,0.05) 70%)", border: "1.5px solid rgba(255,200,50,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "52px", lineHeight: 1 }}>🔒</span>
            </div>
            {/* Sparkles */}
            <span style={{ position: "absolute", top: "2px", left: "6px", color: "#f59e0b", fontSize: "13px" }}>✦</span>
            <span style={{ position: "absolute", top: "6px", right: "2px", color: "#f59e0b", fontSize: "9px" }}>✦</span>
            <span style={{ position: "absolute", bottom: "4px", right: "8px", color: "#f59e0b", fontSize: "11px" }}>✦</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontWeight: "800", color: "#1a1a1a", fontSize: "22px", margin: "0 0 0.6rem", fontFamily: "'Inter',sans-serif" }}>
          Unlock Full Recipe 🔒
        </h3>

        {/* Subtitle */}
        <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: "1.6", margin: "0 auto 1.2rem", maxWidth: "300px" }}>
          Log in to view ingredients, step-by-step instructions, and save your favorites.
        </p>

        {/* Feature badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "6px 16px", marginBottom: "1.2rem", color: "#16a34a", fontSize: "13px", fontWeight: "500" }}>
          <span style={{ fontSize: "16px" }}>✿</span>
          Save recipes &amp; track your favorites
        </div>

        {/* Buttons row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "0 2rem" }}>
          
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "#2d6a2d", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter',sans-serif", justifyContent: "center" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1f4d1f")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2d6a2d")}
          >
            <BsPersonFill size={16} /> Log In
          </button>
          <button
            onClick={() => { onClose(); navigate("/signup"); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "transparent", border: "2px solid #d97941", borderRadius: "10px", color: "#d97941", fontWeight: "600", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter',sans-serif", justifyContent: "center" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff7f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <BsPersonPlus size={16} /> Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
