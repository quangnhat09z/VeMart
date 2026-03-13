module.exports.sort = (req, res) => {
    const sortOption = {};
    if (req.query.sort) {
        switch (req.query.sort) {
            case 'newest':
                sortOption.createdAt = -1;
                break;  
            case 'price-asc':
                sortOption.price = 1;
                break;
            case 'price-desc':
                sortOption.price = -1;
                break;
            case 'name-asc':
                sortOption.title = 1;
                break;  
            case 'name-desc':
                sortOption.title = -1;
                break;
            case 'discount-desc':
                sortOption.discountPercentage = -1;
                break;  
            case 'rating-desc':
                sortOption.reviews = -1;
                break;
            default:
                break;
        }
    }
    return sortOption;
}