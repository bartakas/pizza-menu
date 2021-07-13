let pizza = {};
const storageKey = 'pizzas';
let sortBy = 'pizzaname';

function pageload() {
    const sessionPizza = getPizzasFromStorage();
    const toppingsCount = 2;
    for (let i = 0; i < toppingsCount; i++) {
        createTopping(i);
    }
    if (sessionPizza) {
        showData();
    }
}

function pageToppings() {
    const list = document.getElementById('toppings-list');
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    let toppingsCount = document.getElementById('toppings-count').value;
    if (toppingsCount < 2) toppingsCount = 2;
    if (toppingsCount > 10) toppingsCount = 10;
    for (let i = 0; i < toppingsCount; i++) {
        createTopping(i);
    }
}

function storeHeat(pizzaHeat) {
    pizza.pizzaheat = parseInt(pizzaHeat, 10);
}

function storePhoto(pizzaPhoto) {
    pizza.pizzaphoto = pizzaPhoto;
}

function storeData(event) {
    const isValid = checkValidity();
    if (isValid) {
        const sessionPizza = getPizzasFromStorage();
        const pizzaName = document.getElementById('name').value;
        const pizzaPrice = parseFloat(document.getElementById('price').value);
        const toppingsCount = document.getElementById('toppings-count').value;
        const pizzaToppings = [];
        for (let i = 0; i < toppingsCount; i++) {
            const elementTopping = document.getElementById('topping' + (i + 1)).value;
            if (elementTopping)
                pizzaToppings[i] = elementTopping;
        }
        pizza.pizzatoppings = pizzaToppings.join(', ');
        pizza.pizzaname = pizzaName;
        pizza.pizzaprice = pizzaPrice;
        const pizzas = sessionPizza ? sessionPizza : [];
        pizzas.push({ ...pizza });;
        sessionStorage.setItem(storageKey, JSON.stringify(pizzas));
        showData();
        const formBox = document.getElementById('form-box');
        formBox.reset();
        pizza = {};
        pageToppings()
        event.preventDefault();
    }
}

function showData() {
    const sessionPizza = getPizzasFromStorage();
    sortPizza(sessionPizza);
    const pizzaMenu = document.getElementById('pizza-menu');
    while (pizzaMenu.hasChildNodes()) {
        pizzaMenu.removeChild(pizzaMenu.firstChild);
    }
    for (let i = 0; i < sessionPizza.length; i++) {
        const currentPizza = sessionPizza[i];
        const textPrice = document.createElement('div');
        const textButton = document.createElement('button');
        const elementLi = document.createElement('li');
        textPrice.textContent = 'Price: ' + currentPizza.pizzaprice.toFixed(2);
        textPrice.className = 'price';
        textButton.textContent = 'Delete';
        textButton.className = 'deletebutton';
        textButton.setAttribute('onClick', `removePizza(${i})`);
        elementLi.id = 'menu-pizza' + i;
        elementLi.className = 'item';
        pizzaMenu.appendChild(elementLi);
        if (currentPizza.pizzaname) {
            const textName = document.createElement('span');
            textName.textContent = currentPizza.pizzaname + ' ';
            elementLi.appendChild(textName);
        }
        if (currentPizza.pizzaheat) {
            const textHeat = document.createElement('span');
            const imgHeat = document.createElement('img');
            imgHeat.src = './img/pepper' + currentPizza.pizzaheat + '.png';
            textHeat.id = 'heatlevel' + i;
            textHeat.appendChild(imgHeat);
            elementLi.appendChild(textHeat);
        }
        elementLi.appendChild(textPrice);
        if (currentPizza.pizzaphoto) {
            const textPhoto = document.createElement('img');
            textPhoto.src = './img/pizza' + currentPizza.pizzaphoto + '.png';
            textPhoto.className = 'menuimage';
            elementLi.appendChild(textPhoto);
        }
        if (currentPizza.pizzatoppings) {
            const textToppings = document.createElement('div');
            textToppings.textContent = currentPizza.pizzatoppings;
            textToppings.className = 'toppings';
            elementLi.appendChild(textToppings);
        }
        elementLi.appendChild(textButton);
    }
}

function removePizza(id) {
    const sessionPizza = getPizzasFromStorage();
    if (confirm('Are you sure you want to remove ' + sessionPizza[id].pizzaname + ' pizza?')) {
        sessionPizza.splice(id, 1);
        sessionStorage.setItem(storageKey, JSON.stringify(sessionPizza));
        showData();
    }
}

function createTopping(i) {
    const textfield = document.createElement('input');
    const labelfield = document.createElement('label');
    const br = document.createElement('br');
    textfield.type = 'text';
    textfield.value = '';
    textfield.placeholder = 'Topping ' + (i + 1);
    textfield.id = 'topping' + (i + 1);
    textfield.className = 'pizza-input';
    textfield.minLength = "2";
    textfield.pattern = '[A-Za-z\s]+';
    textfield.required = true;
    labelfield.textContent = i + 1 + ' ';
    const list = document.getElementById('toppings-list');
    list.appendChild(labelfield);
    list.appendChild(textfield);
    list.appendChild(br);
}

function sortPizza(pizzas) {
    pizzas.sort((a, b) => {
        const first = sortBy === 'pizzaname' ? a[sortBy].toLowerCase() : a[sortBy];
        const second = sortBy === 'pizzaname' ? b[sortBy].toLowerCase() : b[sortBy];
        if (first < second) return -1;
        if (first > second) return 1;
        return 0;
    });
}

function onSortChange(value) {
    sortBy = value;
    showData();
}

function checkValidity() {
    const pizzaName = document.getElementById('name');
    const pizzaPrice = document.getElementById('price');
    const toppingsCount = document.getElementById('toppings-count').value;
    if (!pizzaName.checkValidity() || !pizzaPrice.checkValidity()) {
        return false;
    }
    for (let i = 0; i < toppingsCount; i++) {
        const elementTopping = document.getElementById('topping' + (i + 1));
        if (!elementTopping.checkValidity()) {
            return false;
        }
    }
    return true;
}

function getPizzasFromStorage() {
    return JSON.parse(sessionStorage.getItem(storageKey));
}
