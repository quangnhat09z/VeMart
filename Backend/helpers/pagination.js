module.exports = (query, totalItems) => {
    
    const limitItems = process.env.LIMIT_ITEMS_PAGINATION || 10;
    const totalPages = Math.ceil(totalItems / limitItems);

    let currentPage = parseInt(query.page);

    if (isNaN(currentPage) || currentPage < 1) {
        currentPage = 1;
    }
    else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const objectPagination = {
        limitItems: limitItems,
        currentPage: currentPage,
        totalPages: totalPages,
        skip: (currentPage - 1) * limitItems
    }

    return objectPagination;
}