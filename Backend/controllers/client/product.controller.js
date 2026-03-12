// [GET]   /products
const Product = require('../../models/product.model.js')

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
    res.render(`client/pages/product/viewDetail`, {
        pageTitle: "Chi tiết sản phẩm",
        product: product
    })
}