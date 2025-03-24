let recipes = [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        recipes = data;
        displayFavorites();
    });

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Aucune recette favorite.</p>';
        return;
    }

    favorites.forEach(favoriteId => {
        const recipe = recipes.find(r => r.id == favoriteId);
        if (recipe) {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'card mt-3';
            recipeDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <a href="recette.html?id=${recipe.id}" class="btn btn-primary">Voir la recette</a>
                </div>
            `;
            favoritesList.appendChild(recipeDiv);
        }
    });
}