// Form search in header
const searchInput = document.querySelector('.header__info-icon--search');
const searchForm = document.querySelector('.header__info-search');
const searchClose = document.querySelector('.header__info-icon--close');

searchInput.addEventListener('focus', () => {
    searchForm.style.display = 'block';
    searchClose.style.display = 'block';
});

searchClose.addEventListener('click', () => {
    searchForm.style.display = 'none';
    searchClose.style.display = 'none';
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchForm.querySelector('input').value;
    window.location.href = `/product?keyword=${encodeURIComponent(query)}`;
});

// Toggle profile dropdown
const profileIcon = document.querySelector('.top__function-profile');

if (profileIcon) {
    const dropdown = profileIcon.querySelector('.top__function-profile-dropdown');

    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        profileIcon.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!profileIcon.contains(e.target)) {
            profileIcon.classList.remove('active');
        }
    });
}