const alerts = document.querySelectorAll('.alert');
if (alerts.length > 0) {
    setTimeout(() => {
        alerts.forEach(alert => {
            alert.classList.add('fade-out');

            alert.addEventListener('animationend', () => {
                alert.remove();
                
                if (window.location.pathname.includes('/auth/login') && 
                    alert.classList.contains('alert-success') &&
                    alert.textContent.includes('Login successful')) {
                    window.location.href = '/admin/dashboard';
                }
            }, { once: true });
        });
    }, 3000);
}