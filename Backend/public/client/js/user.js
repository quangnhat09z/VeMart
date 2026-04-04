// Preview avatar
const avatarInput = document.getElementById('avatar-input');
const avatarPreview = document.getElementById('new-avatar');
const currentAvatar = document.getElementById('current-avatar');
const avatarLabel = document.querySelector('.avatar-label');

if (avatarInput) {
    avatarInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                avatarPreview.src = e.target.result;
                currentAvatar.style.display = 'none';
                avatarPreview.style.display = 'block';
                avatarLabel.textContent = file.name;
            }
            reader.readAsDataURL(file);
        } else {
            avatarPreview.src = '';
            avatarPreview.style.display = 'none';
            avatarLabel.textContent = 'No file chosen';
        }
    });
}


