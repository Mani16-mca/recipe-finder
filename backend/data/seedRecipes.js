const mongoose = require("mongoose");

const recipes = [
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760e6"),
    recipeId: 1, title: "Creamy Garlic Chicken", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=250&fit=crop",
    time: "25 min", cookingTime: 25, ingredients: 10, category: "Dinner", isVeg: false, author: "Chef Maria",
    description: "Tender chicken pieces cooked in a rich garlic cream sauce with cherry tomatoes and Parmesan.",
    ingredientsList: ["1 lb chicken breast, cubed","2 tbsp olive oil","4 garlic cloves, minced","1/2 cup heavy cream","1/2 cup chicken broth","1 cup cherry tomatoes","1/4 cup Parmesan, grated","1 tsp Italian herbs","Salt & pepper","Fresh basil to garnish"],
    steps: ["Season chicken with salt, pepper, and Italian herbs.","Heat olive oil in a skillet. Sear chicken until golden, then remove.","Sauté garlic 1 min. Add broth and cream, simmer 3 min.","Add tomatoes and Parmesan. Stir until sauce thickens.","Return chicken, coat in sauce. Garnish with basil and serve."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760e7"),
    recipeId: 2, title: "Veggie Stir-Fry", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=250&fit=crop",
    time: "20 min", cookingTime: 20, ingredients: 11, category: "Vegetarian", isVeg: true, author: "Chef David",
    description: "A colorful mix of fresh vegetables tossed in a savory soy-sesame sauce over high heat. Ready in 20 minutes and packed with nutrients.",
    ingredientsList: ["1 cup broccoli florets","1 carrot, julienned","1 cup mushrooms","3 garlic cloves","1 tsp fresh ginger","2 tbsp soy sauce","1 tbsp sesame oil","2 tbsp vegetable oil","1 tsp cornstarch","Spring onions & sesame seeds","Salt to taste"],
    steps: ["Mix soy sauce, sesame oil, and cornstarch. Set aside.","Heat vegetable oil in a wok over high heat.","Add garlic and ginger, stir 30 seconds.","Add broccoli and carrots, stir-fry 3 min. Add peppers and mushrooms, 2 more min.","Pour sauce over vegetables. Toss well. Garnish and serve."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760e8"),
    recipeId: 3, title: "Chocolate Chip Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=250&fit=crop",
    time: "30 min", cookingTime: 30, ingredients: 9, category: "Dessert", isVeg: true, author: "Baker Sarah",
    description: "Classic golden cookies with crispy edges and gooey chocolate centers.",
    ingredientsList: ["2 cups all-purpose flour","1 tsp baking soda","1/2 tsp salt","1 cup butter, softened","3/4 cup white sugar","3/4 cup brown sugar","2 large eggs","2 tsp vanilla extract","2 cups chocolate chips"],
    steps: ["Preheat oven to 375°F (190°C). Line baking sheet.","Whisk flour, baking soda, and salt together.","Beat butter and both sugars until fluffy. Add eggs and vanilla.","Fold in flour mixture, then chocolate chips.","Drop rounded spoonfuls on sheet. Bake 9-11 min until edges are golden."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760e9"),
    recipeId: 4, title: "Avocado Toast with Eggs", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=250&fit=crop",
    time: "15 min", cookingTime: 15, ingredients: 6, category: "Breakfast", isVeg: true, author: "Chef Alex",
    description: "Creamy smashed avocado on crispy sourdough topped with perfectly cooked eggs.",
    ingredientsList: ["2 slices sourdough bread","1 ripe avocado","2 eggs","1/2 lemon, juiced","Red pepper flakes","Salt & black pepper"],
    steps: ["Toast sourdough until golden and crispy.","Mash avocado with lemon juice, salt, and pepper.","Fry or poach eggs to your preference.","Spread avocado generously on toast. Top with egg.","Drizzle olive oil, sprinkle red pepper flakes."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760ea"),
    recipeId: 5, title: "Spaghetti Bolognese", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=250&fit=crop",
    time: "40 min", cookingTime: 40, ingredients: 10, category: "Dinner", isVeg: false, author: "Chef Antonio",
    description: "A rich, slow-simmered meat sauce over al dente spaghetti.",
    ingredientsList: ["400g spaghetti","500g ground beef","1 large onion, diced","3 garlic cloves, minced","400g canned crushed tomatoes","2 tbsp tomato paste","1 tsp dried oregano","1 tsp dried basil","Salt & pepper","Parmesan to serve"],
    steps: ["Cook spaghetti in salted water per package instructions.","Brown ground beef in a large pan. Drain excess fat.","Add onion and garlic, cook 3-4 min until soft.","Stir in tomato paste, crushed tomatoes, oregano, and basil. Simmer 20 min.","Season with salt and pepper. Serve over pasta with Parmesan."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760eb"),
    recipeId: 6, title: "Chicken Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop",
    time: "25 min", cookingTime: 25, ingredients: 10, category: "Quick & Easy", isVeg: false, author: "Chef Rosa",
    description: "Juicy grilled chicken thighs seasoned with cumin and chili, served in warm tortillas.",
    ingredientsList: ["500g chicken thighs","8 small corn tortillas","1 lime, juiced","1 tsp ground cumin","1 tsp chili powder","1/2 tsp garlic powder","Salsa","Sour cream","Cheddar cheese, shredded","Fresh cilantro"],
    steps: ["Mix cumin, chili, garlic powder, lime juice, salt. Marinate chicken 15 min.","Grill or pan-fry chicken 6-7 min per side until cooked through.","Rest 5 min, then slice thinly.","Warm tortillas in a dry pan.","Fill tortillas with chicken, salsa, cheese, sour cream, and cilantro."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760ec"),
    recipeId: 7, title: "Caprese Salad", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=250&fit=crop",
    time: "10 min", ingredients: 11, category: "Healthy", isVeg: true,
    description: "A simple Italian classic with fresh tomatoes, creamy mozzarella, and fragrant basil.",
    ingredientsList: ["3 large ripe tomatoes","200g fresh mozzarella","Fresh basil leaves","3 tbsp extra virgin olive oil","1 tbsp balsamic glaze","Flaky sea salt","Freshly cracked black pepper","1 tsp dried oregano","Crusty bread to serve","Garlic clove","Lemon zest"],
    steps: ["Slice tomatoes and mozzarella into even 1cm rounds.","Alternate tomato and mozzarella slices on a serving plate.","Tuck fresh basil leaves between each slice.","Drizzle generously with olive oil and balsamic glaze.","Season with sea salt and black pepper. Serve immediately."]
  },
  {
    _id: new mongoose.Types.ObjectId("69d376fc92679e1b2e1760ed"),
    recipeId: 8, title: "Blueberry Muffins", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=250&fit=crop",
    time: "35 min", ingredients: 9, category: "Breakfast", isVeg: true,
    description: "Fluffy, golden muffins bursting with juicy blueberries.",
    ingredientsList: ["2 cups all-purpose flour","2 tsp baking powder","1/2 cup granulated sugar","1/2 tsp salt","1 large egg","1 cup whole milk","1/3 cup melted butter","1 tsp vanilla extract","1.5 cups fresh blueberries"],
    steps: ["Preheat oven to 400°F (200°C). Line a 12-cup muffin tin.","Whisk flour, baking powder, sugar, and salt in a large bowl.","In another bowl, whisk egg, milk, melted butter, and vanilla.","Pour wet ingredients into dry. Stir until just combined.","Fold in blueberries. Fill cups 3/4 full. Bake 18-20 min until golden."]
  },
  {
    recipeId: 9, title: "Mushroom Risotto", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=250&fit=crop",
    time: "35 min", ingredients: 8, category: "Vegetarian", isVeg: true,
    description: "Creamy Italian risotto loaded with earthy mushrooms and finished with Parmesan.",
    ingredientsList: ["1.5 cups Arborio rice","3 cups vegetable broth","2 cups mixed mushrooms, sliced","1 onion, finely diced","3 garlic cloves, minced","1/2 cup white wine","1/2 cup Parmesan, grated","2 tbsp butter"],
    steps: ["Heat broth in a saucepan and keep warm.","Sauté onion and garlic in butter until soft. Add mushrooms, cook 5 min.","Add rice, stir 2 min. Pour in wine and stir until absorbed.","Add broth one ladle at a time, stirring constantly until absorbed each time.","Remove from heat, stir in Parmesan. Season and serve immediately."]
  },
  {
    recipeId: 10, title: "Greek Salad", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop",
    time: "10 min", ingredients: 7, category: "Healthy", isVeg: true,
    description: "A refreshing Mediterranean salad with crisp vegetables, olives, and creamy feta.",
    ingredientsList: ["3 large tomatoes, chopped","1 cucumber, sliced","1/2 red onion, thinly sliced","1 cup Kalamata olives","200g feta cheese, cubed","3 tbsp olive oil","1 tsp dried oregano"],
    steps: ["Chop tomatoes, cucumber, and red onion into bite-sized pieces.","Combine vegetables in a large bowl with olives.","Add feta cheese on top.","Drizzle with olive oil and sprinkle oregano.","Toss gently and serve immediately."]
  },
  {
    recipeId: 11, title: "Beef Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=250&fit=crop",
    time: "20 min", ingredients: 9, category: "Quick & Easy", isVeg: false,
    description: "Seasoned ground beef in crispy taco shells loaded with fresh toppings.",
    ingredientsList: ["500g ground beef","8 taco shells","1 tsp cumin","1 tsp chili powder","1/2 tsp garlic powder","Shredded lettuce","Diced tomatoes","Cheddar cheese, shredded","Sour cream"],
    steps: ["Brown ground beef in a skillet over medium-high heat. Drain fat.","Add cumin, chili powder, garlic powder, and salt. Stir well.","Simmer 5 min with a splash of water.","Warm taco shells in oven for 3 min.","Fill shells with beef and top with lettuce, tomato, cheese, and sour cream."]
  },
  {
    recipeId: 12, title: "Pad Thai", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=250&fit=crop",
    time: "30 min", ingredients: 12, category: "Dinner", isVeg: false,
    description: "Classic Thai stir-fried noodles with shrimp, eggs, and a tangy tamarind sauce.",
    ingredientsList: ["200g rice noodles","200g shrimp, peeled","2 eggs","3 tbsp fish sauce","2 tbsp tamarind paste","1 tbsp sugar","2 garlic cloves, minced","2 tbsp vegetable oil","Bean sprouts","Spring onions","Crushed peanuts","Lime wedges"],
    steps: ["Soak rice noodles in warm water 20 min. Drain.","Mix fish sauce, tamarind paste, and sugar. Set aside.","Stir-fry garlic in oil 30 sec. Add shrimp, cook 2 min.","Push to side, scramble eggs in pan.","Add noodles and sauce, toss everything together. Top with sprouts, peanuts, and lime."]
  },
  {
    recipeId: 13, title: "Margherita Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=250&fit=crop",
    time: "45 min", ingredients: 7, category: "Vegetarian", isVeg: true,
    description: "Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil.",
    ingredientsList: ["1 pizza dough ball","1/2 cup San Marzano tomato sauce","200g fresh mozzarella, sliced","Fresh basil leaves","2 tbsp olive oil","Salt","1 tsp dried oregano"],
    steps: ["Preheat oven to 500°F (260°C) with a pizza stone inside.","Stretch dough into a 12-inch round on a floured surface.","Spread tomato sauce evenly, leaving a 1-inch border.","Arrange mozzarella slices on top. Drizzle with olive oil.","Bake 8-10 min until crust is golden. Top with fresh basil and serve."]
  },
  {
    recipeId: 14, title: "Caesar Salad", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=250&fit=crop",
    time: "15 min", ingredients: 6, category: "Healthy", isVeg: true,
    description: "Crisp romaine lettuce tossed in a creamy Caesar dressing with crunchy croutons.",
    ingredientsList: ["1 large romaine lettuce, chopped","1/2 cup Caesar dressing","1 cup croutons","1/2 cup Parmesan, shaved","1 lemon, juiced","Black pepper"],
    steps: ["Wash and chop romaine lettuce into bite-sized pieces.","Toss lettuce with Caesar dressing until well coated.","Add croutons and shaved Parmesan.","Squeeze lemon juice over the top.","Season with black pepper and serve immediately."]
  },
  {
    recipeId: 15, title: "Lemon Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=250&fit=crop",
    time: "18 min", ingredients: 7, category: "Quick & Easy", isVeg: true,
    description: "Bright and zesty pasta tossed with lemon, olive oil, garlic, and Parmesan.",
    ingredientsList: ["400g spaghetti","3 tbsp olive oil","3 garlic cloves, minced","2 lemons, zested and juiced","1/2 cup Parmesan, grated","Fresh parsley","Salt & black pepper"],
    steps: ["Cook spaghetti in salted boiling water until al dente. Reserve 1 cup pasta water.","Heat olive oil in a pan, sauté garlic 1 min.","Add lemon zest and juice, stir.","Toss in drained pasta with a splash of pasta water.","Remove from heat, add Parmesan and parsley. Season and serve."]
  },
  {
    recipeId: 16, title: "Butter Chicken", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=250&fit=crop",
    time: "50 min", ingredients: 14, category: "Dinner", isVeg: false,
    description: "Tender chicken in a velvety, mildly spiced tomato-butter sauce — a beloved Indian classic.",
    ingredientsList: ["700g chicken thighs, cubed","1 cup plain yogurt","2 tsp garam masala","1 tsp turmeric","1 tsp cumin","3 tbsp butter","1 large onion, diced","4 garlic cloves","1 tbsp fresh ginger","400g crushed tomatoes","1/2 cup heavy cream","1 tsp sugar","Salt","Fresh cilantro"],
    steps: ["Marinate chicken in yogurt, garam masala, turmeric, and cumin for 30 min.","Grill or pan-fry chicken until charred. Set aside.","Melt butter, sauté onion, garlic, and ginger until golden.","Add crushed tomatoes, simmer 15 min. Blend sauce until smooth.","Return chicken to sauce, add cream and sugar. Simmer 10 min. Garnish with cilantro."]
  },
  {
    recipeId: 17, title: "Pancakes with Berries", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop",
    time: "20 min", ingredients: 8, category: "Breakfast", isVeg: true,
    description: "Fluffy golden pancakes stacked high and topped with fresh mixed berries and maple syrup.",
    ingredientsList: ["1.5 cups all-purpose flour","2 tsp baking powder","2 tbsp sugar","1/2 tsp salt","1 cup milk","1 egg","2 tbsp melted butter","1 cup mixed berries"],
    steps: ["Whisk flour, baking powder, sugar, and salt in a bowl.","In another bowl, mix milk, egg, and melted butter.","Combine wet and dry ingredients. Do not overmix — lumps are fine.","Heat a non-stick pan over medium heat. Pour 1/4 cup batter per pancake.","Cook until bubbles form, flip and cook 1 more min. Serve with berries and maple syrup."]
  },
  {
    recipeId: 18, title: "Grilled Salmon", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=250&fit=crop",
    time: "25 min", ingredients: 6, category: "Healthy", isVeg: false,
    description: "Perfectly grilled salmon fillets with a lemon-herb marinade, crispy on the outside and tender inside.",
    ingredientsList: ["4 salmon fillets","2 tbsp olive oil","2 lemons, juiced","2 garlic cloves, minced","1 tsp dried dill","Salt & black pepper"],
    steps: ["Mix olive oil, lemon juice, garlic, dill, salt, and pepper.","Coat salmon fillets in marinade. Rest 10 min.","Preheat grill or grill pan to medium-high heat.","Grill salmon 4-5 min per side until cooked through.","Serve with lemon wedges and your choice of sides."]
  },
  {
    recipeId: 19, title: "Tiramisu", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=250&fit=crop",
    time: "40 min", ingredients: 10, category: "Dessert", isVeg: true,
    description: "The iconic Italian dessert — espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.",
    ingredientsList: ["300g ladyfinger biscuits","500g mascarpone cheese","4 eggs, separated","100g sugar","1 cup strong espresso, cooled","3 tbsp coffee liqueur","Cocoa powder for dusting","1 tsp vanilla extract","Pinch of salt","Dark chocolate shavings"],
    steps: ["Beat egg yolks with sugar until pale. Fold in mascarpone and vanilla.","Whip egg whites with salt to stiff peaks. Fold into mascarpone mixture.","Mix espresso and coffee liqueur in a shallow bowl.","Dip ladyfingers briefly in espresso and layer in a dish.","Spread mascarpone cream over ladyfingers. Repeat layers. Dust with cocoa. Chill 4 hours."]
  },
  {
    recipeId: 20, title: "Spinach Omelette", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=250&fit=crop",
    time: "10 min", ingredients: 5, category: "Breakfast", isVeg: true,
    description: "A light and fluffy omelette packed with fresh spinach and melted cheese.",
    ingredientsList: ["3 large eggs","1 cup fresh spinach","1/4 cup cheddar cheese, shredded","1 tbsp butter","Salt & pepper"],
    steps: ["Whisk eggs with salt and pepper until frothy.","Melt butter in a non-stick pan over medium heat.","Add spinach and wilt for 1 min.","Pour in eggs. Cook until edges set, then fold omelette in half.","Sprinkle cheese inside before folding. Serve immediately."]
  },
  {
    recipeId: 21, title: "Shrimp Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop",
    time: "25 min", ingredients: 11, category: "Quick & Easy", isVeg: false,
    description: "Restaurant-style fried rice with juicy shrimp, vegetables, and a savory soy-sesame sauce.",
    ingredientsList: ["3 cups cooked rice (day-old)","300g shrimp, peeled","2 eggs","1 cup frozen peas and carrots","3 garlic cloves, minced","3 tbsp soy sauce","1 tbsp sesame oil","2 tbsp vegetable oil","Spring onions","Salt & pepper","Sesame seeds"],
    steps: ["Heat oil in a wok over high heat. Stir-fry shrimp 2 min. Remove.","Add garlic, peas, and carrots. Stir-fry 2 min.","Push to side, scramble eggs in the pan.","Add rice, soy sauce, and sesame oil. Toss everything together.","Return shrimp, mix well. Garnish with spring onions and sesame seeds."]
  },
  {
    recipeId: 22, title: "Veggie Burger", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=250&fit=crop",
    time: "30 min", ingredients: 10, category: "Vegetarian", isVeg: true,
    description: "Hearty and satisfying plant-based burger patties made with black beans and spices.",
    ingredientsList: ["1 can black beans, drained","1/2 cup breadcrumbs","1 egg","1 tsp cumin","1 tsp smoked paprika","Salt & pepper","4 burger buns","Lettuce, tomato, onion","Avocado slices","Ketchup or mayo"],
    steps: ["Mash black beans in a bowl until mostly smooth.","Mix in breadcrumbs, egg, cumin, paprika, salt, and pepper.","Form into 4 patties. Chill 10 min.","Cook patties in a lightly oiled pan 4 min per side until crispy.","Assemble burgers with buns, lettuce, tomato, avocado, and condiments."]
  },
  {
    recipeId: 23, title: "Mango Smoothie Bowl", image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=250&fit=crop",
    time: "10 min", ingredients: 6, category: "Healthy", isVeg: true,
    description: "A thick, vibrant mango smoothie bowl topped with granola, fresh fruit, and coconut flakes.",
    ingredientsList: ["2 cups frozen mango chunks","1/2 cup coconut milk","1 banana","Granola","Fresh berries","Coconut flakes"],
    steps: ["Blend frozen mango, banana, and coconut milk until thick and smooth.","Pour into a bowl.","Top with granola, fresh berries, and coconut flakes.","Add a drizzle of honey if desired.","Serve immediately."]
  },
  {
    recipeId: 24, title: "Cheesecake", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=250&fit=crop",
    time: "60 min", ingredients: 12, category: "Dessert", isVeg: true,
    description: "Rich and creamy New York-style cheesecake with a buttery graham cracker crust.",
    ingredientsList: ["2 cups graham cracker crumbs","1/2 cup melted butter","3 tbsp sugar (crust)","900g cream cheese, softened","1 cup sugar","3 large eggs","1 cup sour cream","2 tsp vanilla extract","2 tbsp all-purpose flour","Zest of 1 lemon","Pinch of salt","Fresh berries to serve"],
    steps: ["Preheat oven to 325°F (160°C). Mix crumbs, butter, and sugar. Press into a 9-inch springform pan.","Beat cream cheese and sugar until smooth. Add eggs one at a time.","Mix in sour cream, vanilla, flour, lemon zest, and salt.","Pour filling over crust. Bake 55-60 min until center is just set.","Cool completely, then refrigerate 4 hours. Serve with fresh berries."]
  },
];

module.exports = recipes;
