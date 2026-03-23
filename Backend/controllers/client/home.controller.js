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
        deleted: false,
        isBestSeller: true
    };
    const bestSellerProducts = await Product.find(filterBestSellerProduct)
        .limit(5);

    const newProducts = await Product.find({ deleted: false })
        .sort({ createdAt: -1, _id: -1 })
        .limit(7);

    const trendingProducts = await Product.find({
        deleted: false,
        boughtInLastMonth: { $gt: 0 }
    })
        .sort({ boughtInLastMonth: -1 })
        .limit(7);

    const productData = {
      bestSellerProducts: bestSellerProducts,
      newProducts: newProducts,
      trendingProducts: trendingProducts
    }

    // console.log(productData.newProducts);
    res.render("client/pages/home/index", {
        pageTitle: "Home",
        categories: categories,
        categoryHierarchy: categoryHierarchy,
        newProducts: newProducts,
        bestSellerProducts: bestSellerProducts,
        trendingProducts: trendingProducts,
        productData: productData
    })
}