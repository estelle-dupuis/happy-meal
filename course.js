document.addEventListener('DOMContentLoaded', () => {
    displayShoppingList();
});

// Fonction pour afficher la liste de courses
function displayShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const shoppingListElement = document.getElementById('shopping-list');
    shoppingListElement.innerHTML = '';

    const ingredientMap = {};

    shoppingList.forEach(ingredient => {
        if (ingredientMap[ingredient.nom]) {
            ingredientMap[ingredient.nom] += parseFloat(ingredient.quantite);
        } else {
            ingredientMap[ingredient.nom] = parseFloat(ingredient.quantite);
        }
    });

    for (const [nom, quantite] of Object.entries(ingredientMap)) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerText = `${quantite} ${nom}`;
        const removeButton = document.createElement('button');
        removeButton.innerText = "Supprimer";
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.onclick = () => removeFromShoppingList(nom);
        li.appendChild(removeButton);
        shoppingListElement.appendChild(li);
    }
}

// Fonction pour retirer un ingrédient de la liste de courses
function removeFromShoppingList(ingredientName) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList = shoppingList.filter(ingredient => ingredient.nom !== ingredientName);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    displayShoppingList();
}

// Fonction pour télécharger la liste en PDF
document.getElementById('generate-file').onclick = function() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const ingredientMap = {};

    shoppingList.forEach(ingredient => {
        if (ingredientMap[ingredient.nom]) {
            ingredientMap[ingredient.nom] += parseFloat(ingredient.quantite);
        } else {
            ingredientMap[ingredient.nom] = parseFloat(ingredient.quantite);
        }
    });

    let pdfContent = 'Liste de Courses\n\n';
    for (const [nom, quantite] of Object.entries(ingredientMap)) {
        pdfContent += `${quantite} ${nom}\n`;
    }

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liste_de_courses.pdf'; // Nom du fichier à télécharger
    document.body.appendChild(link);
    link.click(); // Simule un clic pour démarrer le téléchargement
    document.body.removeChild(link); // Supprime le lien après le téléchargement
};

// Fonction pour supprimer la liste de courses
document.getElementById('clear-list').onclick = function() {
    localStorage.removeItem('shoppingList');
    displayShoppingList();
};

// Fonction pour ajouter les ingrédients d'une recette à la liste de courses
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
    alert('Les ingrédients du planning ont été ajoutés à la liste de courses !');
}

// Fonction pour trouver une recette par son nom
function findRecipeByName(name) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    return recipes.find(recipe => recipe.nom === name);
}

// Afficher la liste de courses au chargement de la page
displayShoppingList();