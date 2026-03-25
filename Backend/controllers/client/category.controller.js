const Category = require('../../models/category.model.js');
const Product = require('../../models/product.model.js');
const { buildCategoryHierarchy } = require('../../helpers/categoryTree.js');

// [GET] /
module.exports.index = async (req, res) => {
    const filterCategory = {
        deleted: false,
    };
    const categories = await Category.find(filterCategory);
    
    res.render("client/pages/category/index", {
        pageTitle: "Categories",
        categories: categories,
    })
}

// [GET] /:slug
module.exports.categoryProducts = async (req, res) => {
    const slug = req.params.slug;
    res.send(`Products in category: ${slug}`);
}
