// Admin scroll position
const adminScrollPositionKey = 'admin:scroll-position';

function saveAdminScrollPosition() {
    sessionStorage.setItem(adminScrollPositionKey, String(window.scrollY || window.pageYOffset || 0));
}

function restoreAdminScrollPosition() {
    const savedPosition = sessionStorage.getItem(adminScrollPositionKey);

    if (savedPosition === null) {
        return;
    }

    sessionStorage.removeItem(adminScrollPositionKey);
    window.scrollTo(0, parseInt(savedPosition, 10) || 0);
}

document.addEventListener('DOMContentLoaded', function () {
    restoreAdminScrollPosition();
});
// End Admin scroll position


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
// End button status

// Search by title
const searchForm = document.querySelector('#search-form');
if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let searchInput = document.querySelector('#search-input');
        // console.log(searchInput.value);
        let url = new URL(window.location.href);
        if (searchInput.value) {
            url.searchParams.set('keyword', searchInput.value.trim());
        }
        else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;

    });
}

// Sortable table
const sortableTables = document.querySelectorAll('.sortable-table');
if (sortableTables.length > 0) {
    sortableTables.forEach(table => {
        table.addEventListener('change', function (event) {
            const sortValue = event.target.value;
            let url = new URL(window.location.href);
            if (sortValue) {
                url.searchParams.set('sort', sortValue);
            }
            else {
                url.searchParams.delete('sort');
            }
            window.location.href = url.toString();
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


// Checkbox multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const checkboxAll = checkboxMulti.querySelector('#selectAll');
    const checkboxItems = checkboxMulti.querySelectorAll('.checkbox-item');

    checkboxAll.addEventListener('change', function () {
        checkboxItems.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    checkboxItems.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (!this.checked) {
                checkboxAll.checked = false;
            }
            else {
                const allChecked = Array.from(checkboxItems).every(item => item.checked);
                checkboxAll.checked = allChecked;
            }
        });
    });
}

// End Checkbox multi

// Form change muiltiple status
const formChangeMultipleStatus = document.getElementById('changeMultipleStatusForm');
console.log("ge", formChangeMultipleStatus);
if (formChangeMultipleStatus) {
    formChangeMultipleStatus.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedItems = document.querySelectorAll('.checkbox-item:checked');
        console.log("Selected items:", selectedItems);
        const actionType = event.target.type.value;
        if (actionType === "delete-all") {
            let isConfirm = confirm("Are you sure you want to delete all selected items?");
            if (!isConfirm) {
                return;
            }
        }

        if (selectedItems.length > 0) {
            const selectedIdList = document.querySelector('#selectedIdList'); // Ô input ẩn để lưu danh sách ID đã chọn
            const ids = [];

            selectedItems.forEach(item => {
                ids.push(item.value);
            });
            // console.log(ids.join(','));
            selectedIdList.value = ids.join(','); // Gán giá trị cho ô input ẩn
            saveAdminScrollPosition();
            formChangeMultipleStatus.submit();
        }
        else {
            alert("Please select at least 1 item to change status.");
        }
    });
}
// End form change muiltiple status


// Delete item
const deleteButtons = document.querySelectorAll('#button-delete');
if (deleteButtons) {
    const deleteForm = document.querySelector('#deleteItemForm');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            let isConfirm = confirm("Are you sure you want to delete this item?");
            if (isConfirm) {
                path = deleteForm.getAttribute('data-path');
                let action = path + `${id}?_method=DELETE`;
                deleteForm.setAttribute('action', action);
                saveAdminScrollPosition();
                deleteForm.submit();
            }
        });
    });
}
// End delete item


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
// End Alert auto hide

// Preview image before upload
const imgInputs = document.querySelectorAll('[upload-image]');
if (imgInputs.length > 0) {
    imgInputs.forEach(imgInput => {
        const uploadImageInput = imgInput.querySelector('[upload-image-input]');
        const uploadImagePreview = imgInput.querySelector('[upload-image-preview]');
        const uploadImageLabel = imgInput.querySelector('[upload-image-label]');
        const clearImageButton = imgInput.querySelector('[upload-image-clear]');

        uploadImageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    console.log(e);
                    uploadImagePreview.src = e.target.result;
                    uploadImagePreview.classList.remove('d-none');
                }
                reader.readAsDataURL(file);

                // Update label with filename
                uploadImageLabel.textContent = file.name;
            }

            // Clear image button
            clearImageButton.style.display = 'inline-block';
            clearImageButton.addEventListener('click', function () {
                uploadImageInput.value = '';
                uploadImagePreview.classList.add('d-none');
                uploadImageLabel.textContent = 'No file chosen';
                clearImageButton.style.display = 'none';
            });
        });
    });
}

