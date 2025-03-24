let recipes = [
    {
        "id": 1,
        "name": "Pasta Carbonara",
        "ingredients": ["Pasta", "Eggs", "Parmesan cheese", "Bacon", "Black pepper"],
        "duration": "20 minutes",
        "steps": ["Boil pasta", "Fry bacon", "Mix eggs and cheese", "Combine all"]
    },
    {
        "id": 2,
        "name": "Chicken Curry",
        "ingredients": ["Chicken", "Curry powder", "Coconut milk", "Onion", "Rice"],
        "duration": "30 minutes",
        "steps": ["Cook chicken", "Add onion and curry", "Pour coconut milk", "Serve with rice"]
    }
];

// Fonction pour afficher les recettes aléatoires
function displayRandomRecipes() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    const randomRecipes = recipes.sort(() => 0.5 - Math.random()).slice(0, 3); // 3 recettes aléatoires

    randomRecipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'card mt-3';
        recipeDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${recipe.name}</h5>
                <button class="btn btn-primary" onclick="showRecipe(${recipe.id})">Voir la recette</button>
                <button class="btn btn-warning" onclick="toggleFavorite(${recipe.id})" id="fav-${recipe.id}">Ajouter aux Favoris</button>
            </div>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

// Fonction pour gérer l'ajout/suppression des favoris
function toggleFavorite(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const button = document.getElementById(`fav-${recipeId}`);

    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
        button.innerText = "Ajouter aux Favoris";
        button.classList.remove('btn-danger');
        button.classList.add('btn-warning');
        alert("Recette supprimée des favoris !");
    } else {
        favorites.push(recipeId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        button.innerText = "Retirer des Favoris";
        button.classList.remove('btn-warning');
        button.classList.add('btn-danger');
        alert("Recette ajoutée aux favoris !");
    }
}

// Fonction pour afficher les suggestions d'autocomplétion
function setupSearch() {
    document.getElementById('search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const suggestions = document.getElementById('suggestions');
        suggestions.innerHTML = '';
        
        if (query) {
            const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));
            filteredRecipes.forEach(recipe => {
                const suggestionItem = document.createElement('li');
                suggestionItem.className = 'list-group-item';
                suggestionItem.innerText = recipe.name;
                suggestionItem.onclick = () => {
                    window.location.href = `recipes.html?id=${recipe.id}`;
                };
                suggestions.appendChild(suggestionItem);
            });
            suggestions.style.display = filteredRecipes.length > 0 ? 'block' : 'none';
        } else {
            suggestions.style.display = 'none';
        }
    });
}

// Fonction pour afficher la page d'accueil
function init() {
    displayRandomRecipes();
    setupSearch();
}

// Initialiser l'application
init();