const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceDisplay = document.getElementById('total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const townSelect = document.getElementById('town');

let totalPrice = 0;

function getShippingFee() {
    const selectedTown = townSelect.value;
    let fee = 0;
    switch (selectedTown) {
        case 'Calape':
            fee = 150;
            break;
        case 'Tubigon':
            fee = 100;
            break;
        case 'Clarin':
            fee = 70;
            break;
        default:
            fee = 0;
            break;
    }
    return fee;
}

function updateTotalPrice() {
    let checkedTotal = 0;
    document.querySelectorAll('.cart-item input[type="checkbox"]').forEach((checkbox) => {
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent;
            const [itemName, rest] = label.split(' - ');
            const [itemPrice, itemQuantity] = rest.split(' x ');
            checkedTotal += parseFloat(itemPrice.replace('₱', '')) * parseInt(itemQuantity);
        }
    });
    
    const shippingFee = getShippingFee();
    totalPrice = checkedTotal + shippingFee;
    totalPriceDisplay.textContent = totalPrice.toFixed(2);
}

addToCartBtn.addEventListener('click', () => {
    const itemName = document.getElementById('item-name').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);

    if (itemName && !isNaN(itemPrice) && !isNaN(itemQuantity)) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div>
                <input type="checkbox">
                <label>${itemName} - ₱${itemPrice.toFixed(2)} x ${itemQuantity}</label>
            </div>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);

        cartItem.querySelector('input[type="checkbox"]').addEventListener('change', updateTotalPrice);

        document.getElementById('item-name').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-quantity').value = '';
        
        // Update total price with the new item added
        updateTotalPrice();
    } else {
        alert('Please fill out all fields correctly.');
    }
});

cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const cartItem = event.target.parentElement.parentElement;
        cartItem.remove();
        updateTotalPrice();
    } else if (event.target.classList.contains('edit-btn')) {
        const cartItem = event.target.parentElement.parentElement;
        const label = cartItem.querySelector('label').textContent;
        const [itemName, rest] = label.split(' - ');
        const [itemPrice, itemQuantity] = rest.split(' x ');

        document.getElementById('item-name').value = itemName;
        document.getElementById('item-price').value = itemPrice.replace('₱', '');
        document.getElementById('item-quantity').value = itemQuantity;

        cartItem.remove();
        updateTotalPrice();
    }
});

checkoutBtn.addEventListener('click', () => {
    const checkedItems = [];
    let checkedTotal = 0;

    document.querySelectorAll('.cart-item input[type="checkbox"]').forEach((checkbox) => {
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent;
            const [itemName, rest] = label.split(' - ');
            const [itemPrice, itemQuantity] = rest.split(' x ');

            const itemTotal = parseFloat(itemPrice.replace('₱', '')) * parseInt(itemQuantity);
            checkedTotal += itemTotal;
            checkedItems.push(`${itemName} (₱${itemPrice.replace('₱', '')} x ${itemQuantity})`);
        }
    });

    const shippingFee = getShippingFee();
    const finalTotal = checkedTotal + shippingFee;

    if (checkedItems.length > 0) {
        showCustomAlert('The following items are checked out:', checkedItems, finalTotal.toFixed(2));
    } else {
        showCustomAlert('No items selected for checkout.', [], '0.00');
    }
});

function showCustomAlert(message, items, total) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const closeAlertBtn = document.getElementById('close-alert-btn');

    let formattedMessage = `<span style="color: #fff;">${message}</span><br><br>`;
    formattedMessage += items.map(item => `<span style="color: #39ff14;">${item}</span>`).join('<br><br>');
    formattedMessage += `<br><br><span style="color: #fff;">Total Amount: ₱${total}</span>`;

    alertMessage.innerHTML = formattedMessage;
    
    alertBox.style.display = 'flex';

    closeAlertBtn.addEventListener('click', () => {
        alertBox.style.display = 'none';
    });
}
