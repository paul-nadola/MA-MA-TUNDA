// Get fruit data from JSON file
// const fruitDataUrl = 'fruits.json';

let fruitData;

fetch(`http://localhost:3000/fruits`)
  .then(response => response.json())
  .then(data => {
    fruitData = data;
    displayFruits();
  })
  .catch(error => console.error(error));

// Display fruit data in HTML
function displayFruits() {
  const fruitList = document.querySelector('.fruit-list');
  fruitList.innerHTML = '';

  fruitData.forEach(fruit => {
    const fruitItem = document.createElement('div');
    fruitItem.classList.add('fruit');

    const image = document.createElement('img');
    image.src = fruit.imageUrl;
    image.alt = fruit.name;
    fruitItem.appendChild(image);

    const name = document.createElement('h3');
    name.textContent = fruit.name;
    fruitItem.appendChild(name);

    const description = document.createElement('p');
    description.textContent = fruit.description;
    fruitItem.appendChild(description);

    const price = document.createElement('p');
    price.textContent = `Ksh : ${fruit.price}`;
    fruitItem.appendChild(price);

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    fruitItem.appendChild(quantityLabel);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.max = fruit.quantity;
    quantityInput.value = '1';
    fruitItem.appendChild(quantityInput);

    const buyButton = document.createElement('button');
    buyButton.textContent = 'Buy';
    buyButton.id = 'btn'
    buyButton.addEventListener('click', () => addToCart(fruit, quantityInput.value));
    fruitItem.appendChild(buyButton);

    fruitList.appendChild(fruitItem);
  });
}

// Add fruit to cart
const cart = [];

function addToCart(fruit, quantity) {
  const cartItem = cart.find(item => item.fruit.name === fruit.name);

  if (cartItem) {
    cartItem.quantity += parseInt(quantity);
  } else {
    cart.push({
      fruit: fruit,
      quantity: parseInt(quantity)
    });
  }

  displayCart();
}

// Display cart data in HTML
function displayCart() {
  const cartList = document.querySelector('.cart-list');
  const total = document.querySelector('.total');
  let cartHtml = '';

  cart.forEach(item => {
    cartHtml += `
      <div class="cart-item">
        <span>${item.fruit.name}</span>
        <span>${item.quantity}</span>
        <button class="remove-button">Remove</button>
      </div>
    `;
  });

  cartList.innerHTML = cartHtml;

  const cartTotal = cart.reduce((acc, item) => acc + item.fruit.price * item.quantity, 0);
  total.textContent = `Total Ksh : ${cartTotal}`;

  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => button.addEventListener('click', () => removeCartItem(button)));
}

// Remove item from cart
function removeCartItem(button) {
  const cartItem = button.parentElement;
  const fruitName = cartItem.firstChild.textContent;
  const cartIndex = cart.findIndex(item => item.fruit.name === fruitName);
  cart.splice(cartIndex, 1);
  displayCart();
}

// Buy button event listener
const buyButton = document.querySelector('#buy-button');
buyButton.addEventListener('click', buyItems);


// Buy items
function buyItems() {
    cart.forEach(item => {
    const fruitIndex = fruitData.findIndex(fruit => fruit.name === item.fruit.name);
    fruitData[fruitIndex].quantity -= item.quantity;
    });
    
    cart.length = 0;
    displayCart();
    displayFruits();
    }
    
    // Admin functionality
    const adminButton = document.querySelector('#admin-button');
    adminButton.addEventListener('click', showAdminPanel);
    
    function showAdminPanel() {
        const adminPanel = document.querySelector('.admin-panel');
        adminPanel.style.display = 'block';
        
        const fruitList = document.querySelector('.admin-fruit-list');
        fruitList.innerHTML = '';
        
        fruitData.forEach((fruit, index) => {
        const fruitItem = document.createElement('div');
        fruitItem.classList.add('fruit');   
        const image = document.createElement('img');
image.src = fruit.image;
image.alt = fruit.name;
fruitItem.appendChild(image);

const name = document.createElement('h3');
name.textContent = fruit.name;
fruitItem.appendChild(name);

const description = document.createElement('p');
description.textContent = fruit.description;
fruitItem.appendChild(description);

const price = document.createElement('p');
price.textContent = `$${fruit.price}`;
fruitItem.appendChild(price);

const quantityLabel = document.createElement('label');
quantityLabel.textContent = 'Quantity:';
fruitItem.appendChild(quantityLabel);

const quantityInput = document.createElement('input');
quantityInput.type = 'number';
quantityInput.min = '0';
quantityInput.value = fruit.quantity;
fruitItem.appendChild(quantityInput);

const updateButton = document.createElement('button');
updateButton.textContent = 'Update';
updateButton.addEventListener('click', () => updateFruit(index, quantityInput.value));
fruitItem.appendChild(updateButton);

const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.addEventListener('click', () => deleteFruit(index));
fruitItem.appendChild(deleteButton);

fruitList.appendChild(fruitItem);
});
}

function updateFruit(index, quantity) {
fruitData[index].quantity = parseInt(quantity);
displayFruits();
showAdminPanel();
}

function deleteFruit(index) {
fruitData.splice(index, 1);
displayFruits();
showAdminPanel();
}

const addFruitForm = document.querySelector('#add-fruit-form');
addFruitForm.addEventListener('submit', addFruit);

function addFruit(event) {
event.preventDefault();
const name = document.querySelector('#name-input').value;
const description = document.querySelector('#description-input').value;
const price = parseFloat(document.querySelector('#price-input').value);
const quantity = parseInt(document.querySelector('#quantity-input').value);
const image = document.querySelector('#image-input').value;

fruitData.push({
name: name,
description: description,
price: price,
quantity: quantity,
image: image
});

displayFruits();
showAdminPanel();

addFruitForm.reset();
}

// Initialize app
displayFruits();