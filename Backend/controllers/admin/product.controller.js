const Product = require('../../models/product.model.js')
const Category = require('../../models/category.model.js')
const Account = require('../../models/account.model.js');

const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system.js');
const sort = require('../../helpers/sort.js');
const { buildCategoryHierarchy } = require('../../helpers/categoryTree.js');

const fs = require('fs').promises;

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
    const objectPagination = paginationHelper(req.query, totalProducts, "ADMIN");

    // sắp xếp
    sortOption = sort.sort(req, res);



    // lọc sản phẩm + phân trang
    const products = await Product.find(filter)
        .sort(sortOption)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        const account = await Account.findById(product.createdBy.account_id);
        if (account) {
            product.accountName = account.fullName;
        } else {
            product.accountName = 'Unknown';
        }
    }


    res.render("admin/pages/product/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        filterStatus: filterStatusHelperFn(),
        searchValue: objectSearch.keyword,
        pagination: objectPagination,
        sortValue: req.query.sort
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
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
        const accountId = res.locals.user._id;
        await Product.updateMany(
            { _id: { $in: idsArray } },
            { deleted: true, deletedBy: { account_id: accountId, deletedAt: new Date() } });
        req.flash('success', 'Items deleted successfully.');
    }

    res.redirect(req.get('Referrer') || '/');
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // console.log('Deleting product with ID:', id);
    const accountId = res.locals.user._id;
    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedBy: { account_id: accountId, deletedAt: new Date() }
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
    const allCategories = await Category.find({ deleted: false });
    const categoriesHierarchy = buildCategoryHierarchy(allCategories);

    res.render("admin/pages/product/create", {
        pageTitle: "Create Product",
        categories: categoriesHierarchy
    })
}

// [POST] /admin/products/store
module.exports.store = async (req, res) => {
    let uploadedFilename = null;

    try {
        // console.log('Received file data:', req.file);
        const productData = req.body;
        console.log('Received product data:', productData);

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

        productData.createdBy = {
            account_id: res.locals.user._id,
            createdAt: new Date()
        }

        const product = new Product(productData);
        await product.save();

        req.flash('success', 'Create product successfully');
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
        console.error('Error type:', error.constructor.name);
        console.error('Error stack:', error.stack);

        // Check if response is still valid
        if (!res.headersSent) {
            if (typeof req.flash === 'function') {
                req.flash('error', 'Error creating product: ' + error.message);
                res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
            } else {
                console.error('Flash middleware is not available!');
                res.status(500).json({ error: error.message });
            }
        } else {
            console.error('Response already sent, cannot send error to client');
        }
    }
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findById({
            _id: id,
            deleted: false
        });
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products`);
        }

        const allCategories = await Category.find({ deleted: false });
        const categories = buildCategoryHierarchy(allCategories);

        // console.log('Product category_id:', categories);

        // Tìm tên danh mục từ ID
        const categoryData = categories.find(cat => cat._id.toString() === product.category_id.toString()); const categoryDisplayTitle = categoryData ? categoryData.displayTitle : 'N/A';

        res.render("admin/pages/product/edit", {
            pageTitle: "Edit Product",
            product: product,
            categories: categories,
            categoryDisplayTitle: categoryDisplayTitle
        });

    } catch (error) {
        console.error('Update error:', error);
        req.flash('error', 'Error updating product');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products`);
    }

}

// [PATCH] /admin/products/edit/:id
module.exports.update = async (req, res) => {
    const id = req.params.id;

    if (req.file) {
        const uploadedFilename = req.file.filename;
        req.body.imgUrl = `/uploads/${uploadedFilename}`;
    }
    try {
        const updateUserInfo = {
            account_id: res.locals.user._id,
            updatedAt: new Date()
        };
        console.log(updateUserInfo);

        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products`);
        }

        await Product.updateOne(
            { _id: id },
            {
                $set: { ...req.body },
                $push: { updatedBy: updateUserInfo }
            }
        );

        req.flash('success', 'Product updated successfully');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    } catch (error) {
        console.error('Update error:', error);
        req.flash('error', 'Error updating product');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/products/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const allCategories = await Category.find({ deleted: false });
    const categories = buildCategoryHierarchy(allCategories);

    const product = await Product.findOne({
        _id: id,
        deleted: false
    });

    // Tìm tên danh mục từ ID
    const categoryData = allCategories.find(cat => cat._id.toString() === product.category_id.toString());
    const categoryName = categoryData ? categoryData.title : 'N/A';

    res.render('admin/pages/product/viewDetail', {
        pageTitle: "Product Details",
        product: product,
        categories: categories,
        categoryName: categoryName
    });
}