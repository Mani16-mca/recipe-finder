import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import mealBg from "../assets/logo/mealbg.jpeg";
import axios from "axios";

const LOGO = "https://cdn-icons-png.flaticon.com/128/3183/3183463.png";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

type MealEntry = { name: string; cals: number; img: string } | null;
type MealsState = Record<string, Record<string, MealEntry>>;

const emptyMeals = (): MealsState => {
  const m: MealsState = {};
  mealTypes.forEach(t => { m[t] = {}; days.forEach(d => { m[t][d] = null; }); });
  return m;
};

const MealPlanner: React.FC = () => {
  const [meals, setMeals] = useState<MealsState>(emptyMeals);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return days.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.getDate();
    });
  };

  const weekDates = getWeekDates();
  const todayDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];

  const [activeDay, setActiveDay] = useState(todayDayName);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<{ type: string; day: string } | null>(null);
  const [newMeal, setNewMeal] = useState({ name: "", type: "Lunch", cals: 400, days: ["Wed"] as string[], img: "" });
  const [dbRecipes, setDbRecipes] = useState<string[]>([]);

  // Fetch recipe names for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then(r => r.json())
      .then((data: any[]) => {
        const names = data.map(r => r.title);
        setDbRecipes(names);
        if (names.length > 0) setNewMeal(prev => ({ ...prev, name: names[0] }));
      })
      .catch(() => setDbRecipes(["Avocado Toast", "Paneer Curry", "Veggie Omelette", "Chicken Salad"]));
  }, []);

  // Load meal plan from DB on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get("http://localhost:5000/api/mealplan", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const dbMeals = res.data.meals;
        const rebuilt = emptyMeals();
        if (dbMeals && dbMeals.length > 0) {
          dbMeals.forEach((m: any) => {
            if (rebuilt[m.type] && days.includes(m.day)) {
              rebuilt[m.type][m.day] = { name: m.name, cals: m.cals, img: m.img };
            }
          });
          console.log(`✅ Meal plan loaded: ${dbMeals.length} meals`);
        }
        setMeals(rebuilt);
      })
      .catch(err => {
        console.error("❌ Meal plan fetch error:", err.message);
        setMeals(emptyMeals());
      })
      .finally(() => setLoading(false));
  }, []);

  // Save to DB — always pass updated meals directly to avoid stale state
  const savePlan = (mealsToSave: MealsState) => {
    if (!token) return;
    const flat: any[] = [];
    mealTypes.forEach(type => {
      days.forEach(day => {
        const m = mealsToSave[type][day];
        if (m) flat.push({ name: m.name, cals: m.cals, img: m.img, day, type });
      });
    });
    axios.post("http://localhost:5000/api/mealplan", { meals: flat }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => console.log(`✅ Meal plan saved (${flat.length} meals)`))
      .catch(err => console.error("❌ Save error:", err.message));
  };

  const openEditMeal = (type: string, day: string) => {
    const meal = meals[type][day];
    if (!meal) return;
    setEditTarget({ type, day });
    setNewMeal({ name: meal.name, type, cals: meal.cals, days: [day], img: meal.img });
    setShowAddModal(true);
  };

  const handleAddMeal = () => {
    const updated: MealsState = JSON.parse(JSON.stringify(meals));
    newMeal.days.forEach(day => {
      if (updated[newMeal.type]) {
        updated[newMeal.type][day] = {
          name: newMeal.name,
          cals: newMeal.cals,
          img: newMeal.img || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&h=80&fit=crop",
        };
      }
    });
    setMeals(updated);
    setShowAddModal(false);
    setEditTarget(null);
    setNewMeal({ name: dbRecipes[0] || "", type: "Lunch", cals: 400, days: ["Wed"], img: "" });
    savePlan(updated);
  };

  const handleRemoveMeal = () => {
    if (!editTarget) return;
    const updated: MealsState = JSON.parse(JSON.stringify(meals));
    updated[editTarget.type][editTarget.day] = null;
    setMeals(updated);
    setShowAddModal(false);
    setEditTarget(null);
    savePlan(updated);
  };

  const toggleDay = (d: string) => {
    setNewMeal(prev => ({
      ...prev,
      days: prev.days.includes(d) ? prev.days.filter(x => x !== d) : [...prev.days, d],
    }));
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f3f0", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ textAlign: "center", color: "#7C9653" }}>
          <div style={{ fontSize: "40px", marginBottom: "1rem" }}>🍽</div>
          <p style={{ fontWeight: "600", fontSize: "16px" }}>Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundImage: `url(${mealBg})`, 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh", 
      width: "100%",
      fontFamily: "'Inter', sans-serif" 
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
              paddingBottom: "4px",
              borderBottom: "3px solid #d97706",
              transition: "color 0.2s"
            }}>
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

      {/* Main Content */}
      <div style={{ padding: "140px 2rem 1rem 2rem" }}>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontWeight: "900", fontSize: "32px", color: "#1a1a1a", marginBottom: "4px", fontFamily: "'Georgia', serif" }}>My Meal Planner</h1>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>Plan, organize & track your weekly meals</p>
      </div>

      {/* Today's Meals */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 3rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ 
            fontWeight: "700", 
            fontSize: "24px", 
            color: "#2d3748", 
            margin: "0", 
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            Today's Meals 
            <span style={{ 
              fontSize: "16px", 
              color: "#6b7280", 
              fontWeight: "400"
            }}>
              ({todayDayName})
            </span>
          </h2>
          <div style={{ 
            height: "3px", 
            width: "40px", 
            background: "#7C9653", 
            marginTop: "8px",
            borderRadius: "2px"
          }}></div>
        </div>
        
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { type: "Breakfast", icon: "☀️", color: "#f59e0b" },
            { type: "Lunch", icon: "☀️", color: "#f59e0b" },
            { type: "Dinner", icon: "🌙", color: "#6b7280" }
          ].map(({ type, icon }) => {
            const meal = meals[type]?.[todayDayName];
            return (
              <div key={type} style={{ 
                flex: 1, 
                background: "#fff", 
                borderRadius: "16px", 
                padding: "20px", 
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid #f1f5f9",
                position: "relative"
              }}>

                {meal ? (
                  <div style={{ 
                    display: "flex", 
                    gap: "16px", 
                    alignItems: "flex-start" 
                  }}>
                    {/* Meal Image - Left Side */}
                    <div style={{ 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "12px", 
                      overflow: "hidden",
                      flexShrink: 0
                    }}>
                      <img 
                        src={meal.img} 
                        alt={meal.name} 
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover" 
                        }} 
                      />
                    </div>

                    {/* Meal Content - Right Side */}
                    <div style={{ flex: 1 }}>
                      {/* Meal Type Header */}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        marginBottom: "8px" 
                      }}>
                        <div style={{ 
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px", 
                          fontWeight: "600", 
                          color: type === "Breakfast" ? "#f59e0b" : type === "Lunch" ? "#f59e0b" : "#7c9653",
                          background: type === "Breakfast" ? "#fef3c7" : type === "Lunch" ? "#fef3c7" : "#f0f9ff",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontFamily: "'Inter', sans-serif"
                        }}>
                          <span style={{ fontSize: "14px" }}>{icon}</span>
                          <span>{type}</span>
                        </div>
                      </div>

                      {/* Meal Name */}
                      <h3 style={{ 
                        fontSize: "16px", 
                        fontWeight: "600", 
                        color: "#1f2937", 
                        margin: "0 0 6px 0",
                        fontFamily: "'Inter', sans-serif"
                      }}>
                        {meal.name}
                      </h3>

                      {/* Calories */}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px",
                        marginBottom: "12px"
                      }}>
                        <span style={{ fontSize: "12px", color: "#f59e0b" }}>🔥</span>
                        <span style={{ 
                          fontSize: "13px", 
                          fontWeight: "500",
                          color: "#6b7280"
                        }}>
                          {meal.cals} Cals
                        </span>
                      </div>

                      {/* Edit Button */}
                      <button 
                        onClick={() => openEditMeal(type, todayDayName)}
                        style={{ 
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 10px", 
                          background: "transparent", 
                          border: "1px solid #e5e7eb", 
                          borderRadius: "6px", 
                          fontSize: "11px", 
                          fontWeight: "500", 
                          color: "#6b7280",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                          e.currentTarget.style.borderColor = "#d1d5db";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    minHeight: "200px",
                    color: "#9ca3af", 
                    textAlign: "center" 
                  }}>
                    <div style={{ 
                      fontSize: "48px", 
                      marginBottom: "12px",
                      opacity: 0.5
                    }}>
                      🍽
                    </div>
                    <div style={{ 
                      fontSize: "14px", 
                      marginBottom: "16px",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      No {type.toLowerCase()} planned
                    </div>
                    <button 
                      onClick={() => { 
                        setEditTarget(null); 
                        setNewMeal({ 
                          name: dbRecipes[0] || "", 
                          type: type, 
                          cals: 400, 
                          days: [todayDayName], 
                          img: "" 
                        }); 
                        setShowAddModal(true); 
                      }} 
                      style={{ 
                        padding: "8px 16px", 
                        background: "#7C9653", 
                        border: "none", 
                        borderRadius: "8px", 
                        fontSize: "12px", 
                        fontWeight: "600", 
                        color: "#fff", 
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#6a8347")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#7C9653")}
                    >
                      + Add
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: "16px", padding: "1.5rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.10)", maxWidth: "1100px", margin: "0 auto 2rem" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a1a" }}>Weekly Meals</span>
          <button onClick={() => { setEditTarget(null); setNewMeal({ name: dbRecipes[0] || "", type: "Lunch", cals: 400, days: ["Wed"], img: "" }); setShowAddModal(true); }}
            style={{ padding: "9px 20px", background: "#5a7a3a", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
            + Add Meal
          </button>
        </div>

        {/* Day tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <div style={{ width: "90px", flexShrink: 0 }} />
          {days.map((d, i) => {
            const isToday = d === todayDayName;
            const isActive = d === activeDay;
            return (
              <div key={d} onClick={() => setActiveDay(d)}
                style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: "8px 8px 0 0", background: isActive ? "#e8f0e0" : "transparent", cursor: "pointer" }}>
                <div style={{ fontWeight: isActive ? "700" : "500", fontSize: "13px", color: isActive ? "#2d5016" : "#6b7280" }}>{d}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", width: "24px", height: "24px", borderRadius: "50%", background: isToday ? "#5a7a3a" : "transparent", color: isToday ? "#fff" : (isActive ? "#7C9653" : "#9ca3af"), display: "flex", alignItems: "center", justifyContent: "center", margin: "2px auto 0" }}>
                  {weekDates[i]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Meal rows */}
        {mealTypes.map(type => (
          <div key={type} style={{ display: "flex", gap: "8px", alignItems: "stretch", marginBottom: "10px", minHeight: "110px" }}>
            <div style={{ width: "90px", flexShrink: 0, paddingLeft: "12px", fontWeight: "600", fontSize: "13px", color: "#374151", display: "flex", alignItems: "center" }}>{type}</div>
            {days.map(d => {
              const meal = meals[type]?.[d];
              return (
                <div key={d}
                  style={{ flex: "0 0 calc((100% - 90px - 48px) / 7)", width: "calc((100% - 90px - 48px) / 7)", background: meal ? "#fff" : "#f9f9f7", borderRadius: "8px", padding: meal ? "6px" : "0", border: "1px solid #f0ede6", minHeight: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: meal ? "pointer" : "default", transition: "box-shadow 0.2s" }}
                  onClick={() => meal && openEditMeal(type, d)}
                  onMouseEnter={e => { if (meal) e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {meal && (
                    <>
                      <img src={meal.img} alt={meal.name} style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", marginBottom: "5px" }} />
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#1a1a1a", textAlign: "center", lineHeight: "1.3" }}>{meal.name}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>{meal.cals} Cals</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Add/Edit Meal Modal */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "480px", maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'Inter',sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "800", fontSize: "20px", color: "#1a1a1a", margin: 0 }}>{editTarget ? "Edit Meal" : "Add Meal"}</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            <label style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a1a", display: "block", marginBottom: "6px" }}>Meal Name</label>
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <select value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
                style={{ width: "100%", padding: "12px 40px 12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", appearance: "none", background: "#fff", cursor: "pointer", color: "#1a1a1a" }}>
                {dbRecipes.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <svg style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            <label style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a1a", display: "block", marginBottom: "6px" }}>Meal Time</label>
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <select value={newMeal.type} onChange={e => setNewMeal({ ...newMeal, type: e.target.value })}
                style={{ width: "100%", padding: "12px 40px 12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", appearance: "none", background: "#fff", cursor: "pointer", color: "#1a1a1a" }}>
                {["Breakfast", "Lunch", "Dinner"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <svg style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Calories</label>
                <input type="number" value={newMeal.cals} onChange={e => setNewMeal({ ...newMeal, cals: Number(e.target.value) })}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Days</label>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {days.map(d => (
                    <button key={d} onClick={() => toggleDay(d)}
                      style={{ padding: "5px 8px", borderRadius: "6px", border: "1.5px solid", borderColor: newMeal.days.includes(d) ? "#5a7a3a" : "#e5e7eb", background: newMeal.days.includes(d) ? "#5a7a3a" : "#fff", color: newMeal.days.includes(d) ? "#fff" : "#6b7280", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Image URL (optional)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              {newMeal.img
                ? <img src={newMeal.img} alt="meal" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }} />
                : <div style={{ width: "70px", height: "70px", background: "#f3f4f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🍽</div>
              }
              <input type="text" placeholder="Paste image URL..." value={newMeal.img} onChange={e => setNewMeal({ ...newMeal, img: e.target.value })}
                style={{ padding: "6px 10px", border: "1.5px solid #e5e7eb", borderRadius: "6px", fontSize: "12px", width: "220px", outline: "none" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
              <button onClick={handleAddMeal} style={{ padding: "10px 28px", background: "#5a7a3a", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                {editTarget ? "Save Changes" : "Save Meal"}
              </button>
              {editTarget && (
                <button onClick={handleRemoveMeal} style={{ padding: "10px 20px", background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: "10px", color: "#dc2626", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  Remove Meal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      </div> {/* Close Main Content */}
    </div>
  );
};

export default MealPlanner;
