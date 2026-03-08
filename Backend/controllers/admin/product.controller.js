const Product = require('../../models/product.model.js')
const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system.js');
const fs = require('fs').promises;  // Thêm dòng này ở đầu file

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
        // .sort({ price: "asc" })
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
        req.flash('success', 'Status updated successfully.');

    }
    else {
        await Product.updateMany(
            { _id: { $in: idsArray } },
            { deleted: true, deletedAt: new Date() });
        req.flash('success', 'Items deleted successfully.');
    }

    res.redirect(req.get('Referrer') || '/');
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        },
        { timestamps: false }  // Ngăn cập nhật updatedAt
    );
    req.flash('success', 'Item deleted successfully.');
    res.redirect(req.get('Referrer') || '/');
}

// [PATCH] /admin/products/soft-delete/:id
// module.exports.softDeleteItem = async (req, res) => {
//     const id = req.params.id;
//     await Product.updateOne({ _id: id }, { deleted: true });
//     res.redirect(req.get('Referrer') || '/');
// }

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product/create", {
        pageTitle: "Create Product"
    })
}

// [POST] /admin/products/store
module.exports.store = async (req, res) => {
    let uploadedFilename = null;  

    try {
        // console.log('Received file data:', req.file);
        const productData = req.body;
        
        const numericDefaults = ['listPrice', 'boughtInLastMonth', 'reviews', 'discountPercentage'];
        numericDefaults.forEach(field => {
            if (!productData[field] || productData[field] === '') {
                productData[field] = 0;
            } else {
                productData[field] = Number(productData[field]);
                if (isNaN(productData[field])) {
                    productData[field] = 0;
                }
            }   
        });

        productData.isBestSeller = productData.isBestSeller === 'true' || productData.isBestSeller === true;

        //  Xử lý file ảnh với validation
        if (req.file) {
            uploadedFilename = req.file.filename; 
            productData.imgUrl = `/uploads/${req.file.filename}`;
        } else {
            productData.imgUrl = ''; 
        }

        if (!productData.title || !productData.title.trim()) {
            throw new Error('Tên sản phẩm là bắt buộc');
        }

        const product = new Product(productData);
        await product.save();
        
        req.flash('success', 'Tạo sản phẩm thành công');
        res.redirect(`${systemConfig.prefixAdmin}/products`);

    } catch (error) {
        // Cleanup file nếu database save thất bại
        if (uploadedFilename) {
            try {
                const filePath = `./public/uploads/${uploadedFilename}`;
                await fs.unlink(filePath);
                console.log(`Deleted orphaned file: ${uploadedFilename}`);
            } catch (unlinkError) {
                console.error(`Failed to delete file ${uploadedFilename}:`, unlinkError);
            }
        }

        console.error('Store error:', error);
        req.flash('error', 'Lỗi tạo sản phẩm: ' + error.message);
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
    }
}