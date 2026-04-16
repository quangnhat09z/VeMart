"use strict";

var sliderList = document.querySelectorAll(".slider"); // console.log(sliderList);

var length = sliderList.length;
var flag = 1;
var slideIndex = 1;
showSlide(slideIndex);

function nextSlide(n) {
  flag += n;

  if (flag <= 0) {
    flag = length;
  } else if (flag > length) {
    flag = 1;
  }

  showSlide(flag);
}

function showSlide(slideIndex) {
  for (var i = 0; i < length; i++) {
    sliderList[i].style.display = 'none';
  } // console.log("Slide Index: " + slideIndex);


  sliderList[slideIndex - 1].style.display = "block";
}

var swiperTrending = new Swiper('.swiper-trending', {
  direction: 'horizontal',
  // hoặc 'vertical'
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  slidesPerView: 5,
  spaceBetween: 10
});
var swiperCategory = new Swiper('.swiper-category', {
  direction: 'horizontal',
  // hoặc 'vertical'
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  slidesPerView: 7,
  spaceBetween: 23
});
var swiperProduct = new Swiper('.swiper-products', {
  direction: 'horizontal',
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  slidesPerView: 3,
  spaceBetween: 20
});
var swiperComment = new Swiper('.swiper-comment', {
  direction: 'horizontal',
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  autoplay: {
    delay: 10000
  },
  slidesPerView: 1
});
var swiperNews = new Swiper('.swiper-new', {
  direction: 'horizontal',
  loop: true,
  autoplay: {
    delay: 10000
  },
  slidesPerView: 3,
  spaceBetween: 20
});
var Days = document.querySelector("#days");
var Hours = document.querySelector("#hours");
var Minutes = document.querySelector("#minutes");
var Seconds = document.querySelector("#seconds");

function timer() {
  var targetDate = new Date("June 1, 2026 00:00:00");
  var currentDate = new Date();
  distance = targetDate - currentDate;
  var days = Math.floor(distance / 1000 / 60 / 60 / 24);
  var hours = Math.floor(distance / 1000 / 60 / 60) % 24;
  var minutes = Math.floor(distance / 1000 / 60) % 60;
  var seconds = Math.floor(distance / 1000) % 60; // console.log("Days:" + days + ", Hours: " + hours + ", Minutes: " + minutes + ", Second" + seconds);

  Days.innerHTML = days;
  Hours.innerHTML = hours;
  Minutes.innerHTML = minutes;
  Seconds.innerHTML = seconds;
}

setInterval(timer, 1000);