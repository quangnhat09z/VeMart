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