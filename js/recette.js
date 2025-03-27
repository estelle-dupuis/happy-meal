let recipes = [];
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des recettes');
        }
        return response.json();
    })
    .then(data => {
        recipes = data.recettes; // Accéder à la liste des recettes
        displayRecipeList(recipes); // Afficher la liste des recettes par défaut
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors du chargement des recettes. Veuillez réessayer.');
    });

// Fonction pour afficher la liste des recettes
function displayRecipeList(filteredRecipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Réinitialiser la liste des recettes

    filteredRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.innerText = recipe.nom; // Affiche le nom de la recette
        recipeElement.style.cursor = 'pointer'; // Change le curseur pour indiquer que c'est cliquable
        recipeElement.addEventListener('click', () => {
            displayRecipeDetails(recipe.nom); // Appelle la fonction pour afficher les détails
        });
        recipeList.appendChild(recipeElement); // Ajoute à la liste des recettes
    });
}

// Fonction pour afficher les détails de la recette
function displayRecipeDetails(recipeName) {
    const recipe = recipes.find(r => r.nom === recipeName); // Recherche la recette par nom
    const recipeDetails = document.getElementById('recipe-details'); // Assurez-vous d'avoir un élément avec cet ID

    if (recipe) {
        recipeDetails.innerHTML = `
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
            <button class="btn btn-warning" onclick="toggleFavorite(${recipes.indexOf(recipe)})">
                ${favorites.includes(recipes.indexOf(recipe)) ? 'Retirer des Favoris' : 'Ajouter aux Favoris'}
            </button>
        `;
    } else {
        recipeDetails.innerText = 'Recette non trouvée.';
    }
}

// Fonction pour basculer les favoris
function toggleFavorite(recipeId) {
    const button = document.querySelector(`#recipe-details .btn-warning`);
    
    if (favorites.includes(recipeId)) {
        // Supprimer des favoris
        const index = favorites.indexOf(recipeId);
        favorites.splice(index, 1);
        button.innerText = "Ajouter aux Favoris";
        alert("Recette supprimée des favoris !");
    } else {
        // Ajouter aux favoris
        favorites.push(recipeId);
        button.innerText = "Retirer des Favoris";
        alert("Recette ajoutée aux favoris !");
    }
    
    // Mettre à jour le stockage local
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Écouter les changements de sélection de catégorie
document.getElementById('category-select').addEventListener('change', function() {
    const selectedCategory = this.value;
    const filteredRecipes = selectedCategory === 'all' 
        ? recipes 
        : recipes.filter(recipe => recipe.categorie.toLowerCase() === selectedCategory.toLowerCase());
    
    displayRecipeList(filteredRecipes); // Afficher les recettes filtrées
});