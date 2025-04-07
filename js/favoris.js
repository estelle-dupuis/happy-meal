let recipes = [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        recipes = data.recettes; // Charger les recettes dans la variable globale
        displayFavorites(); // Afficher les favoris après le chargement des recettes
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
        // Trouver la recette par ID
        const recipe = recipes.find(r => r.id === favoriteId);
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

// Fonction pour ajouter une recette aux favoris
function addToFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Recette ajoutée aux favoris !');
        displayFavorites();
    } else {
        alert('Cette recette est déjà dans vos favoris.');
    }
}

// Fonction pour retirer une recette des favoris
function removeFromFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Recette retirée des favoris.');
    displayFavorites();
}

// Fonction pour afficher les détails de la recette dans une modal
function showRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    const modalBody = document.getElementById('modal-body');

    if (!recipe) {
        modalBody.innerHTML = '<p>Recette introuvable.</p>';
        return;
    }

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

// Charger les favoris au démarrage
window.onload = function () {
    displayFavorites();
};

// Fonction pour gérer l'autocomplétion
function setupSearch() {
    document.getElementById('meal-search').addEventListener('input', function() {
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

function populateMealPlanner() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
        const appetizerSelect = document.getElementById(day + '-appetizer');
        const mainSelect = document.getElementById(day + '-main');
        const dessertSelect = document.getElementById(day + '-dessert');

        // Remplir les sélecteurs avec les recettes
        recipes.filter(recipe => recipe.categorie === "Entrée").forEach(recipe => {
            appetizerSelect.appendChild(createOption(recipe.nom, recipe.nom));
        });
        recipes.filter(recipe => recipe.categorie === "Plat principal").forEach(recipe => {
            mainSelect.appendChild(createOption(recipe.nom, recipe.nom));
        });
        recipes.filter(recipe => recipe.categorie === "Dessert").forEach(recipe => {
            dessertSelect.appendChild(createOption(recipe.nom, recipe.nom));
        });
    });
}

// Fonction pour créer une option dans le sélecteur
function createOption(text, value) {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = text;
    return option;
}

// Fonction pour sauvegarder le planning
document.getElementById('save-planner').onclick = function() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealPlan = {};
    days.forEach(day => {
        const appetizerSelect = document.getElementById(day + '-appetizer');
        const mainSelect = document.getElementById(day + '-main');
        const dessertSelect = document.getElementById(day + '-dessert');
        
        mealPlan[day] = {
            appetizer: appetizerSelect.value,
            main: mainSelect.value,
            dessert: dessertSelect.value
        };
    });

    // Demander un nom pour la liste
    const listName = prompt("Entrez un nom pour la liste de repas :");
    if (listName) {
        // Récupérer les listes existantes
        const savedLists = JSON.parse(localStorage.getItem('mealLists')) || {};
        savedLists[listName] = mealPlan; // Ajouter le nouveau planning
        localStorage.setItem('mealLists', JSON.stringify(savedLists)); // Sauvegarder les listes
        alert("Planning des repas sauvegardé sous le nom : " + listName);
        loadSavedLists(); // Recharger les listes
    }
};

