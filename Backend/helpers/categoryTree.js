// Hàm build category hierarchy (phẳng nhưng có level)
function buildCategoryHierarchy(categories, parentId = null, level = 0) {
    const result = [];
    
    categories.forEach(category => {
        if (!category.deleted && (category.parentCategory === parentId || (parentId === null && !category.parentCategory))) {
            result.push({
                _id: category._id,
                title: category.title,
                level: level,
                displayTitle: '─'.repeat(level * 2) + ' ' + category.title
            });
            
            // Tìm categories con của category này
            const children = buildCategoryHierarchy(categories, category._id.toString(), level + 1);
            result.push(...children);
        }
    });
    return result;
}

module.exports = {
    buildCategoryHierarchy
};