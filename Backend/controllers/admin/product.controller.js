const Product = require('../../models/product.model.js')
const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

module.exports.index = async (req, res) => {

    let filter = {
        deleted: false,
    }

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        filter.title = objectSearch.regex;
    }

    // pagination
    const totalProducts = await Product.countDocuments(filter);
    const objectPagination = paginationHelper(req.query, totalProducts);
    // console.log(objectPagination);

    // lọc sản phẩm + phân trang
    const products = await Product.find(filter)
        .sort({ price: "asc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/product/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        filterStatus: filterStatusHelperFn(),
        searchValue: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Status updated successfully.');

    res.redirect(req.get('Referrer') || '/');

}

// [PATCH] /admin/products/change-multiple-status
module.exports.changeMultipleStatus = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids;
    idsArray = ids.split(',').map(id => id.trim());

    if (type !== "delete-all") {
        await Product.updateMany({ _id: { $in: idsArray } }, { status: type });
    }
    else {
        await Product.updateMany(
            { _id: { $in: idsArray } },
            { deleted: true, deletedAt: new Date() });
    }

    res.redirect(req.get('Referrer') || '/');
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });        
    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        });
    res.redirect(req.get('Referrer') || '/');
}

// [PATCH] /admin/products/soft-delete/:id
// module.exports.softDeleteItem = async (req, res) => {
//     const id = req.params.id;
//     await Product.updateOne({ _id: id }, { deleted: true });
//     res.redirect(req.get('Referrer') || '/');
// }