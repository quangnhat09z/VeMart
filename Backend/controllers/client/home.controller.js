const Category = require("../../models/category.model.js");
const { buildCategoryHierarchy } = require('../../helpers/categoryTree.js');

// [GET] /
module.exports.index = async (req, res) => {
    const filter = {
        deleted: false
    };
    const categories = await Category.find(filter);
    const categoryHierarchy = buildCategoryHierarchy(categories);
    console.log(categoryHierarchy);
    res.render("client/pages/home/index", {
        pageTitle: "Home",
        categories: categories,
        categoryHierarchy: categoryHierarchy
    })
}