document.addEventListener('DOMContentLoaded', () => {
    displayShoppingList();
});

// Fonction pour afficher la liste de courses
function displayShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const shoppingListElement = document.getElementById('shopping-list');
    shoppingListElement.innerHTML = '';

    if (shoppingList.length === 0) {
        shoppingListElement.innerHTML = '<li class="list-group-item">Aucun ingrédient dans la liste de courses.</li>';
        return;
    }

    shoppingList.forEach(ingredient => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerText = `${ingredient.quantite} ${ingredient.nom}`; // Affiche la quantité et le nom de l'ingrédient
        const removeButton = document.createElement('button');
        removeButton.innerText = "Supprimer";
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.onclick = () => removeFromShoppingList(ingredient);
        li.appendChild(removeButton);
        shoppingListElement.appendChild(li);
    });
}

// Fonction pour retirer un ingrédient de la liste de courses
function removeFromShoppingList(ingredientToRemove) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList = shoppingList.filter(ingredient => 
        ingredient.nom !== ingredientToRemove.nom || ingredient.quantite !== ingredientToRemove.quantite
    );
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    displayShoppingList();
}

// Fonction pour générer un fichier de la liste de courses
document.getElementById('generate-file').onclick = function() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const blob = new Blob([shoppingList.map(item => `${item.quantite} ${item.nom}`).join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liste_de_courses.txt';
    link.click();
};

// Fonction pour supprimer la liste de courses
document.getElementById('clear-list').onclick = function() {
    localStorage.removeItem('shoppingList');
    displayShoppingList();
};

// Fonction pour ajouter les ingrédients du planning à la liste de courses
document.getElementById('add-planning-ingredients').onclick = function() {
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

    // Parcourir chaque jour du planning
    for (const day in mealPlan) {
        const appetizerName = mealPlan[day].appetizer;
        const mainName = mealPlan[day].main;
        const dessertName = mealPlan[day].dessert;

        // Ajouter les ingrédients de l'entrée
        if (appetizerName) {
            const appetizerRecipe = findRecipeByName(appetizerName);
            if (appetizerRecipe) {
                appetizerRecipe.ingredients.forEach(ingredient => {
                    shoppingList.push({ nom: ingredient.nom, quantite: ingredient.quantite });
                });
            }
        }

        // Ajouter les ingrédients du plat principal
        if (mainName) {
            const mainRecipe = findRecipeByName(mainName);
            if (mainRecipe) {
                mainRecipe.ingredients.forEach(ingredient => {
                    shoppingList.push({ nom: ingredient.nom, quantite: ingredient.quantite });
                });
            }
        }

        // Ajouter les ingrédients du dessert
        if (dessertName) {
            const dessertRecipe = findRecipeByName(dessertName);
            if (dessertRecipe) {
                dessertRecipe.ingredients.forEach(ingredient => {
                    shoppingList.push({ nom: ingredient.nom, quantite: ingredient.quantite });
                });
            }
        }
    }

    // Enregistrer la liste de courses dans le localStorage
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    alert('Tous les ingrédients du planning ont été ajoutés à la liste de courses !');
    displayShoppingList();
};

// Fonction pour trouver une recette par son nom
function findRecipeByName(name) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    return recipes.find(recipe => recipe.nom === name);
}

// Afficher la liste de courses au chargement de la page
displayShoppingList();