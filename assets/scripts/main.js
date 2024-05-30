// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
      recipes = await getRecipes();
  } catch (err) {
      console.error('Error fetching recipes:', err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
* Detects if there's a service worker, then loads it and begins the process
* of installing it and getting it running
*/
function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js').then((registration) => {
              console.log('Service worker registered:', registration);
          }).catch((error) => {
              console.error('Service worker registration failed:', error);
          });
      });
  } else {
      console.error('Service worker is not supported in this browser.');
  }
}

/**
* Reads 'recipes' from localStorage and returns an array of
* all of the recipes found (parsed, not in string form). If
* nothing is found in localStorage, network requests are made to all
* of the URLs in RECIPE_URLs, an array is made from those recipes, that
* array is saved to localStorage, and then the array is returned.
* @returns {Array<Object>} An array of recipes found in localStorage
*/
async function getRecipes() {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
      return JSON.parse(storedRecipes);
  }

  const fetchedRecipes = [];

  return new Promise(async (resolve, reject) => {
      for(let i = 0; i < RECIPE_URLS.length; i++) {
          try {
              const response = await fetch(url);
              const recipe = await response.json();
              fetchedRecipes.push(recipe);
              if (fetchedRecipes.length === RECIPE_URLS.length) {
                  resolve(fetchedRecipes);
              }
          } catch (error) {
              console.error('Error fetching recipe:', error);
              reject(error);
          }
      }
  });
}

/**
* Takes in an array of recipes, converts it to a string, and then
* saves that string to 'recipes' in localStorage
* @param {Array<Object>} recipes An array of recipes
*/
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
* Takes in an array of recipes and for each recipe creates a
* new <recipe-card> element, adds the recipe data to that card
* using element.data = {...}, and then appends that new recipe
* to <main>
* @param {Array<Object>} recipes An array of recipes
*/
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
      let recipeCard = document.createElement('recipe-card');
      recipeCard.data = recipe;
      main.append(recipeCard);
  });
}
