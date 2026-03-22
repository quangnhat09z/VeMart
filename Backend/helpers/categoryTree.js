function buildCategoryHierarchy(categories, parentId = null, level = 0) {
    const result = [];

    categories.forEach(category => {
        if (category.parentCategory === parentId || (parentId === null && !category.parentCategory)) {
            const categoryObj = category.toObject();
            
            // Tìm children trực tiếp 
            const children = categories.filter(cat => 
                cat.parentCategory && 
                cat.parentCategory.toString() === category._id.toString()
            );

            result.push({
                ...categoryObj,
                level: level,
                displayTitle: '─'.repeat(level * 2) + ' ' + category.title,
                children: children.map(child => buildCategoryHierarchyNode(child, categories, level + 1))
            });

            // Thêm categories con (để hiển thị ở view)
            const childResults = buildCategoryHierarchy(categories, category._id.toString(), level + 1);
            result.push(...childResults);
        }
    });
    
    return result;
}

function buildCategoryHierarchyNode(category, allCategories, level = 0) {
    const categoryObj = category.toObject();
    
    const children = allCategories.filter(cat => 
        cat.parentCategory && 
        cat.parentCategory.toString() === category._id.toString()
    );

    return {
        ...categoryObj,
        level: level,
        displayTitle: '─'.repeat(level * 2) + ' ' + category.title,
        children: children.map(child => buildCategoryHierarchyNode(child, allCategories, level + 1))
    };
}

module.exports = {
    buildCategoryHierarchy
};