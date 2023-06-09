//creating a DOMContentLoaded event
window.addEventListener('DOMContentLoaded', (event) => {
  (event).preventDefault();
  let fruitData;
  
  // Get fruit data from JSON file
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
//Creating fruit card
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

    
    const quantity = document.createElement('p');
    quantity.textContent = `Available Quantity: ${fruit.quantity}`;
    fruitItem.appendChild(quantity);

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    fruitItem.appendChild(quantityLabel);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 1;
    quantityInput.max = fruit.quantity;
    quantityInput.value = 1;
    fruitItem.appendChild(quantityInput);

    const buyButton = document.createElement('button');
    buyButton.textContent = 'Add to cart';
    buyButton.id = 'btn'
    buyButton.addEventListener('click', () => addToCart(fruit, quantityInput.value));
    fruitItem.appendChild(buyButton);
    
    fruitList.appendChild(fruitItem);//appending card
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
  //cart total
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

    fetch(`http://localhost:3000/fruits/${fruitData[fruitIndex].id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quantity: fruitData[fruitIndex].quantity}
      )
    })
    });

    
    alert('Thank you for your purchase, rudi tena na tena!!')
    cart.length = 0;
    displayCart();
    displayFruits();
  }
  
  fetch(`http://localhost:3000/fruits`)
  .then(response => response.json())
  .then(data => {
    fruitData = data;
    adminDisplayFruits();
  })
  .catch(error => console.error(error));
        
        const fruitList = document.querySelector('#adminSec');
        // Creating HTML form elements for admin inputs to add items
        const admUpdates = document.createElement('form');
        admUpdates.id = "admUpdates"
        admUpdates.innerHTML = `
          <label for="fruitName">Enter fruit Name:</label>
          <input id="fruitName" type="text" name="fruitName" placeholder="Enter fruit Name" required />
          <label for="fruitDes">Enter fruit Description:</label>
          <input id="fruitDes" type="text" name="fruitDes" placeholder="Enter fruit Description" required />
          <label for="fruitImg">Enter fruit Image link:</label>
          <input id="fruitImg" type="text" name="fruitImg" placeholder="Enter fruit image link" required />
          <label for="fruitPrice">Enter fruit Price:</label>
          <input id="fruitPrice" type="number" name="fruitPrice" placeholder="Enter fruit price" required />
          <label for="fruitQuantity">Enter fruit quantity:</label>
          <input id="fruitQuantity" type="number" name="fruitQuantity" placeholder="Enter fruit Quantity" required />
          <button type="submit" id='btn'>TUMA-TUNDA</button>
        `;
        
        fruitList.appendChild(admUpdates);
        
        admUpdates.addEventListener("submit", (event) => {
          event.preventDefault();//submit event listener
          addFruit();
        });
        
        function addFruit() {
          const fruitNameInput = document.getElementById('fruitName');
          const fruitDesInput = document.getElementById('fruitDes');
          const fruitImgInput = document.getElementById('fruitImg');
          const fruitPriceInput = document.getElementById('fruitPrice');
          const fruitQuantityInput = document.getElementById('fruitQuantity');
        //declaring necessary variables for the forms functionality
          const newFruit = {
            name: fruitNameInput.value,
            imageUrl: fruitImgInput.value,
            description: fruitDesInput.value,
            price: fruitPriceInput.value,
            quantity: fruitQuantityInput.value
          };
        
          fetch('http://localhost:3000/fruits', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(newFruit)
          })
          .then(response => response.json())
          .then((fruit) => {
            fruitNameInput.value = '';
            fruitImgInput.value = '';
            fruitDesInput.value = '';
            fruitPriceInput.value = '';
            fruitQuantityInput.value = '';
          })
          .catch(error => console.error(error));
        }
        const fruitUpdates = document.createElement('form');
        fruitUpdates.id = "fruitUpdates";
        fruitUpdates.innerHTML = `
            <label for="fruitTarget">Enter fruit Name To Edit:</label>
            <input id="fruitTarget" type="text" name="fruitTarget" placeholder="Enter fruit to Edit" required />
            <label for="fruitUp">Enter fruit Name:</label>
            <input id="fruitUp" type="text" name="fruitUp" placeholder="Enter fruit Name" />
            <label for="fruitDesUp">Enter fruit Description:</label>
            <input id="fruitDesUp" type="text" name="fruitDesUp" placeholder="Enter fruit Description"  />
            <label for="fruitImgUp">Enter fruit Image link:</label>
            <input id="fruitImgUp" type="text" name="fruitImgUp" placeholder="Enter fruit image link"  />
            <label for="fruitPriceUp">Enter fruit Price:</label>
            <input id="fruitPriceUp" type="number" name="fruitPriceUp" placeholder="Enter fruit price"  />
            <label for="fruitQuantityUp">Enter fruit quantity:</label>
            <input id="fruitQuantityUp" type="number" name="fruitQuantityUp" placeholder="Enter fruit Quantity"  />
            <button type="submit" id='btn'>REKEBISHA-TUNDA</button>
        `;
        
        fruitList.appendChild(fruitUpdates);
        
        fruitUpdates.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the form from submitting
            addUpdates();
        });
        
        function addUpdates() {
            const nameUp = document.getElementById('fruitUp');
            const descriptionUp = document.getElementById('fruitDesUp');
            const imgUp = document.getElementById('fruitImgUp');
            const priceUp = document.getElementById('fruitPriceUp');
            const quantityUp = document.getElementById('fruitQuantityUp');
        
            const fruitTarget = document.getElementById('fruitTarget');
            const targetFruitName = fruitTarget.value.trim().toLowerCase(); // Get the target fruit name
            let fruits = fruitData
            console.log(fruits);

            const fruitToUpdate = fruits.find(fruit => fruit.name.toLowerCase() === targetFruitName); // Find the fruit object to update
            console.log(fruitToUpdate);

            if (!fruitToUpdate) {
              // Handle case when the target fruit is not found
              alert(`Fruit with name "${targetFruitName}" not found!`);
              return;
            }
            
            const newObj = {
              name: nameUp.value.trim(),
              description: descriptionUp.value.trim(),
              imageUrl: imgUp.value.trim(),
              price: parseFloat(priceUp.value),
              quantity: parseInt(quantityUp.value),
            };
        
            fetch(`http://localhost:3000/fruits/${fruitToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newObj)
            })
            .then(response => response.json())
            .then(updatedFruit => {
                // Update the DOM with the updated fruit
                const index = fruits.findIndex(fruit => fruit.id === updatedFruit.id);
                fruits[index] = updatedFruit;
                renderFruitList(fruits);
                alert(`Fruit "${updatedFruit.name}" updated successfully!`);
        
                // Clear the form fields
                fruitTarget.value = '';
                nameUp.value = '';
                descriptionUp.value = '';
                imgUp.value = '';
                priceUp.value = '';
                quantityUp.value = '';
            })
            .catch(error => console.error(error));
        }
        

function adminDisplayFruits() {//displaying admin content


  fruitData.forEach(fruit => {
    const fruitItem = document.createElement('div');
    fruitItem.id = "matunda"
    fruitItem.classList.add('fruit');
//Fruit cards
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
//admin delete functionality
    const delButton = document.createElement('button');
    delButton.textContent = "DELETE";
    delButton.id = "del"
    fruitItem.appendChild(delButton);
    fruitList.appendChild(fruitItem);
    delButton.addEventListener("click", deleteButton)
    function deleteButton() {
       
        fetch(`http://localhost:3000/fruits/${fruit.id}`,{
          method: "DELETE",
        })
        .then(res => res.json())
        .then(() =>{
          fruitItem.remove()
        })
    }
  })
// // Initialize app
displayFruits();

}}
)