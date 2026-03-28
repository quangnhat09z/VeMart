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