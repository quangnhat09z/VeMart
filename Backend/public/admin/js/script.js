


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
// console.log(searchForm);
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
const formChangeMultipleStatus = document.querySelector('#changeMultipleStatusForm');

if (formChangeMultipleStatus) {
    formChangeMultipleStatus.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedItems = document.querySelectorAll('.checkbox-item:checked');

        if (selectedItems.length > 0) {
            const selectedIdList = document.querySelector('#selectedIdList'); // Ô input ẩn để lưu danh sách ID đã chọn
            const ids = [];

            selectedItems.forEach(item => {
                ids.push(item.value);
            });
            console.log(ids.join(','));
            selectedIdList.value = ids.join(','); // Gán giá trị cho ô input ẩn
            formChangeMultipleStatus.submit();
        }
        else {
            alert("Please select at least 1 item to change status.");
        }
    });
}
// End form change muiltiple status