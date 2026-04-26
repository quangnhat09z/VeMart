const Product = require('../../models/product.model.js')
const Category = require('../../models/category.model.js')
const searchHelper = require('../../helpers/search');

// [GET]   /product
module.exports.index = async (req, res) => {

    const category_filter = {
        deleted: false,
    }
    const product_filter = {
        deleted: false,
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        product_filter.title = objectSearch.regex;
    }
    if (objectSearch.rating) {
        product_filter.stars = { $gte: parseFloat(objectSearch.rating) };
    }
    if (objectSearch.priceMin) {
        product_filter.price = { ...product_filter.price, $gte: parseFloat(objectSearch.priceMin) };
    }
    if (objectSearch.priceMax) {
        product_filter.price = { ...product_filter.price, $lte: parseFloat(objectSearch.priceMax) };
    }

    console.log("Product filter:", product_filter);

    const products = await Product.find(product_filter);
    const categories = await Category.find(category_filter);

    res.render("client/pages/product/index", {
        pageTitle: "List of Products",
        products: products,
        categories: categories
    })
}

// [GET]   /products/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false
    });
    // console.log(product);
    const category = await Category.findOne({
        _id: product.category_id,
        deleted: false
    })
    // console.log(category);
    res.render(`client/pages/product/viewDetail`, {
        pageTitle: "Product Detail",
        product: product,
        category: category
    })
}