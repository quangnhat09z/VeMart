document.addEventListener('DOMContentLoaded', function() {
    const userMenuBtn = document.querySelector('.user-menu__btn');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Đóng khi click ra ngoài
        document.addEventListener('click', function() {
            userMenuBtn.setAttribute('aria-expanded', 'false');
        });
    }
});