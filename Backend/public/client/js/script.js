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