const Product = require('../../models/product.model.js')
const Category = require('../../models/category.model.js')
const searchHelper = require('../../helpers/search');

// [GET]   /product
module.exports.index = async (req, res) => {

    const filter = {
        deleted: false,
    }
    

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        filter.title = objectSearch.regex;
    }

    const products = await Product.find(filter);
    res.render("client/pages/product/index", {
        pageTitle: "List of Products",
        products: products
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