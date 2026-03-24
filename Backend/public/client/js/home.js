

let sliderList = document.querySelectorAll(".slider");
// console.log(sliderList);
let length = sliderList.length;
let flag = 1;
let slideIndex = 1;
showSlide(slideIndex);

function nextSlide(n) {
    flag += n;
    if (flag <= 0) {
        flag = length;
    }
    else if (flag > length) {
        flag = 1;
    }
    showSlide(flag);
}

function showSlide(slideIndex) {
    for (let i = 0; i < length; i++) {
        sliderList[i].style.display = 'none';
    }
    // console.log("Slide Index: " + slideIndex);
    sliderList[slideIndex - 1].style.display = "block";
}



const swiperTrending = new Swiper('.swiper-trending', {
    direction: 'horizontal', // hoặc 'vertical'
    loop: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    slidesPerView: 5,
    spaceBetween: 10,
});


const swiperCategory = new Swiper('.swiper-category', {
    direction: 'horizontal', // hoặc 'vertical'
    loop: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    slidesPerView: 7,
    spaceBetween: 23,
});

const swiperProduct = new Swiper('.swiper-products', {
    direction: 'horizontal',
    loop: false,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    slidesPerView: 3,
    // slidesPerGroup: 3,
    spaceBetween: 20,
    watchOverflow: true,
    observer: true,
    observeParents: true,
});




const swiperComment = new Swiper('.swiper-comment', {
    direction: 'horizontal',
    loop: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    autoplay: {
        delay: 10000,
    },

    slidesPerView: 1,
});




const swiperNews = new Swiper('.swiper-new', {
    direction: 'horizontal',
    loop: true,

    autoplay: {
        delay: 10000,
    },

    slidesPerView: 3,
    spaceBetween: 20,
});



// const Days = document.querySelector("#days");
// const Hours = document.querySelector("#hours");
// const Minutes = document.querySelector("#minutes");
// const Seconds = document.querySelector("#seconds");

// function timer() {
//     let targetDate = new Date("June 1, 2026 00:00:00");
//     let currentDate = new Date();
//     distance = targetDate - currentDate

//     let days = Math.floor(distance / 1000 / 60 / 60 / 24);
//     let hours = Math.floor(distance / 1000 / 60 / 60) % 24;
//     let minutes = Math.floor(distance / 1000 / 60) % 60;
//     let seconds = Math.floor(distance / 1000) % 60;

//     // console.log("Days:" + days + ", Hours: " + hours + ", Minutes: " + minutes + ", Second" + seconds);
//     Days.innerHTML = days;
//     Hours.innerHTML = hours;
//     Minutes.innerHTML = minutes;
//     Seconds.innerHTML = seconds;
// }

// setInterval(timer, 1000);


// Our products section
const typeButtons = document.querySelectorAll(".button-type");
const productGroups = document.querySelectorAll(".product-group");

typeButtons.forEach(button => {
    button.addEventListener("click", function () {
        const type = this.getAttribute("data-type");
        
        // Update button active
        typeButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        
        // Update product display
        productGroups.forEach(group => {
            group.classList.remove("active");
            if (group.getAttribute("data-type") === type) {
                group.classList.add("active");
            }
        });

        swiperProduct.slideTo(0, 0);
        swiperProduct.update();
    });
});