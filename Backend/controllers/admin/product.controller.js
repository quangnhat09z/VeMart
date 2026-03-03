// [GET]   /admin/products

const Product = require('../../models/product.model.js')

module.exports.index = async (req, res) => {
    let filterButton = [
        {
            name: "All",
            status: "",
            class:"active"
        },
        {
            name: "Active",
            status: "active",
            class:""
        },
        {
            name: "Inactive",
            status: "inactive",
            class:""
        }
    ]

    let filter = {
        deleted: false
    }
    if (req.query.status) {
        filter.status = req.query.status || "active";
    }
    

    const products = await Product.find(filter);
    // console.log(products);
    res.render("admin/pages/product/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        filterStatus: filterButton
    })
}