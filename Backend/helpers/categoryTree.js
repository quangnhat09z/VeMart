function buildCategoryHierarchy(categories, parentId = null, level = 0) {
    const result = [];

    categories.forEach(category => {
        if (category.parentCategory === parentId || (parentId === null && !category.parentCategory)) {
            // Chuyển category thành object
            const categoryObj = category.toObject();
            
            result.push({
                ...categoryObj,
                level: level,
                displayTitle: '─'.repeat(level * 2) + ' ' + category.title
            });

            // Tìm categories con của category này
            const children = buildCategoryHierarchy(categories, category._id.toString(), level + 1);
            result.push(...children);
        }
    });
    // console.log('Built category hierarchy:', result);
    return result;
}

module.exports = {
    buildCategoryHierarchy
};
