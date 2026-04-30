// Alert auto hide
const alerts = document.querySelectorAll('.alert');
if (alerts.length > 0) {
    setTimeout(() => {
        alerts.forEach(alert => {
            alert.classList.add('fade-out');

            alert.addEventListener('animationend', () => {
                alert.remove();
            }, { once: true });
        });
    }, 3000);
}

// View product detail from cartPage, productPage
const viewDetailLinks = document.querySelectorAll('.view-detail');
if (viewDetailLinks) {
    viewDetailLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const productSlug = this.getAttribute('data-product-slug');
            window.location.href = `/product/detail/${productSlug}`;
        });
    });
}

// Pagination
const nav = document.querySelector('nav[aria-label="Page navigation example"]');
if (nav) {
    const totalPages = parseInt(nav.dataset.total);
    nav.querySelectorAll('.page-link').forEach(pageLink => {
        pageLink.addEventListener('click', function (event) {
            event.preventDefault();
            const url = new URL(window.location.href);
            const currentPage = parseInt(url.searchParams.get('page')) || 1;
            const target = this.dataset.page;

            if (target === 'prev' && currentPage > 1) {
                url.searchParams.set('page', currentPage - 1);
            } else if (target === 'next' && currentPage < totalPages) {
                url.searchParams.set('page', currentPage + 1);
            } else if (target !== 'prev' && target !== 'next') {
                url.searchParams.set('page', target);
            } else return;

            window.location.href = url.href;
        });
    });
}


// Add to cart 
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const addToCartForm = document.getElementById('add-to-cart-form');
const hiddenProductIdInput = document.getElementById('hidden-product-id');
const hiddenQuantityInput = document.getElementById('hidden-quantity');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        hiddenProductIdInput.value = productId;
        hiddenQuantityInput.value = 1; // Default quantity
        action = addToCartForm.getAttribute('action') + '/' + productId;
        addToCartForm.setAttribute('action', action);
        addToCartForm.submit();
    });
});

// Add to wishlist 
const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
const addToWishlistForm = document.getElementById('add-to-wishlist-form');
const wishlistHiddenProductIdInput = document.getElementById('wishlist-hidden-product-id');

addToWishlistButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        wishlistHiddenProductIdInput.value = productId;
        addToWishlistForm.submit();
    });
});