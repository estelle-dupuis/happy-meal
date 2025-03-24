let recipes = [];

// Charger les recettes depuis le fichier JSON
fetch('data/recette.json')
    .then(response => response.json())
    .then(data => {
        recipes = data;
        populateMealPlanner();
    });

function populateMealPlanner() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        const select = document.getElementById(day);
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.id;
            option.innerText = recipe.name;
            select.appendChild(option);
        });
    });

    loadSavedPlan();
}

function loadSavedPlan() {
    const savedPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    for (const day in savedPlan) {
        const select = document.getElementById(day);
        if (savedPlan[day]) {
            select.value = savedPlan[day];
        }
    }
}

document.getElementById('save-planner').onclick = function() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealPlan = {};
    days.forEach(day => {
        const select = document.getElementById(day);
        mealPlan[day] = select.value;
    });
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    alert("Planning des repas sauvegardé !");
};