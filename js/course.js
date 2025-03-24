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
        li.innerText = ingredient;
        const removeButton = document.createElement('button');
        removeButton.innerText = "Supprimer";
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.onclick = () => removeFromShoppingList(ingredient);
        li.appendChild(removeButton);
        shoppingListElement.appendChild(li);
    });
}

function removeFromShoppingList(ingredient) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList = shoppingList.filter(item => item !== ingredient);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    displayShoppingList();
}

document.getElementById('generate-file').onclick = function() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const blob = new Blob([shoppingList.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liste_de_courses.txt';
    link.click();
};

document.getElementById('clear-list').onclick = function() {
    localStorage.removeItem('shoppingList');
    displayShoppingList();
};

// Afficher la liste de courses au chargement de la page
displayShoppingList();