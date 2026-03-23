const Category = require("../../models/category.model.js");
const Product = require("../../models/product.model.js");
const { buildCategoryHierarchy } = require('../../helpers/categoryTree.js');

// [GET] /
module.exports.index = async (req, res) => {
    const filterCategory = {
        deleted: false,
    };
    const categories = await Category.find(filterCategory);
    const categoryHierarchy = buildCategoryHierarchy(categories);
    

    const filterBestSellerProduct = {
        deleted : false,
        isBestSeller: true
    };
    const bestSellerProducts = await Product.find(filterBestSellerProduct)
        .limit(10);

    res.render("client/pages/home/index", {
        pageTitle: "Home",
        categories: categories,
        categoryHierarchy: categoryHierarchy,
        bestSellerProducts: bestSellerProducts
    })
}