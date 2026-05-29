import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import Categories from "./pages/Categories.tsx";
import Favorites from "./pages/Favorites.tsx";
import MealPlanner from "./pages/MealPlanner.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import About from "./pages/About.tsx";
import AdminDashboard from "./admin/AdminDashboard.tsx";
import ManageUsers from "./admin/ManageUsers.tsx";
import ManageRecipes from "./admin/ManageRecipes.tsx";
interface Recipe {
  id?: number;
  title: string;
  image: string;
  time: string;
  ingredients: number;
  category?: string;
  isVeg: boolean;
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  if (!token || user.role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const WithNav = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Footer />
  </>
);

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));

  const toggleFavorite = async (recipe: Recipe) => {
    const token = localStorage.getItem("token");
    
    // Update local state immediately for better UX
    const isCurrentlyFavorite = favorites.some((r) => r.id === recipe.id);
    
    if (isCurrentlyFavorite) {
      setFavorites((prev) => prev.filter((r) => r.id !== recipe.id));
    } else {
      setFavorites((prev) => [...prev, recipe]);
    }

    // Sync with backend if logged in
    if (token) {
      try {
        if (isCurrentlyFavorite) {
          // Remove from favorites
          await fetch(`http://localhost:5000/api/favorites/${recipe.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          // Add to favorites
          await fetch("http://localhost:5000/api/favorites", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              recipeId: recipe.id,
              title: recipe.title,
              image: recipe.image,
              time: recipe.time,
              ingredients: recipe.ingredients,
              category: recipe.category,
              isVeg: recipe.isVeg
            })
          });
        }
      } catch (error) {
        console.error("Error syncing favorite:", error);
        // Revert local state on error
        if (isCurrentlyFavorite) {
          setFavorites((prev) => [...prev, recipe]);
        } else {
          setFavorites((prev) => prev.filter((r) => r.id !== recipe.id));
        }
      }
    }
  };

  // Load favorites from backend on login
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isLoggedIn) {
      fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const mapped: Recipe[] = data.map((f: any) => ({
            id: f.recipeId,
            title: f.title,
            image: f.image,
            time: f.time,
            ingredients: f.ingredients,
            category: f.category,
            isVeg: f.isVeg
          }));
          setFavorites(mapped);
        })
        .catch(err => console.error("Error loading favorites:", err));
    } else if (!isLoggedIn) {
      // Clear favorites when logged out
      setFavorites([]);
    }
  }, [isLoggedIn]);

  const isFavorite = (id: number) => favorites.some((r) => r.id === id);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home at root — with navbar integrated in hero */}
        <Route path="/" element={<WithNav><Home toggleFavorite={(recipe: any) => toggleFavorite(recipe)} isFavorite={isFavorite} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></WithNav>} />
        <Route path="/home" element={<WithNav><Home toggleFavorite={(recipe: any) => toggleFavorite(recipe)} isFavorite={isFavorite} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></WithNav>} />

        {/* Admin — without Navbar/Footer */}
        <Route path="/admin/recipes/new" element={<AdminRoute><div style={{ padding: "2rem" }}>Add New Recipe - Coming Soon</div></AdminRoute>} />
        <Route path="/admin/recipes/:id/edit" element={<AdminRoute><div style={{ padding: "2rem" }}>Edit Recipe - Coming Soon</div></AdminRoute>} />
        <Route path="/admin/recipes/:id" element={<AdminRoute><div style={{ padding: "2rem" }}>View Recipe - Coming Soon</div></AdminRoute>} />
        <Route path="/admin/recipes" element={<AdminRoute><ManageRecipes /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/categories" element={<WithNav><Categories /></WithNav>} />
        <Route path="/favorites" element={<WithNav><Favorites favorites={favorites as any} toggleFavorite={(recipe: any) => toggleFavorite(recipe)} isFavorite={isFavorite} /></WithNav>} />
        <Route path="/mealplanner" element={<WithNav><MealPlanner /></WithNav>} />
        <Route path="/about" element={<WithNav><About /></WithNav>} />
        <Route path="/login" element={<WithNav><Login setIsLoggedIn={setIsLoggedIn} /></WithNav>} />
        <Route path="/signup" element={<WithNav><Signup setIsLoggedIn={setIsLoggedIn} /></WithNav>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
