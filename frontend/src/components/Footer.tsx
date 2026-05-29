import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer style={{ background: "#1a1a1a", color: "#d1d5db", padding: "3rem 3rem 1.5rem", fontFamily: "'Inter',sans-serif" }}>
    <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap", marginBottom: "2rem" }}>

      {/* Brand */}
      <div style={{ flex: "1 1 220px" }}>
        <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "20px", marginBottom: "0.8rem" }}>
          🍽 Recipe <span style={{ color: "#d97941" }}>Finder</span>
        </h3>
        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#9ca3af" }}>
          Discover delicious recipes for every taste and occasion. Cook smarter, eat better.
        </p>
      </div>

      {/* Quick Links */}
      <div style={{ flex: "1 1 140px" }}>
        <h6 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", marginBottom: "1rem" }}>Quick Links</h6>
        {[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: "Favorites", to: "/favorites" },
          { label: "Meal Planner", to: "/mealplanner" },
          { label: "About Us", to: "/about" },
        ].map((l) => (
          <div key={l.label} style={{ marginBottom: "0.5rem" }}>
            <Link to={l.to} style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d97941")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >{l.label}</Link>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{ flex: "1 1 140px" }}>
        <h6 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", marginBottom: "1rem" }}>Categories</h6>
        {["Vegetarian", "Quick & Easy", "Healthy", "Dinner", "Dessert", "Breakfast"].map((c) => (
          <div key={c} style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>{c}</span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ flex: "1 1 200px" }}>
        <h6 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", marginBottom: "1rem" }}>Contact</h6>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "0.5rem" }}>📧 hello@recipefinder.com</p>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "1rem" }}>📍 Lahore, Pakistan</p>
        <div style={{ display: "flex", gap: "10px" }}>
          {["Facebook", "Instagram", "Twitter"].map((s) => (
            <span key={s} style={{ background: "#2d2d2d", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", color: "#9ca3af", cursor: "pointer" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Support */}
      <div style={{ flex: "1 1 180px" }}>
        <h6 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", marginBottom: "1rem" }}>Support</h6>
        {[
          { label: "Help Center", href: "#" },
          { label: "FAQ", href: "#" },
          { label: "Report a Bug", href: "#" },
          { label: "Contact Us", href: "mailto:hello@recipefinder.com" },
          { label: "Feedback", href: "#" },
        ].map((item) => (
          <div key={item.label} style={{ marginBottom: "0.5rem" }}>
            <a href={item.href} style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d97941")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >{item.label}</a>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: "1px solid #2d2d2d", paddingTop: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>© 2026 Recipe Finder. All rights reserved.</p>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["Privacy Policy", "Terms of Service"].map((t) => (
          <span key={t} style={{ fontSize: "13px", color: "#6b7280", cursor: "pointer" }}>{t}</span>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
