// Sider dropdown functionality
document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdownContent = this.nextElementSibling;
        dropdownContent.classList.toggle('active');
        
        // Đóng dropdown khác nếu mở
        document.querySelectorAll('.dropdown-content').forEach(content => {
            if (content !== dropdownContent) {
                content.classList.remove('active');
            }
        });
    });
});