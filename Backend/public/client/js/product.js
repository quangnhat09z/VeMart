console.log("Product page loaded");

// Handle Add to Cart button click in viewDetail page
const addToCartButton = document.querySelector('.product-detail__actions-btn-cart');
const addtoCartForm = document.getElementById('add-to-cart-form');
if (addToCartButton && addtoCartForm) {
    addToCartButton.addEventListener('click', function(event) {
        event.preventDefault();
        addtoCartForm.submit();
    });
}

// Remove from cart in Cart page
const removeFromCartButtons = document.querySelectorAll('.btn-danger');
const removeFromCartForm = document.getElementById('remove-from-cart-form');
if (removeFromCartButtons && removeFromCartForm) {
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            document.getElementById('remove-product-id').value = productId;
            const action = removeFromCartForm.getAttribute('action') + `/${productId}?_method=DELETE`;
            removeFromCartForm.setAttribute('action', action);
            removeFromCartForm.submit();
        });
    });
}

// Update quantity in Cart page
const quantityInputs = document.querySelectorAll('.quantity-input');
const updateQuantityForm = document.getElementById('update-quantity-form');
if (quantityInputs && updateQuantityForm) {
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = this.value;
            let action = updateQuantityForm.getAttribute('action');
            // Validate client-side trước
            if (!quantity || !/^\d+$/.test(quantity)) {
                action = action + `/${productId}/+?_method=PATCH`;
            }else {
                action = action + `/${productId}/${quantity}?_method=PATCH`;
            }
            
            
            updateQuantityForm.setAttribute('action', action);
            updateQuantityForm.submit();
        });
    });
}