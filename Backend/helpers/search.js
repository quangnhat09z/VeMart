module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword, 'i'); // 'i' ko phân biệt chữ hoa chữ thường
        objectSearch.regex = regex;
    }

    if(query.stars) {
        objectSearch.stars = query.stars;
    }

    if(query.priceMin) {
        objectSearch.priceMin = query.priceMin;
    }

    if(query.priceMax) {
        objectSearch.priceMax = query.priceMax;
    }

    if (query.discountPercentage) {
        objectSearch.discountPercentage = query.discountPercentage;
    }

    return objectSearch;
}