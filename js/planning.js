let recipes = {
    entrees: [],
    plats_principaux: [],
    desserts: []
};

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        // Organiser les recettes par catégorie
        data.recettes.forEach(recipe => {
            if (recipe.categorie === "Entrée") {
                recipes.entrees.push(recipe);
            } else if (recipe.categorie === "Plat principal") {
                recipes.plats_principaux.push(recipe);
            } else if (recipe.categorie === "Dessert") {
                recipes.desserts.push(recipe);
            }
        });
        populateMealPlanner();
        loadSavedLists(); // Charger les listes de repas enregistrées
    })
    .catch(error => console.error('Erreur lors du chargement des recettes:', error));

function populateMealPlanner() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const appetizerSelect = document.getElementById(day + '-appetizer');
        const mainSelect = document.getElementById(day + '-main');
        const dessertSelect = document.getElementById(day + '-dessert');

        // Remplir les sélecteurs avec les recettes
        recipes.entrees.forEach(recipe => {
            appetizerSelect.appendChild(createOption(recipe.nom, recipe.nom));
        });
        recipes.plats_principaux.forEach(recipe => {
            mainSelect.appendChild(createOption(recipe.nom, recipe.nom));
        });
        recipes.desserts.forEach(recipe => {
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
            $('#mealPlanModal').modal('show'); // Afficher la modale
        };
        listDiv.appendChild(viewButton);
        
        const addButton = document.createElement('button');
        addButton.innerText = "Ajouter Ingrédients";
        addButton.className = "btn btn-primary btn-sm";
        addButton.style.display = "none"; // Cacher le bouton par défaut
        addButton.onclick = () => addIngredientsToShoppingList(savedLists[listName]);
        listDiv.appendChild(addButton);
        
        savedListsContainer.appendChild(listDiv);
    }
}

// Fonction pour afficher le planning d'une liste dans la modale
function displayMealPlan(mealPlan) {
    const modalBody = document.getElementById('modal-meal-plan-body');
    modalBody.innerHTML = ''; // Réinitialiser le contenu de la modale

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.innerText = day.charAt(0).toUpperCase() + day.slice(1); // Mettre la première lettre en majuscule
        row.appendChild(dayCell);

        const appetizerCell = document.createElement('td');
        appetizerCell.innerText = mealPlan[day]?.appetizer || 'Aucune';
        row.appendChild(appetizerCell);

        const mainCell = document.createElement('td');
        mainCell.innerText = mealPlan[day]?.main || 'Aucun';
        row.appendChild(mainCell);

        const dessertCell = document.createElement('td');
        dessertCell.innerText = mealPlan[day]?.dessert || 'Aucun';
        row.appendChild(dessertCell);

        modalBody.appendChild(row);
    });

    // Afficher le bouton "Ajouter Ingrédients"
    document.getElementById('add-ingredients-button').onclick = () => addIngredientsToShoppingList(mealPlan);
    document.getElementById('add-ingredients-button').style.display = "inline-block"; // Rendre le bouton visible
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
                    shoppingList.push({ nom: ingredient.nom, quantite: ingredient.quantite });
                });
            }
        }

        // Ajouter les ingrédients du plat principal
        if (meal.main) {
            const mainRecipe = findRecipeByName(meal.main);
            if (mainRecipe) {
                mainRecipe.ingredients.forEach(ingredient => {
                    shoppingList.push({ nom: ingredient.nom, quantite: ingredient.quantite });
                });
            }
        }

        // Ajouter les ingrédients du dessert
        if (meal.dessert) {
            const dessertRecipe = findRecipeByName(meal.dessert);
            if (dessertRecipe) {
                dessertRecipe.ingredients.forEach(ingredient => {
                    shoppingList.push({ nom: ingredient.nom, quantite: ingredient.quantite });
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
    return [...recipes.entrees, ...recipes.plats_principaux, ...recipes.desserts].find(recipe => recipe.nom === name);
}

// Fonction pour choisir des repas aléatoires
document.getElementById('randomize-meals').onclick = function() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const appetizerSelect = document.getElementById(day + '-appetizer');
        const mainSelect = document.getElementById(day + '-main');
        const dessertSelect = document.getElementById(day + '-dessert');

        // Choisir un repas aléatoire pour chaque type
        appetizerSelect.value = getRandomRecipe(recipes.entrees).nom;
        mainSelect.value = getRandomRecipe(recipes.plats_principaux).nom;
        dessertSelect.value = getRandomRecipe(recipes.desserts).nom;
    });
};

// Fonction pour obtenir une recette aléatoire
function getRandomRecipe(recipesArray) {
    const randomIndex = Math.floor(Math.random() * recipesArray.length);
    return recipesArray[randomIndex];
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
    loadSavedPlan();
    loadSavedLists(); // Charger les listes de repas enregistrées lors du chargement de la page
};