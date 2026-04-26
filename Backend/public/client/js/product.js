// console.log("Product page loaded");

function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const filterForm = document.getElementById('filter-form');
    
    if (filterForm) {
        params.forEach((value, key) => {
            const input = filterForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
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

// Submit filter form in product page
const filterForm = document.getElementById('filter-form');
if (filterForm) {
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(filterForm);
        const queryString = new URLSearchParams(formData).toString();
        const action = filterForm.getAttribute('action');
        window.location.href = `${action}?${queryString}`;
    });
}

// Controll price range slider in product page
const minSlider = document.getElementById('minPrice');
const maxSlider = document.getElementById('maxPrice');
const track = document.querySelector('.slider-track');

function updateTrack() {
    console.log("Updating track with min:", minSlider.value, "max:", maxSlider.value);
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


// Handle Add to Cart button click in viewDetail page
const addToCartButton = document.querySelector('.product-detail__actions-btn-cart');
const addtoCartForm = document.getElementById('add-to-cart-form');
if (addToCartButton && addtoCartForm) {
    addToCartButton.addEventListener('click', function(event) {
        event.preventDefault();
        addtoCartForm.submit();
    });
}

// Remove from cart in Cart page
const removeFromCartButtons = document.querySelectorAll('.delete-button');
const removeFromCartForm = document.getElementById('remove-from-cart-form');
if (removeFromCartButtons && removeFromCartForm) {
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = this.value;
            let action = updateQuantityForm.getAttribute('action');
            // Validate client-side trước
            if (!quantity || !/^\d+$/.test(quantity)) {
                action = action + `/${productId}/+?_method=PATCH`;
            }else {
                action = action + `/${productId}/${quantity}?_method=PATCH`;
            }
            
            
            updateQuantityForm.setAttribute('action', action);
            updateQuantityForm.submit();
        });
    });
}