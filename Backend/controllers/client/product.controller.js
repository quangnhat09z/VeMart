// [GET]   /products
const Product = require('../../models/product.model.js')

module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: 'active',
    });
    // console.log(products);
    res.render("client/pages/product/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    })
}