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
