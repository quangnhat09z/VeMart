// console.log("Product page loaded");

function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const filterForm = document.getElementById('filter-form');

    if (filterForm) {
        params.forEach((value, key) => {
            const inputs = filterForm.querySelectorAll(`[name="${key}"]`);
            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    if (input.value === value) {
                        input.checked = true;
                    }
                } else {
                    input.value = value;
                }
            });
        });

        if (params.has('priceMin') || params.has('priceMax')) {
            if (params.has('priceMin')) {
                minSlider.value = params.get('priceMin');
            }
            if (params.has('priceMax')) {
                maxSlider.value = params.get('priceMax');
            }
            updateTrack();
        }
    }
}
document.addEventListener('DOMContentLoaded', populateFormFromQueryParams);

// Deal with rating-checkbox
const ratingCheckboxes = document.querySelectorAll('input[name="stars"]');
ratingCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            ratingCheckboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });
        }
    });
});

// Deal with discount-checkbox
const discountCheckboxes = document.querySelectorAll('input[name="discountPercentage"]');
discountCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            discountCheckboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });
        }
    });
});

// Deal with category-checkbox
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            categoryCheckboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });
        }
    });
});

// Submit filter form in product page
const filterForm = document.getElementById('filter-form');
if (filterForm) {
    filterForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(filterForm);
        const params = new URLSearchParams();
        
        const maxPriceInput = document.querySelector('input[name="priceMax"]');
        const maxPrice = maxPriceInput ? parseInt(maxPriceInput.max) : null;
        
        formData.forEach((value, key) => {
            // Bỏ qua priceMin=0 và priceMax=maxPrice (giá trị mặc định)
            if (key === 'priceMin' && value === '0') return;
            if (key === 'priceMax' && maxPrice && value === String(maxPrice)) return;
            
            params.append(key, value);
        });
        
        const queryString = params.toString();
        const action = filterForm.getAttribute('action');
        window.location.href = queryString ? `${action}?${queryString}` : action;
    });
}

// Controll price range slider in product page
const minSlider = document.getElementById('minPrice');
const maxSlider = document.getElementById('maxPrice');
const track = document.querySelector('.slider-track');

function updateTrack() {
    const min = parseInt(minSlider.min);
    const max = parseInt(minSlider.max);

    const minVal = parseInt(minSlider.value);
    const maxVal = parseInt(maxSlider.value);

    const percentMin = ((minVal - min) / (max - min)) * 100;
    const percentMax = ((maxVal - min) / (max - min)) * 100;

    track.style.background = `linear-gradient(
        to right,
        #ccc ${percentMin}%,
        #436b8e ${percentMin}%,
        #436b8e ${percentMax}%,
        #ccc ${percentMax}%
    )`;
}

// giữ khoảng cách 10
minSlider.addEventListener('input', () => {
    if (parseInt(minSlider.value) >= parseInt(maxSlider.value) - 10) {
        minSlider.value = maxSlider.value - 10;
    }
    updateTrack();
});

maxSlider.addEventListener('input', () => {
    if (parseInt(maxSlider.value) <= parseInt(minSlider.value) + 10) {
        maxSlider.value = parseInt(minSlider.value) + 10;
    }
    updateTrack();
});

updateTrack();

// Liên kết giá trị của slider với input number
const priceMinInput = document.querySelector('input[name="priceMin"]');
const priceMaxInput = document.querySelector('input[name="priceMax"]');
minSlider.addEventListener('input', () => {
    priceMinInput.value = minSlider.value;
});

maxSlider.addEventListener('input', () => {
    priceMaxInput.value = maxSlider.value;
});

if (priceMinInput && priceMaxInput) {
    priceMinInput.addEventListener('input', () => {
        minSlider.value = priceMinInput.value;
        updateTrack();
    });
    priceMaxInput.addEventListener('input', () => {
        maxSlider.value = priceMaxInput.value;
        updateTrack();
    });
}

// sort product in product page
const sortSelect = document.getElementById('sort');
if (sortSelect) {
   sortSelect.addEventListener('change', function () {
        const selectedOption = this.value;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sort', selectedOption);
        window.location.search = urlParams.toString();
        console.log("Selected sort option:", window.location.search);
    });
}

// Handle Add to Cart button click in viewDetail page
const addToCartButton = document.querySelector('.product-detail__actions-btn-cart');
const addtoCartForm = document.getElementById('add-to-cart-form');
if (addToCartButton && addtoCartForm) {
    addToCartButton.addEventListener('click', function (event) {
        event.preventDefault();
        addtoCartForm.submit();
    });
}

// Remove from cart in Cart page
const removeFromCartButtons = document.querySelectorAll('.delete-button');
const removeFromCartForm = document.getElementById('remove-from-cart-form');
if (removeFromCartButtons && removeFromCartForm) {
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            document.getElementById('remove-product-id').value = productId;
            const action = removeFromCartForm.getAttribute('action') + `/${productId}?_method=DELETE`;
            removeFromCartForm.setAttribute('action', action);
            removeFromCartForm.submit();
        });
    });
}

// Update quantity in Cart page
const quantityInputs = document.querySelectorAll('.quantity-input');
const updateQuantityForm = document.getElementById('update-quantity-form');
if (quantityInputs && updateQuantityForm) {
    quantityInputs.forEach(input => {
        input.addEventListener('change', function () {
            const productId = this.getAttribute('data-product-id');
            const quantity = this.value;
            let action = updateQuantityForm.getAttribute('action');
            // Validate client-side trước
            if (!quantity || !/^\d+$/.test(quantity)) {
                action = action + `/${productId}/+?_method=PATCH`;
            } else {
                action = action + `/${productId}/${quantity}?_method=PATCH`;
            }


            updateQuantityForm.setAttribute('action', action);
            updateQuantityForm.submit();
        });
    });
}