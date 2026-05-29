import React from "react";
import { useNavigate } from "react-router-dom";

const LOGO = "https://cdn-icons-png.flaticon.com/128/3839/3839530.png";

interface SidebarProps {
  activePage: "dashboard" | "recipes" | "users" | "reviews" | "categories" | "favorites" | "settings";
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "https://www.flaticon.com/free-icon/dashboard_1828765", label: "Dashboard", path: "/admin", key: "dashboard" },
    { icon: "🍳", label: "Manage Recipes", path: "/admin/recipes", key: "recipes" },
    { icon: "👥", label: "Manage Users", path: "/admin/users", key: "users" },
    { icon: "⭐", label: "Reviews", path: "/admin", key: "reviews" },
    { icon: "📂", label: "Categories", path: "/admin", key: "categories" },
    
    { icon: "⚙️", label: "Settings", path: "/admin", key: "settings" },
  ];

  return (
    <div style={{ width: "240px", background: "rgba(255,255,255,0.95)", borderRight: "1px solid rgba(229,231,235,0.6)", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0 }}>
      {/* Logo */}
      <div style={{ padding: "16px 12px", borderBottom: "1px solid rgba(229,231,235,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={LOGO} alt="logo" style={{ width: "20px", height: "20px" }} />
          <span style={{ fontWeight: "800", fontSize: "13px", color: "#2d5016" }}>Recipe <span style={{ color: "#d97941" }}>Finder</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "12px 0", flex: 1 }}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              margin: "0 8px",
              borderRadius: "6px",
              background: activePage === item.key ? "#5a7a3a" : "transparent",
              color: activePage === item.key ? "#fff" : "#6b7280",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activePage === item.key ? "600" : "500",
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: "14px" }}>{item.icon}</span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Decorative Image */}
      <div style={{ padding: "12px" }}>
        <div style={{ 
          width: "100%", 
          height: "140px", 
          borderRadius: "8px", 
          background: "linear-gradient(135deg, #5a7a3a 0%, #3d5a28 100%)",
          position: "relative",
          overflow: "hidden"
        }} />
      </div>
    </div>
  );
};

export default Sidebar;
