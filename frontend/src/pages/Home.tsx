import React, { useState } from "react";
import RecipeHero from "../components/RecipeHero.tsx";
import RecipeCards from "../components/RecipeCards.tsx";
import type { Recipe } from "../components/RecipeCards.tsx";
import bgImage from "../assets/logo/favbg.png";

interface HomeProps {
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: number) => boolean;
  isLoggedIn: boolean;
  setIsLoggedIn?: (v: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ toggleFavorite, isFavorite, isLoggedIn, setIsLoggedIn }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ margin: "0", padding: "0", position: "relative" }}>
      <RecipeHero searchQuery={searchQuery} onSearch={setSearchQuery} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* Background image container for recipe cards section */}
      <div style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative"
      }}>
        <RecipeCards 
          toggleFavorite={toggleFavorite} 
          isFavorite={isFavorite} 
          searchQuery={searchQuery} 
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default Home;
