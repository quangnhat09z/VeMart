
// Button status
const buttonStatus = document.querySelectorAll('.button-status');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    const currentStatus = url.searchParams.get('status') || "";

    buttonStatus.forEach(button => {
        button.classList.remove('active');

        if (button.getAttribute('data-status') === currentStatus) {
            button.classList.add('active');
        }
        button.addEventListener('click', function () {
            const status = this.getAttribute('data-status');
            if (status) {
                url.searchParams.set('status', status);
            }
            else {
                url.searchParams.delete('status');
            }
            // console.log(url.href);
            window.location.href = url.href;
        })
    })
}
