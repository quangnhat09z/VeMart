module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword, 'i'); // 'i' ko phân biệt chữ hoa chữ thường
        objectSearch.regex = regex;
    }

    if(query.rating) {
        objectSearch.rating = query.rating;
    }

    if(query.priceMin) {
        objectSearch.priceMin = query.priceMin;
    }

    if(query.priceMax) {
        objectSearch.priceMax = query.priceMax;
    }

    return objectSearch;
}