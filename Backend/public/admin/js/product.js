// Change-Status

const statusElements = document.querySelectorAll('[button-change-status]');
// console.log(statusElements);

if (statusElements.length > 0) {
    const formChangeStatus = document.getElementById('changeStatusForm');
    const path = formChangeStatus.getAttribute('data-path');
    console.log(path);

    statusElements.forEach(element => {
        element.addEventListener('click', function () {
            const currentStatus = this.getAttribute('data-status');
            const id = this.getAttribute('data-id');

            let newStatus = currentStatus == "active" ? "inactive" : "active";
            
            const action = path + `/${newStatus}/${id}`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}