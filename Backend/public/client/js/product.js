console.log("Product page loaded");

const addToCartButton = document.querySelector('.product-detail__actions-btn-cart');
const addtoCartForm = document.getElementById('add-to-cart-form');
if (addToCartButton && addtoCartForm) {
    addToCartButton.addEventListener('click', function(event) {
        event.preventDefault();
        addtoCartForm.submit();
    });
}