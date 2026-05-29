import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mealBg from "../assets/logo/form.png";
import Sidebar from "./Sidebar";

interface Recipe {
  _id: string;
  recipeId: number;
  title: string;
  category: string;
  author?: string;
  createdAt: string;
  ingredients: number;
  ingredientsList?: string[];
  cookingTime?: number;
  time?: string;
  status: "Published" | "Pending" | "Draft";
  image?: string;
  description?: string;
  steps?: string[];
  isVeg?: boolean;
}

interface StatCard {
  icon: string;
  count: number;
  label: string;
  change: string;
  changeColor: string;
}

const Avatar = ({ name = "U", size = 32 }: { name?: string; size?: number }) => {
  const colors = ['#5a7a3a', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#10B981'];
  const colorIndex = (name || "U").charCodeAt(0) % colors.length;
  
  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: "50%", 
      background: colors[colorIndex], 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      color: "#fff", 
      fontWeight: "700", 
      fontSize: size * 0.4, 
      flexShrink: 0 
    }}>
      {(name || "U").charAt(0).toUpperCase()}
    </div>
  );
};

const ManageRecipes: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All Recipes" | "Recent Recipes" | "Published" | "Pending" | "Draft">("All Recipes");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [newRecipe, setNewRecipe] = useState<{ title: string; category: string; author: string; ingredients: string; cookingTime: string; status: string }>({ title: "", category: "", author: "", ingredients: "", cookingTime: "", status: "Draft" });
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!t || u.role !== "admin") { 
      navigate("/login"); 
      return; 
    }
    
    axios.get("http://localhost:5000/api/recipes", { 
      headers: { Authorization: `Bearer ${t}` } 
    })
    .then(res => {
      console.log("Fetched recipes from database:", res.data);
      const recipesWithStatus = (res.data || []).map((r: any) => ({
        ...r,
        status: r.status || "Draft",
        author: r.author || "Unknown",
        cookingTime: r.cookingTime || (r.time ? parseInt(r.time.replace(/\D/g, '')) : 0),
        ingredients: r.ingredients || (r.ingredientsList ? r.ingredientsList.length : 0),
        ingredientsList: r.ingredientsList || []
      }));
      setRecipes(recipesWithStatus);
      console.log("Processed recipes:", recipesWithStatus);
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
      navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    let filtered = recipes;

    if (activeTab === "Recent Recipes") {
      // Show only the 5 most recent recipes
      filtered = recipes.slice(0, 5);
    } else if (activeTab !== "All Recipes") {
      filtered = filtered.filter(r => r.status === activeTab);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
    setCurrentPage(1);
  }, [recipes, activeTab, search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setRecipes(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      alert("Error deleting recipe");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    console.log("Updating recipe status:", id, "to", newStatus);
    try {
      const response = await axios.put(`http://localhost:5000/api/recipes/${id}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Status update response:", response.data);
      setRecipes(prev => prev.map(r => r._id === id ? { ...r, status: newStatus as any } : r));
      console.log("Local state updated");
    } catch (error) {
      console.error("Error updating recipe status:", error);
      alert("Error updating recipe status");
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem("token"); 
    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

  // Calculate stats
  const stats: StatCard[] = [
    { icon: "https://cdn-icons-png.flaticon.com/128/3389/3389081.png", count: recipes.length, label: "Total Recipes", change: "1.12%", changeColor: "#10B981" },
    { icon: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png", count: recipes.filter(r => r.status === "Draft").length, label: "Draft Recipes", change: "9.5%", changeColor: "#3B82F6" },
    { icon: "https://cdn-icons-png.flaticon.com/128/3652/3652267.png", count: recipes.filter(r => r.status === "Pending").length, label: "Pending Reviews", change: "8%", changeColor: "#F59E0B" },
    { icon: "https://cdn-icons-png.flaticon.com/128/709/709612.png", count: recipes.filter(r => r.status === "Published").length, label: "Published Recipes", change: "10%", changeColor: "#8B5CF6" },
    
  ];

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIdx, startIdx + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return { bg: "#dcfce7", color: "#16a34a" };
      case "Pending":
        return { bg: "#fef3c7", color: "#d97706" };
      case "Draft":
        return { bg: "#f3f4f6", color: "#6b7280" };
      
      default:
        return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", minHeight: "100vh", backgroundImage: `url(${mealBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div style={{ background: "rgba(245,243,240,0.93)", minHeight: "100vh", display: "flex" }}>
        
        {/* Sidebar */}
        <Sidebar activePage="recipes" onLogout={handleLogout} />

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "240px" }}>
          {/* Top Navbar */}
          <nav style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(229,231,235,0.6)", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 100 }}>
            <span onClick={handleLogout} style={{ fontSize: "14px", color: "#6b7280", cursor: "pointer", fontWeight: "500" }}>Logout</span>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <Avatar name={adminUser.name || "A"} size={32} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Admin</span>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>▾</span>
                </div>
                {userMenuOpen && (
                  <div style={{ position: "absolute", right: 0, top: "110%", background: "#fff", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "200px", padding: "1rem", zIndex: 200 }}>
                    <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "2px" }}>{adminUser.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>{adminUser.email}</div>
                    <button onClick={handleLogout} style={{ width: "100%", padding: "7px 0", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "6px", color: "#e05a5a", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Log Out</button>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <div style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
            {/* Header with Title and Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "2rem" }}>
              <div>
                <h2 style={{ fontWeight: "800", fontSize: "24px", color: "#1a1a1a", margin: 0, fontFamily: "'Georgia',serif" }}>Manage Recipes</h2>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: "4px 0 0" }}>Dashboard {"\u003e"} Manage Recipes</p>
              </div>
              
              {/* Top Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.88)", border: "1.5px solid #e5e7eb", borderRadius: "8px", padding: "0 12px" }}>
                  <span style={{ color: "#9ca3af", marginRight: "8px" }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes..." style={{ border: "none", outline: "none", fontSize: "14px", padding: "9px 0", background: "transparent", width: "200px" }} />
                </div>
                <button onClick={() => setShowAddDialog(true)} style={{ padding: "10px 20px", background: "#5a7a3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                  ➕ Add New Recipe
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
              {stats.map((stat, idx) => (
                <div key={idx} style={{ 
                  background: "rgba(255,255,255,0.88)", 
                  borderRadius: "12px", 
                  padding: "16px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.8)"
                }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    background: idx === 0 ? "#dcfce7" : idx === 1 ? "#dbeafe" : idx === 2 ? "#fef3c7" : idx === 3 ? "#f3e8ff" : "#fee2e2", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "24px",
                    flexShrink: 0
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a1a" }}>{stat.count}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{stat.label}</div>
                    <div style={{ fontSize: "11px", color: stat.changeColor, fontWeight: "600", marginTop: "2px" }}>↑ {stat.change} from last week</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ background: "rgba(255,255,255,0.88)", borderRadius: "12px", padding: "0 20px", marginBottom: "1.5rem", display: "flex", gap: "2rem", borderBottom: "1px solid #e5e7eb" }}>
              {["All Recipes", "Recent Recipes", "Published", "Pending", "Draft"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  style={{
                    padding: "12px 0",
                    background: "none",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: activeTab === tab ? "700" : "500",
                    color: activeTab === tab ? "#5a7a3a" : "#6b7280",
                    cursor: "pointer",
                    borderBottom: activeTab === tab ? "3px solid #5a7a3a" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Recipes Table */}
            <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.8)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Recipe</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Category</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Author</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ingredients</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Time</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecipes.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px" }}>
                        No recipes found
                      </td>
                    </tr>
                  ) : (
                    paginatedRecipes.map(recipe => {
                      const statusColor = getStatusColor(recipe.status);
                      return (
                        <tr key={recipe._id} style={{ borderTop: "1px solid #f5f3f0" }}>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "50px", height: "50px", borderRadius: "8px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0, overflow: "hidden" }}>
                                {recipe.image ? <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🍽️"}
                              </div>
                              <span style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a1a" }}>{recipe.title}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{recipe.category}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Avatar name={recipe.author || "Unknown"} size={28} />
                              <span style={{ fontSize: "13px", color: "#6b7280" }}>{recipe.author || "Unknown"}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>
                            {new Date(recipe.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{recipe.ingredientsList?.length || recipe.ingredients || 0}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{recipe.cookingTime || (recipe.time ? parseInt(recipe.time.replace(/\D/g, '')) : 0)} min</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ 
                              background: statusColor.bg, 
                              color: statusColor.color, 
                              fontSize: "12px", 
                              fontWeight: "700", 
                              padding: "6px 12px", 
                              borderRadius: "20px" 
                            }}>
                              {recipe.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", position: "relative" }}>
                              <button 
                                onClick={() => {
                                  setViewingRecipe(recipe);
                                  setShowViewDialog(true);
                                }}
                                style={{ 
                                  padding: "6px 8px", 
                                  background: "none", 
                                  border: "none", 
                                  fontSize: "16px", 
                                  cursor: "pointer",
                                  color: "#3b82f6",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                                title="View"
                              >
                                👁️
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingRecipe(recipe);
                                  setShowEditDialog(true);
                                }}
                                style={{ 
                                  padding: "6px 8px", 
                                  background: "none", 
                                  border: "none", 
                                  fontSize: "16px", 
                                  cursor: "pointer",
                                  color: "#f59e0b",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDelete(recipe._id)}
                                style={{ 
                                  padding: "6px 8px", 
                                  background: "none", 
                                  border: "none", 
                                  fontSize: "16px", 
                                  cursor: "pointer",
                                  color: "#ef4444",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                                title="Delete"
                              >
                                🗑️
                              </button>
                              <div style={{ position: "relative", display: "inline-block" }}>
                                <button 
                                  onClick={() => setOpenMenuId(openMenuId === recipe._id ? null : recipe._id)}
                                  style={{ 
                                    padding: "6px 8px", 
                                    background: "none", 
                                    border: "none", 
                                    fontSize: "16px", 
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                  title="More options"
                                >
                                  ⋮
                                </button>
                                {openMenuId === recipe._id && (
                                  <div style={{ 
                                    position: "absolute", 
                                    right: 0, 
                                    top: "100%", 
                                    background: "#fff", 
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    zIndex: 1000,
                                    minWidth: "150px"
                                  }}>
                                    <button
                                      onClick={() => {
                                        handleStatusChange(recipe._id, "Published");
                                        setOpenMenuId(null);
                                      }}
                                      style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        background: "none",
                                        border: "none",
                                        textAlign: "left",
                                        fontSize: "13px",
                                        color: "#1a1a1a",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0"
                                      }}
                                    >
                                      ✓ Published
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleStatusChange(recipe._id, "Pending");
                                        setOpenMenuId(null);
                                      }}
                                      style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        background: "none",
                                        border: "none",
                                        textAlign: "left",
                                        fontSize: "13px",
                                        color: "#1a1a1a",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0"
                                      }}
                                    >
                                      ⏳ Pending
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleStatusChange(recipe._id, "Draft");
                                        setOpenMenuId(null);
                                      }}
                                      style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        background: "none",
                                        border: "none",
                                        textAlign: "left",
                                        fontSize: "13px",
                                        color: "#1a1a1a",
                                        cursor: "pointer"
                                      }}
                                    >
                                      📝 Draft
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                
                {/* Pagination Footer inside table */}
                <tfoot>
                  <tr>
                    <td colSpan={8} style={{ padding: "16px", background: "#fafaf8", borderTop: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        {/* Left side - Showing info */}
                        <span style={{ fontSize: "13px", color: "#6b7280" }}>
                          {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredRecipes.length)} of {filteredRecipes.length}
                        </span>
                        
                        {/* Center - Page navigation */}
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{ 
                              padding: "6px 10px", 
                              background: "#f3f4f6", 
                              border: "1px solid #e5e7eb", 
                              borderRadius: "6px", 
                              cursor: currentPage === 1 ? "not-allowed" : "pointer", 
                              opacity: currentPage === 1 ? 0.5 : 1 
                            }}
                          >
                            ←
                          </button>
                          
                          {/* Page number buttons */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const startPage = Math.max(1, currentPage - 2);
                            const pageNum = startPage + i;
                            if (pageNum > totalPages) return null;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                  padding: "6px 10px",
                                  background: currentPage === pageNum ? "#5a7a3a" : "#f3f4f6",
                                  color: currentPage === pageNum ? "#fff" : "#1a1a1a",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontWeight: currentPage === pageNum ? "700" : "500",
                                  minWidth: "36px"
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{ 
                              padding: "6px 10px", 
                              background: "#f3f4f6", 
                              border: "1px solid #e5e7eb", 
                              borderRadius: "6px", 
                              cursor: currentPage === totalPages ? "not-allowed" : "pointer", 
                              opacity: currentPage === totalPages ? 0.5 : 1 
                            }}
                          >
                            →
                          </button>
                        </div>
                        
                        {/* Right side - Items per page */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#6b7280" }}>Items per page:</span>
                          <select 
                            value={itemsPerPage}
                            onChange={(e) => {
                              const newItemsPerPage = parseInt(e.target.value);
                              setItemsPerPage(newItemsPerPage);
                              setCurrentPage(1); // Reset to first page when changing items per page
                            }}
                            style={{ 
                              padding: "6px 10px", 
                              background: "#f3f4f6", 
                              border: "1px solid #e5e7eb", 
                              borderRadius: "6px", 
                              cursor: "pointer",
                              fontSize: "13px",
                              textAlign: "center"
                            }}
                          >
                            <option value={5}>5</option>
                            <option value={8}>8</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>
        </div>
      </div>

      {/* View Recipe Dialog */}
      {showViewDialog && viewingRecipe && (
        <div onClick={() => setShowViewDialog(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", width: "800px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            
            {/* Header with image and basic info */}
            <div style={{ position: "relative" }}>
              {/* Back button and heart icon */}
              <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10 }}>
                <button onClick={() => setShowViewDialog(false)} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px" }}>
                  ←
                </button>
              </div>
              <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10 }}>
                <button style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px" }}>
                  ♡
                </button>
              </div>
              
              {/* Recipe image */}
              <div style={{ width: "100%", height: "300px", borderRadius: "16px 16px 0 0", overflow: "hidden", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {viewingRecipe.image ? (
                  <img src={viewingRecipe.image} alt={viewingRecipe.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "48px" }}>🍽️</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              {/* Title and basic info */}
              <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 12px 0", color: "#1a1a1a" }}>{viewingRecipe.title}</h1>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", color: "#6b7280", fontSize: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>🕒</span>
                  <span>{viewingRecipe.cookingTime || (viewingRecipe.time ? parseInt(viewingRecipe.time.replace(/\D/g, '')) : 0)} min</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>🥄</span>
                  <span>{viewingRecipe.ingredientsList?.length || viewingRecipe.ingredients || 0} ingredients</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                {viewingRecipe.description || "A delicious recipe that's perfect for any occasion. Made with fresh ingredients and packed with flavor."}
              </p>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <button style={{ padding: "10px 20px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  💬 Comments (24)
                </button>
                <button style={{ padding: "10px 20px", background: "#7c9653", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  🖨️ Print Recipe
                </button>
              </div>

              {/* Recipe stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px", padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>👥 Servings</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>4</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>📊 Difficulty</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#10b981" }}>Easy</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>🔥 Calories</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>320 kcal</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>per serving</div>
                </div>
              </div>

              {/* Two column layout for ingredients and instructions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
                
                {/* Ingredients */}
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>Ingredients</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {viewingRecipe.ingredientsList && viewingRecipe.ingredientsList.length > 0 ? (
                      viewingRecipe.ingredientsList.map((ingredient, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px", fontSize: "14px" }}>
                          <span style={{ color: "#10b981", marginTop: "2px" }}>●</span>
                          <span style={{ color: "#374151" }}>{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>No ingredients listed</div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>Instructions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {viewingRecipe.steps && viewingRecipe.steps.length > 0 ? (
                      viewingRecipe.steps.map((step, index) => (
                        <div key={index} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>
                            {index + 1}
                          </div>
                          <p style={{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{step}</p>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>No instructions available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chef's Tip */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "16px", marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px" }}>👨‍🍳</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#059669", margin: 0 }}>Chef's Tip</h4>
                </div>
                <p style={{ fontSize: "14px", color: "#065f46", margin: 0, lineHeight: "1.5" }}>
                  Add tofu or grilled chicken for extra protein. You can also use brown rice or quinoa for a healthier twist.
                </p>
              </div>

              {/* Nutrition Facts */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>Nutrition (per serving)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
                  {[
                    { icon: "🔥", value: "320", label: "Calories" },
                    { icon: "🥩", value: "12g", label: "Protein" },
                    { icon: "🌾", value: "45g", label: "Carbs" },
                    { icon: "🧈", value: "10g", label: "Fat" },
                    { icon: "🥬", value: "5g", label: "Fiber" }
                  ].map((item, index) => (
                    <div key={index} style={{ textAlign: "center", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{item.icon}</div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}>{item.value}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>Comments (24)</h3>
                  <button style={{ fontSize: "14px", color: "#7c9653", background: "none", border: "none", cursor: "pointer" }}>View all</button>
                </div>
                
                {/* Sample comment */}
                <div style={{ display: "flex", gap: "12px", padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#7c9653", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", flexShrink: 0 }}>
                    AS
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>Ali Shah</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>2 days ago</span>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{ color: "#fbbf24", fontSize: "12px" }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 8px 0", lineHeight: "1.5" }}>
                      Amazing recipe! Quick, easy and super delicious.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <button style={{ fontSize: "12px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        ♡ 12
                      </button>
                      <button style={{ fontSize: "12px", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recipe Dialog */}
      {showEditDialog && editingRecipe && (
        <div onClick={() => setShowEditDialog(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "500px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontWeight: "800", fontSize: "18px", marginBottom: "1.2rem" }}>Edit Recipe</h3>
            
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Recipe Title</label>
              <input value={editingRecipe.title} onChange={e => setEditingRecipe({ ...editingRecipe, title: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Category</label>
              <input value={editingRecipe.category} onChange={e => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Author</label>
              <input value={editingRecipe.author} onChange={e => setEditingRecipe({ ...editingRecipe, author: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Ingredients (comma separated)</label>
              <textarea value={(editingRecipe.ingredientsList as any)?.join(", ") || ""} onChange={e => setEditingRecipe({ ...editingRecipe, ingredientsList: e.target.value.split(",").map(i => i.trim()) as any })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", minHeight: "80px", fontFamily: "inherit" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Cooking Time (minutes)</label>
              <input value={editingRecipe.cookingTime || (editingRecipe.time ? parseInt(editingRecipe.time.replace(/\D/g, '')) : 0)} onChange={e => setEditingRecipe({ ...editingRecipe, cookingTime: parseInt(e.target.value) || 0 })}
                type="number"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Status</label>
              <select value={editingRecipe.status} onChange={e => setEditingRecipe({ ...editingRecipe, status: e.target.value as any })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowEditDialog(false)} style={{ padding: "9px 20px", background: "#f3f4f6", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              <button onClick={async () => {
                try {
                  const res = await axios.put(`http://localhost:5000/api/recipes/${editingRecipe._id}`, {
                    title: editingRecipe.title,
                    category: editingRecipe.category,
                    author: editingRecipe.author,
                    ingredientsList: Array.isArray(editingRecipe.ingredientsList) ? editingRecipe.ingredientsList : (editingRecipe.ingredientsList as any)?.split(",").map((i: string) => i.trim()) || [],
                    ingredients: Array.isArray(editingRecipe.ingredientsList) ? editingRecipe.ingredientsList.length : (editingRecipe.ingredientsList as any)?.split(",").length || 0,
                    time: `${editingRecipe.cookingTime} min`,
                    cookingTime: editingRecipe.cookingTime,
                    status: editingRecipe.status
                  }, { headers: { Authorization: `Bearer ${token}` } });
                  setRecipes(prev => prev.map(r => r._id === editingRecipe._id ? res.data : r));
                  setShowEditDialog(false);
                  setEditingRecipe(null);
                  alert("Recipe updated successfully!");
                } catch (error) {
                  alert("Error updating recipe");
                }
              }} style={{ padding: "9px 24px", background: "#5a7a3a", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Recipe Dialog */}
      {showAddDialog && (
        <div onClick={() => setShowAddDialog(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "500px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontWeight: "800", fontSize: "18px", marginBottom: "1.2rem" }}>Add New Recipe</h3>
            
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Recipe Title</label>
              <input value={newRecipe.title} onChange={e => setNewRecipe({ ...newRecipe, title: e.target.value })}
                placeholder="Enter recipe title"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Category</label>
              <input value={newRecipe.category} onChange={e => setNewRecipe({ ...newRecipe, category: e.target.value })}
                placeholder="e.g., Dinner, Breakfast"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Author</label>
              <input value={newRecipe.author} onChange={e => setNewRecipe({ ...newRecipe, author: e.target.value })}
                placeholder="Enter author name"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Ingredients (comma separated)</label>
              <textarea value={newRecipe.ingredients} onChange={e => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                placeholder="e.g., Chicken, Garlic, Oil"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", minHeight: "80px", fontFamily: "inherit" }} />
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Cooking Time (minutes)</label>
              <input value={newRecipe.cookingTime} onChange={e => setNewRecipe({ ...newRecipe, cookingTime: e.target.value })}
                placeholder="e.g., 30"
                type="number"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Status</label>
              <select value={newRecipe.status} onChange={e => setNewRecipe({ ...newRecipe, status: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowAddDialog(false)} style={{ padding: "9px 20px", background: "#f3f4f6", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              <button onClick={async () => {
                if (!newRecipe.title || !newRecipe.category || !newRecipe.author) {
                  alert("Please fill in all required fields");
                  return;
                }
                try {
                  const res = await axios.post("http://localhost:5000/api/recipes", {
                    title: newRecipe.title,
                    category: newRecipe.category,
                    author: newRecipe.author,
                    ingredientsList: newRecipe.ingredients.split(",").map(i => i.trim()),
                    ingredients: newRecipe.ingredients.split(",").map(i => i.trim()).length,
                    time: `${newRecipe.cookingTime} min`,
                    cookingTime: parseInt(newRecipe.cookingTime) || 0,
                    status: newRecipe.status
                  }, { headers: { Authorization: `Bearer ${token}` } });
                  setRecipes(prev => [...prev, res.data]);
                  setShowAddDialog(false);
                  setNewRecipe({ title: "", category: "", author: "", ingredients: "", cookingTime: "", status: "Draft" });
                  alert("Recipe added successfully!");
                } catch (error) {
                  alert("Error adding recipe");
                }
              }} style={{ padding: "9px 24px", background: "#5a7a3a", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Add Recipe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecipes;
