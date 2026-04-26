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


    return objectSearch;
}