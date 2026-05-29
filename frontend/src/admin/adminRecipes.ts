export interface AdminRecipe {
  id: number;
  title: string;
  image: string;
  time: string;
  ingredients: number;
  category: string;
  isVeg: boolean;
  description: string;
}

export const initialRecipes: AdminRecipe[] = [
  { id: 1, title: "Creamy Garlic Chicken", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=250&fit=crop", time: "25 min", ingredients: 10, category: "Dinner", isVeg: false, description: "Tender chicken in a rich garlic cream sauce." },
  { id: 2, title: "Veggie Stir-Fry", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=250&fit=crop", time: "20 min", ingredients: 12, category: "Vegetarian", isVeg: true, description: "Colorful vegetables in a savory soy-sesame sauce." },
  { id: 3, title: "Chocolate Chip Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=250&fit=crop", time: "30 min", ingredients: 9, category: "Dessert", isVeg: true, description: "Classic golden cookies with gooey chocolate centers." },
  { id: 4, title: "Avocado Toast with Eggs", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=250&fit=crop", time: "15 min", ingredients: 6, category: "Breakfast", isVeg: true, description: "Creamy avocado on crispy sourdough with eggs." },
  { id: 5, title: "Spaghetti Bolognese", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=250&fit=crop", time: "40 min", ingredients: 10, category: "Dinner", isVeg: false, description: "Rich slow-simmered meat sauce over al dente spaghetti." },
  { id: 6, title: "Chicken Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop", time: "25 min", ingredients: 10, category: "Quick & Easy", isVeg: false, description: "Juicy grilled chicken in warm tortillas with fresh toppings." },
  { id: 7, title: "Caprese Salad", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=250&fit=crop", time: "10 min", ingredients: 10, category: "Healthy", isVeg: true, description: "Fresh tomatoes, mozzarella, and basil with balsamic glaze." },
  { id: 8, title: "Blueberry Muffins", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=250&fit=crop", time: "35 min", ingredients: 9, category: "Breakfast", isVeg: true, description: "Fluffy golden muffins bursting with juicy blueberries." },
];