// Fonction pour charger les listes de repas enregistrées
function loadSavedLists() {
    const savedLists = JSON.parse(localStorage.getItem('mealLists')) || {};
    const savedListsContainer = document.getElementById('saved-lists');
    savedListsContainer.innerHTML = '';

    for (const listName in savedLists) {
        const listDiv = document.createElement('div');
        listDiv.className = 'd-flex justify-content-between align-items-center mt-2';
        const listLabel = document.createElement('span');
        listLabel.innerText = listName;
        listDiv.appendChild(listLabel);
        
        const viewButton = document.createElement('button');
        viewButton.innerText = "Voir Planning";
        viewButton.className = "btn btn-info btn-sm";
        viewButton.onclick = () => {
            displayMealPlan(savedLists[listName]); // Afficher le planning de la liste sélectionnée
        };
        listDiv.appendChild(viewButton);
        
        const addButton = document.createElement('button');
        addButton.innerText = "Ajouter à la liste de courses";
        addButton.className = "btn btn-success btn-sm ml-2";
        addButton.onclick = () => {
            addIngredientsToShoppingList(savedLists[listName]); // Ajouter les ingrédients à la liste de courses
        };
        listDiv.appendChild(addButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Supprimer";
        deleteButton.className = "btn btn-danger btn-sm ml-2";
        deleteButton.onclick = () => {
            deleteMealPlan(listName); // Appeler la fonction de suppression
        };
        listDiv.appendChild(deleteButton);
        
        savedListsContainer.appendChild(listDiv);
    }
}

// Fonction pour afficher le planning d'une liste dans la section
function displayMealPlan(mealPlan) {
    const displayedMealPlan = document.getElementById('displayed-meal-plan');
    displayedMealPlan.innerHTML = ''; // Réinitialiser le contenu de la section

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // Créer un élément pour afficher le planning
    const planningText = document.createElement('div');
    planningText.className = 'mt-3 planning-text';

    days.forEach(day => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1); // Mettre la première lettre en majuscule
        const appetizer = mealPlan[day]?.appetizer || 'Aucune';
        const main = mealPlan[day]?.main || 'Aucun';
        const dessert = mealPlan[day]?.dessert || 'Aucun';

                // Ajouter le texte pour chaque jour
                planningText.innerHTML += `<strong>${dayName}:</strong><br>  - Entrée: ${appetizer},<br> - Plat Principal: ${main},<br> - Dessert: ${dessert}<br>`;
            });
        
            displayedMealPlan.appendChild(planningText);
        }
        
        // Fonction pour ajouter les ingrédients d'une recette enregistrée à la liste de courses
        function addIngredientsToShoppingList(mealPlan) {
            let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
        
            for (const day in mealPlan) {
                const meal = mealPlan[day];
        
                // Ajouter les ingrédients de l'entrée
                if (meal.appetizer) {
                    const appetizerRecipe = findRecipeByName(meal.appetizer);
                    if (appetizerRecipe) {
                        appetizerRecipe.ingredients.forEach(ingredient => {
                            const existingIngredient = shoppingList.find(item => item.nom === ingredient.nom);
                            if (existingIngredient) {
                                existingIngredient.quantite += parseFloat(ingredient.quantite); // Additionner les quantités
                            } else {
                                shoppingList.push({ nom: ingredient.nom, quantite: parseFloat(ingredient.quantite) });
                            }
                        });
                    }
                }
        
                // Ajouter les ingrédients du plat principal
                if (meal.main) {
                    const mainRecipe = findRecipeByName(meal.main);
                    if (mainRecipe) {
                        mainRecipe.ingredients.forEach(ingredient => {
                            const existingIngredient = shoppingList.find(item => item.nom === ingredient.nom);
                            if (existingIngredient) {
                                existingIngredient.quantite += parseFloat(ingredient.quantite); // Additionner les quantités
                            } else {
                                shoppingList.push({ nom: ingredient.nom, quantite: parseFloat(ingredient.quantite) });
                            }
                        });
                    }
                }
        
                // Ajouter les ingrédients du dessert
                if (meal.dessert) {
                    const dessertRecipe = findRecipeByName(meal.dessert);
                    if (dessertRecipe) {
                        dessertRecipe.ingredients.forEach(ingredient => {
                            const existingIngredient = shoppingList.find(item => item.nom === ingredient.nom);
                            if (existingIngredient) {
                                existingIngredient.quantite += parseFloat(ingredient.quantite); // Additionner les quantités
                            } else {
                                shoppingList.push({ nom: ingredient.nom, quantite: parseFloat(ingredient.quantite) });
                            }
                        });
                    }
                }
            }
        
            // Enregistrer la liste de courses dans le localStorage
            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
            alert('Les ingrédients de la liste de repas ont été ajoutés à la liste de courses !');
        }
        
        // Fonction pour trouver une recette par son nom
        function findRecipeByName(name) {
            return recipes.find(recipe => recipe.nom === name);
        }
        
        // Fonction pour choisir des repas aléatoires
        document.getElementById('randomize-meals').onclick = function() {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
            days.forEach(day => {
                const appetizerSelect = document.getElementById(day + '-appetizer');
                const mainSelect = document.getElementById(day + '-main');
                const dessertSelect = document.getElementById(day + '-dessert');
        
                // Choisir un repas aléatoire pour chaque type
                appetizerSelect.value = getRandomRecipe(recipes.filter(recipe => recipe.categorie === "Entrée")).nom;
                mainSelect.value = getRandomRecipe(recipes.filter(recipe => recipe.categorie === "Plat principal")).nom;
                dessertSelect.value = getRandomRecipe(recipes.filter(recipe => recipe.categorie === "Dessert")).nom;
            });
        };
        
        // Fonction pour obtenir une recette aléatoire
        function getRandomRecipe(recipesArray) {
            const randomIndex = Math.floor(Math.random() * recipesArray.length);
            return recipesArray[randomIndex];
        }
        
        // Fonction pour supprimer un planning
        function deleteMealPlan(listName) {
            const savedLists = JSON.parse(localStorage.getItem('mealLists')) || {};
            delete savedLists[listName]; // Supprimer le planning
        
            // Sauvegarder les listes mises à jour
            localStorage.setItem('mealLists', JSON.stringify(savedLists));
            alert(`Le planning "${listName}" a été supprimé.`);
            loadSavedLists(); // Recharger les listes après suppression
        }
        
        // Charger le planning sauvegardé au démarrage
        function loadSavedPlan() {
            const savedPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
            days.forEach(day => {
                const appetizerSelect = document.getElementById(day + '-appetizer');
                const mainSelect = document.getElementById(day + '-main');
                const dessertSelect = document.getElementById(day + '-dessert');
        
                if (savedPlan[day]) {
                    appetizerSelect.value = savedPlan[day].appetizer;
                    mainSelect.value = savedPlan[day].main;
                    dessertSelect.value = savedPlan[day].dessert;
                }
            });
        }
        
        // Charger le planning sauvegardé lors du chargement de la page
        window.onload = function() {
            populateMealPlanner();
            loadSavedLists(); // Charger les listes de repas enregistrées lors du chargement de la page
            loadSavedPlan(); // Charger le planning sauvegardé si disponible
        };