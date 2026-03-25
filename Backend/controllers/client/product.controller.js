const Product = require('../../models/product.model.js')
const Category = require('../../models/category.model.js')

// [GET]   /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
    }).sort({ price: "asc" });
    // console.log(products);
    res.render("client/pages/product/index", {
        pageTitle: "Danh sách sản phẩm",
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
    console.log(product);
    const category = await Category.findOne({
        _id: product.category_id,
        deleted: false
    })
    console.log(category);
    res.render(`client/pages/product/viewDetail`, {
        pageTitle: "Product Detail",
        product: product,
        category: category
    })
}