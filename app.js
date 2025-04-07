let recipes = [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        recipes = data.recettes; // Accéder à la liste des recettes
        displayRandomRecipes();
        setupSearch();
    })
    .catch(error => console.error('Erreur lors du chargement des recettes:', error));

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
                <h5 class="card-title">${recipe.nom}</h5>
                <button class="btn btn-primary" onclick="showRecipe(${recipes.indexOf(recipe)})">Voir la recette</button>
                <button class="btn btn-warning" onclick="toggleFavorite(${recipes.indexOf(recipe)})" id="fav-${recipes.indexOf(recipe)}">${isFavorite(recipes.indexOf(recipe)) ? 'Retirer des Favoris' : 'Ajouter aux Favoris'}</button>
            </div>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

// Fonction pour afficher les détails de la recette dans la modal
function showRecipe(recipeId) {
    const recipe = recipes[recipeId];
    const modalBody = document.getElementById('modal-body');

    // Créer le contenu de la modal
    modalBody.innerHTML = `
        <h2>${recipe.nom}</h2>
        <p><strong>Catégorie:</strong> ${recipe.categorie}</p>
        <p><strong>Temps de préparation:</strong> ${recipe.temps_preparation}</p>
        <h3>Ingrédients:</h3>
        <ul>
            ${recipe.ingredients.map(ingredient => `<li>${ingredient.quantite} ${ingredient.nom}</li>`).join('')}
        </ul>
        <h3>Étapes:</h3>
        <ol>
            ${recipe.etapes.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <button class="btn btn-warning" onclick="toggleFavorite(${recipeId})">
            ${isFavorite(recipeId) ? 'Retirer des Favoris' : 'Ajouter aux Favoris'}
        </button>
    `;

    // Afficher la modal
    document.getElementById('recipeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// Fonction pour vérifier si une recette est dans les favoris
function isFavorite(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(recipeId);
}

// Fonction pour gérer l'ajout/suppression des favoris
function toggleFavorite(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const button = document.getElementById(`fav-${recipeId}`);

    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
        button.innerText = "Ajouter aux Favoris";
        alert("Recette supprimée des favoris !");
    } else {
        favorites.push(recipeId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        button.innerText = "Retirer des Favoris";
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
            const filteredRecipes = recipes.filter(recipe => recipe.nom.toLowerCase().includes(query));
            filteredRecipes.forEach(recipe => {
                const suggestionItem = document.createElement('li');
                suggestionItem.className = 'list-group-item';
                suggestionItem.innerText = recipe.nom;
                suggestionItem.onclick = () => {
                    window.location.href = `recette.html?id=${recipes.indexOf(recipe)}`;
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