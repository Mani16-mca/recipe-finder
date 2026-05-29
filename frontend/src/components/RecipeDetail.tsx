import React from "react";
import type { Recipe } from "./RecipeCards.tsx";

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

interface Detail {
  description: string;
  isVeg: boolean;
  ingredients: string[];
  steps: string[];
}

const recipeDetails: Record<number, Detail> = {
  1: {
    isVeg: false,
    description: "Tender chicken pieces cooked in a rich garlic cream sauce with cherry tomatoes and Parmesan. A quick, satisfying dinner perfect for busy weeknights.",
    ingredients: ["1 lb chicken breast, cubed", "2 tbsp olive oil", "4 garlic cloves, minced", "1/2 cup heavy cream", "1/2 cup chicken broth", "1 cup cherry tomatoes", "1/4 cup Parmesan, grated", "1 tsp Italian herbs", "Salt & pepper", "Fresh basil to garnish"],
    steps: ["Season chicken with salt, pepper, and Italian herbs.", "Heat olive oil in a skillet. Sear chicken until golden, then remove.", "Sauté garlic 1 min. Add broth and cream, simmer 3 min.", "Add tomatoes and Parmesan. Stir until sauce thickens.", "Return chicken, coat in sauce. Garnish with basil and serve."],
  },
  2: {
    isVeg: true,
    description: "A colorful mix of fresh vegetables tossed in a savory soy-sesame sauce over high heat. Ready in 20 minutes and packed with nutrients.",
    ingredients: ["1 cup broccoli florets", "1 red bell pepper, sliced", "1 carrot, julienned", "1 cup mushrooms", "3 garlic cloves", "1 tsp fresh ginger", "2 tbsp soy sauce", "1 tbsp sesame oil", "2 tbsp vegetable oil", "1 tsp cornstarch", "Spring onions & sesame seeds", "Salt to taste"],
    steps: ["Mix soy sauce, sesame oil, and cornstarch. Set aside.", "Heat vegetable oil in a wok over high heat.", "Add garlic and ginger, stir 30 seconds.", "Add broccoli and carrots, stir-fry 3 min. Add peppers and mushrooms, 2 more min.", "Pour sauce over vegetables. Toss well. Garnish and serve."],
  },
  3: {
    isVeg: true,
    description: "Classic golden cookies with crispy edges and gooey chocolate centers. A timeless treat that everyone loves.",
    ingredients: ["2 cups all-purpose flour", "1 tsp baking soda", "1/2 tsp salt", "1 cup butter, softened", "3/4 cup white sugar", "3/4 cup brown sugar", "2 large eggs", "2 tsp vanilla extract", "2 cups chocolate chips"],
    steps: ["Preheat oven to 375°F (190°C). Line baking sheet.", "Whisk flour, baking soda, and salt together.", "Beat butter and both sugars until fluffy. Add eggs and vanilla.", "Fold in flour mixture, then chocolate chips.", "Drop rounded spoonfuls on sheet. Bake 9-11 min until edges are golden."],
  },
  4: {
    isVeg: true,
    description: "Creamy smashed avocado on crispy sourdough topped with perfectly cooked eggs. A nutritious breakfast in 15 minutes.",
    ingredients: ["2 slices sourdough bread", "1 ripe avocado", "2 eggs", "1/2 lemon, juiced", "Red pepper flakes", "Salt & black pepper", "1 tbsp olive oil", "Microgreens or sprouts", "Everything bagel seasoning (optional)", "Feta cheese (optional)"],
    steps: ["Toast sourdough until golden and crispy.", "Mash avocado with lemon juice, salt, and pepper.", "Fry or poach eggs to your preference.", "Spread avocado generously on toast. Top with egg.", "Drizzle olive oil, sprinkle red pepper flakes and microgreens."],
  },
  5: {
    isVeg: false,
    description: "A rich, slow-simmered meat sauce over al dente spaghetti. The ultimate Italian comfort food that feeds the whole family.",
    ingredients: ["400g spaghetti", "500g ground beef", "1 large onion, diced", "3 garlic cloves, minced", "400g canned crushed tomatoes", "2 tbsp tomato paste", "1 tsp dried oregano", "1 tsp dried basil", "1/2 cup red wine (optional)", "Salt & pepper", "Parmesan to serve", "Fresh basil leaves"],
    steps: ["Cook spaghetti in salted water per package instructions.", "Brown ground beef in a large pan. Drain excess fat.", "Add onion and garlic, cook 3-4 min until soft.", "Stir in tomato paste, crushed tomatoes, wine, oregano, and basil. Simmer 20 min.", "Season with salt and pepper. Serve over pasta with Parmesan."],
  },
  6: {
    isVeg: false,
    description: "Juicy grilled chicken thighs seasoned with cumin and chili, served in warm tortillas with fresh toppings.",
    ingredients: ["500g chicken thighs", "8 small corn tortillas", "1 lime, juiced", "1 tsp ground cumin", "1 tsp chili powder", "1/2 tsp garlic powder", "Salsa", "Sour cream", "Cheddar cheese, shredded", "Fresh cilantro", "Salt & pepper"],
    steps: ["Mix cumin, chili, garlic powder, lime juice, salt. Marinate chicken 15 min.", "Grill or pan-fry chicken 6-7 min per side until cooked through.", "Rest 5 min, then slice thinly.", "Warm tortillas in a dry pan.", "Fill tortillas with chicken, salsa, cheese, sour cream, and cilantro."],
  },
  7: {
    isVeg: true,
    description: "A simple Italian classic with fresh tomatoes, creamy mozzarella, and fragrant basil. No cooking required.",
    ingredients: ["3 large ripe tomatoes", "200g fresh mozzarella", "Fresh basil leaves", "3 tbsp extra virgin olive oil", "1 tbsp balsamic glaze", "Flaky sea salt", "Freshly cracked black pepper", "1 tsp dried oregano (optional)", "Crusty bread to serve", "Garlic clove (for rubbing bread)"],
    steps: ["Slice tomatoes and mozzarella into even 1cm rounds.", "Alternate tomato and mozzarella slices on a serving plate.", "Tuck fresh basil leaves between each slice.", "Drizzle generously with olive oil and balsamic glaze.", "Season with sea salt and black pepper. Serve immediately."],
  },
  8: {
    isVeg: true,
    description: "Fluffy, golden muffins bursting with juicy blueberries. Perfect for breakfast or an afternoon snack.",
    ingredients: ["2 cups all-purpose flour", "2 tsp baking powder", "1/2 cup granulated sugar", "1/2 tsp salt", "1 large egg", "1 cup whole milk", "1/3 cup melted butter", "1 tsp vanilla extract", "1.5 cups fresh blueberries"],
    steps: ["Preheat oven to 400°F (200°C). Line a 12-cup muffin tin.", "Whisk flour, baking powder, sugar, and salt in a large bowl.", "In another bowl, whisk egg, milk, melted butter, and vanilla.", "Pour wet ingredients into dry. Stir until just combined (don't overmix).", "Fold in blueberries. Fill cups 3/4 full. Bake 18-20 min until golden."],
  },
  9: {
    isVeg: true,
    description: "Creamy, velvety risotto with earthy mushrooms and Parmesan. A restaurant-quality dish made at home.",
    ingredients: ["1.5 cups Arborio rice", "400g mixed mushrooms, sliced", "1 onion, finely diced", "3 garlic cloves", "1/2 cup white wine", "4 cups warm vegetable broth", "1/2 cup Parmesan, grated", "3 tbsp butter", "2 tbsp olive oil", "Fresh thyme", "Salt & pepper", "Fresh parsley to garnish"],
    steps: ["Sauté mushrooms in 1 tbsp butter until golden. Set aside.", "In same pan, heat olive oil. Cook onion and garlic until soft.", "Add rice, stir 2 min. Pour in wine, stir until absorbed.", "Add warm broth one ladle at a time, stirring constantly until absorbed each time (about 20 min).", "Stir in remaining butter, Parmesan, and mushrooms. Season and garnish."],
  },
  10: {
    isVeg: true,
    description: "A refreshing Mediterranean salad with crisp vegetables, olives, and creamy feta in a tangy dressing.",
    ingredients: ["2 large cucumbers, diced", "4 ripe tomatoes, diced", "1 red onion, thinly sliced", "200g feta cheese, crumbled", "1 cup Kalamata olives", "1 green bell pepper, diced", "3 tbsp olive oil", "1 tbsp red wine vinegar", "1 tsp dried oregano", "Salt & pepper"],
    steps: ["Dice cucumbers, tomatoes, and bell pepper into similar-sized pieces.", "Thinly slice red onion and soak in cold water 5 min to reduce sharpness.", "Combine all vegetables and olives in a large bowl.", "Whisk olive oil, vinegar, oregano, salt, and pepper.", "Pour dressing over salad. Top with feta. Serve immediately."],
  },
  11: {
    isVeg: false,
    description: "Crispy seasoned beef tacos with fresh toppings. A crowd-pleasing Mexican classic ready in 20 minutes.",
    ingredients: ["500g ground beef", "8 taco shells", "1 packet taco seasoning", "1/2 cup water", "1 cup shredded lettuce", "2 tomatoes, diced", "1 cup cheddar cheese, shredded", "Sour cream", "Salsa", "Jalapeños (optional)", "Lime wedges"],
    steps: ["Brown ground beef in a skillet over medium-high heat.", "Drain fat. Add taco seasoning and water. Simmer 5 min.", "Warm taco shells in oven at 350°F for 3 min.", "Fill shells with beef mixture.", "Top with lettuce, tomato, cheese, sour cream, and salsa."],
  },
  12: {
    isVeg: false,
    description: "Authentic Thai noodles with a perfect balance of sweet, sour, and savory flavors with crunchy peanuts.",
    ingredients: ["200g rice noodles", "200g shrimp or tofu", "2 eggs", "3 tbsp fish sauce", "2 tbsp tamarind paste", "1 tbsp sugar", "2 garlic cloves", "2 spring onions", "1 cup bean sprouts", "1/4 cup crushed peanuts", "Lime wedges", "Chili flakes"],
    steps: ["Soak rice noodles in warm water 20 min. Drain.", "Mix fish sauce, tamarind, and sugar. Set aside.", "Stir-fry garlic in oil. Add shrimp/tofu, cook 2 min.", "Push to side, scramble eggs. Add noodles and sauce.", "Toss everything together. Top with sprouts, peanuts, and lime."],
  },
  13: {
    isVeg: true,
    description: "A classic Neapolitan pizza with a thin crispy crust, tangy tomato sauce, and fresh mozzarella.",
    ingredients: ["Pizza dough (store-bought or homemade)", "1/2 cup tomato sauce", "200g fresh mozzarella, sliced", "Fresh basil leaves", "2 tbsp olive oil", "1 tsp dried oregano", "Salt & pepper", "Semolina flour for dusting"],
    steps: ["Preheat oven to 500°F (260°C) with pizza stone or baking sheet inside.", "Roll dough on semolina-dusted surface to thin round.", "Spread tomato sauce, leaving 1-inch border.", "Top with mozzarella slices. Drizzle olive oil.", "Bake 8-10 min until crust is golden. Top with fresh basil."],
  },
  14: {
    isVeg: true,
    description: "A classic Caesar salad with crispy romaine, crunchy croutons, and a creamy tangy dressing.",
    ingredients: ["1 large romaine lettuce, chopped", "1 cup croutons", "1/2 cup Parmesan, shaved", "3 tbsp Caesar dressing", "1 lemon, juiced", "1 garlic clove, minced", "1 tsp Worcestershire sauce", "Salt & black pepper", "Anchovy paste (optional)", "Olive oil"],
    steps: ["Wash and dry romaine. Chop into bite-sized pieces.", "Make dressing: mix Caesar dressing, lemon, garlic, Worcestershire.", "Toss romaine with dressing until well coated.", "Add croutons and Parmesan. Toss gently.", "Season with salt and pepper. Serve immediately."],
  },
  15: {
    isVeg: true,
    description: "Bright and zesty lemon pasta with garlic, olive oil, and fresh herbs. Simple, elegant, and ready in 18 minutes.",
    ingredients: ["400g spaghetti or linguine", "4 garlic cloves, minced", "1 lemon, zested and juiced", "1/3 cup olive oil", "1/2 cup Parmesan, grated", "1/4 cup fresh parsley, chopped", "1/2 tsp red pepper flakes", "Salt & black pepper", "Reserved pasta water"],
    steps: ["Cook pasta in well-salted water until al dente. Reserve 1 cup pasta water.", "Heat olive oil in a pan. Sauté garlic and red pepper flakes 1 min.", "Add lemon zest and juice. Stir.", "Add drained pasta and splash of pasta water. Toss to coat.", "Remove from heat. Add Parmesan and parsley. Season and serve."],
  },
  16: {
    isVeg: false,
    description: "Slow-cooked chicken in a rich, aromatic tomato-cream sauce with warming Indian spices. Best served with naan or rice.",
    ingredients: ["700g chicken thighs, cubed", "1 cup tomato puree", "1/2 cup heavy cream", "1 onion, diced", "4 garlic cloves", "1 tbsp fresh ginger", "2 tbsp butter", "1 tsp garam masala", "1 tsp cumin", "1 tsp coriander", "1/2 tsp turmeric", "1/2 tsp chili powder", "Salt", "Fresh cilantro"],
    steps: ["Marinate chicken in yogurt, turmeric, and chili 30 min.", "Sauté onion in butter until golden. Add garlic and ginger.", "Add spices, cook 1 min. Add tomato puree, simmer 10 min.", "Add chicken, cook 15 min until tender.", "Stir in cream. Simmer 5 min. Garnish with cilantro."],
  },
};

