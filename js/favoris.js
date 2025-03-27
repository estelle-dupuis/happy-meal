let recipes = [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        recipes = data.recettes; // Accéder à la liste des recettes
        displayFavorites();
    })
    .catch(error => console.error('Erreur lors du chargement des recettes:', error));

// Fonction pour afficher les recettes favorites
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Aucune recette favorite.</p>';
        return;
    }

    favorites.forEach(favoriteId => {
        const recipe = recipes[favoriteId];
        if (recipe) {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'card mt-3';
            recipeDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${recipe.nom}</h5>
                    <button class="btn btn-primary" onclick="showRecipe(${favoriteId})">Voir la recette</button>
                    <button class="btn btn-danger" onclick="removeFromFavorites(${favoriteId})">Retirer des Favoris</button>
                </div>
            `;
            favoritesList.appendChild(recipeDiv);
        }
    });
}

// Fonction pour retirer une recette des favoris
function removeFromFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Fonction pour afficher les détails de la recette dans une modal
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
            ${recipe.etapes.map(etape => `<li>${etape}</li>`).join('')}
        </ol>
    `;

    // Afficher la modal
    document.getElementById('recipeModal').style.display = 'block';
}

// Fonction pour fermer la modal
function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}