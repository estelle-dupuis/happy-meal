let recipes = [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        recipes = data;
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('nom');
        displayRecipeDetails(recipeId);
    });

function displayRecipeDetails(id) {
    const recipe = recipes.find(r => r.id == id);
    if (recipe) {
        document.getElementById('nom').innerText = recipe.name;
        document.getElementById('add-to-favorites').onclick = () => addToFavorites(recipe.id);

        // Afficher les ingrédients
        const ingredientList = document.getElementById('ingredients');
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.innerText = ingredient;
            const addButton = document.createElement('button');
            addButton.innerText = "Ajouter à la liste de courses";
            addButton.className = "btn btn-sm btn-success ml-2";
            addButton.onclick = () => addToShoppingList(ingredient);
            li.appendChild(addButton);
            ingredientList.appendChild(li);
        });

        // Afficher les étapes
        const stepsList = document.getElementById('etapes');
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.innerText = step;
            stepsList.appendChild(li);
        });
    }
}

function addToFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favoris')) || [];
    if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem('favoris', JSON.stringify(favorites));
        alert("Recette ajoutée aux favoris !");
    } else {
        alert("Cette recette est déjà dans vos favoris !");
    }
}

function addToShoppingList(ingredient) {
    let shoppingList = JSON.parse(localStorage.getItem('course')) || [];
    if (!shoppingList.includes(ingredient)) {
        shoppingList.push(ingredient);
        localStorage.setItem('course', JSON.stringify(shoppingList));
        alert("Ingrédient ajouté à la liste de courses !");
    } else {
        alert("Cet ingrédient est déjà dans votre liste de courses !");
    }
}