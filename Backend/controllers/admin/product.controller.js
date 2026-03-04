// [GET]   /admin/products

const Product = require('../../models/product.model.js')
const filterStatusHelper = require('../../helpers/filterStatus')(); // Các trạng thái all, active, inactive
const searchHelper = require('../../helpers/search');

module.exports.index = async (req, res) => {
    // console.log(req.query);

    // Lọc cơ bản
    let filter = {
        deleted: false,
    }
    // Thêm trường hợp
    if (req.query.status) {
        filter.status = req.query.status;
    }

    // console.log(req.query);
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        filter.title = objectSearch.regex;

    }

    const products = await Product.find(filter);
    // console.log(products);
    res.render("admin/pages/product/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        filterStatus: filterStatusHelper,
        searchValue: objectSearch.keyword,
    })
}