// [GET]   /admin/products

const Product = require('../../models/product.model.js')

module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    });
    console.log(products);
    res.render("admin/pages/product/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products
    })
}