const defaultDetail: Detail = {
  isVeg: true,
  description: "A delicious recipe made with fresh, quality ingredients. Simple to prepare and full of flavor.",
  ingredients: ["Main ingredient", "Olive oil", "Garlic cloves", "Salt & pepper", "Fresh herbs"],
  steps: ["Prepare all ingredients.", "Cook following standard technique.", "Season to taste.", "Plate and garnish.", "Serve immediately."],
};

const RecipeDetail: React.FC<Props> = ({ recipe, onClose }) => {
  const detail = recipeDetails[recipe.id] || defaultDetail;
  const [showComments, setShowComments] = React.useState(false);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "16px", maxWidth: "1000px", width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)", fontFamily: "'Inter',sans-serif", display: "flex" }}
      >
        {/* Left Panel - Recipe Card */}
        <div style={{ flex: 1, padding: "2rem", borderRight: showComments ? "1px solid #e5e7eb" : "none", maxHeight: "92vh", overflowY: "auto" }}>
          {/* Recipe Image */}
          <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "12px", marginBottom: "1.5rem" }} />
          
          {/* Recipe Title */}
          <h2 style={{ fontWeight: "800", fontSize: "24px", color: "#1a1a1a", marginBottom: "1rem", fontFamily: "'Georgia',serif", lineHeight: "1.2" }}>
            {recipe.title}
          </h2>

          {/* Quick Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#6b7280", fontSize: "14px", marginBottom: "1.5rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {recipe.time}
            </span>
            <span style={{ color: "#d1d5db" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#7C9653" stroke="none"><circle cx="12" cy="12" r="6"/></svg>
              {detail.ingredients.length} ingredients
            </span>
          </div>

          {/* Comments Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            style={{ width: "100%", padding: "12px 16px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#6b7280", marginBottom: "1.5rem" }}
          >
            💬 Comments (18)
          </button>

          {/* Description */}
          <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.8", marginBottom: "1.5rem" }}>{detail.description}</p>

          {/* Ingredients */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a1a", marginBottom: "0.8rem", fontFamily: "'Georgia',serif" }}>
              Ingredients
            </h4>
            <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
              {detail.ingredients.map((ing, i) => (
                <li key={i} style={{ color: "#374151", fontSize: "13px", marginBottom: "6px", lineHeight: "1.5" }}>{ing}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h4 style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a1a", marginBottom: "0.8rem", fontFamily: "'Georgia',serif" }}>
              Instructions
            </h4>
            <ol style={{ paddingLeft: "1.2rem", margin: 0 }}>
              {detail.steps.map((step, i) => (
                <li key={i} style={{ color: "#374151", fontSize: "13px", marginBottom: "10px", lineHeight: "1.6" }}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Panel - Comments */}
        {showComments && (
          <div style={{ width: "350px", padding: "2rem", borderLeft: "1px solid #e5e7eb", maxHeight: "92vh", overflowY: "auto", background: "#fafaf8" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a1a", margin: 0 }}>Comments & Reviews (18)</h3>
              <button onClick={() => setShowComments(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            {/* Sample Comments */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#9ca3af", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", fontSize: "13px", color: "#1a1a1a", margin: "0 0 2px 0" }}>Ananya Sharma</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 6px 0" }}>2 days ago</p>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: "12px" }}>★</span>)}
                  </div>
                  <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.5" }}>This was so yummy and easy to make! I added some tofu and it turned out amazing.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#9ca3af", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", fontSize: "13px", color: "#1a1a1a", margin: "0 0 2px 0" }}>Rahul Verma</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 6px 0" }}>5 days ago</p>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
                    {[...Array(4)].map((_, i) => <span key={i} style={{ fontSize: "12px" }}>★</span>)}
                    <span style={{ fontSize: "12px", color: "#d1d5db" }}>☆</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.5" }}>Super tasty and healthy. Will make it again!</p>
                </div>
              </div>
            </div>

            {/* Add Review */}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
              <h4 style={{ fontWeight: "700", fontSize: "14px", color: "#1a1a1a", marginBottom: "1rem" }}>Add Your Review</h4>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.5rem" }}>Your Rating</p>
              <div style={{ display: "flex", gap: "4px", marginBottom: "1rem" }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: "18px", cursor: "pointer" }}>☆</span>)}
              </div>
              <textarea
                placeholder="Write your comment..."
                style={{ width: "100%", padding: "10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px", fontFamily: "inherit", resize: "vertical", minHeight: "80px", outline: "none" }}
              />
              <button style={{ width: "100%", marginTop: "10px", padding: "10px", background: "#7C9653", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
