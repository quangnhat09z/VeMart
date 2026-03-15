const Category = require('../../models/category.model.js')
const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system.js');
const sort = require('../../helpers/sort.js');
const { buildCategoryHierarchy } = require('../../helpers/categoryTree.js');

const fs = require('fs').promises;

// [GET] /admin/categories
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
    const totalCategories = await Category.countDocuments(filter);
    const objectPagination = paginationHelper(req.query, totalCategories);

    const categories = await Category.find(filter);
    const categoryHierarchy = buildCategoryHierarchy(categories);

    // sắp xếp
    sortOption = sort.sort(req, res);

    // lọc danh mục + phân trang
    // const categoryHierarchy 
    //     .sort(sortOption)
    //     .limit(objectPagination.limitItems)
    //     .skip(objectPagination.skip);

    console.log('Category hierarchy:', categoryHierarchy);

    res.render("admin/pages/category/index", {
        pageTitle: "Quản lý danh mục",
        categories: categoryHierarchy,
        filterStatus: filterStatusHelperFn(),
        searchValue: objectSearch.keyword,
        pagination: objectPagination,
        sortValue: req.query.sort
    })
}

// [PATCH] /admin/categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Category.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Status updated successfully.');
    res.redirect(req.get('Referrer') || '/');
}

// [PATCH] /admin/categories/change-multiple-status
module.exports.changeMultipleStatus = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids;
    idsArray = ids.split(',').map(id => id.trim());

    if (type !== "delete-all") {
        await Category.updateMany({ _id: { $in: idsArray } }, { status: type });
        req.flash('success', 'Status updated successfully.');

    }
    else {
        await Category.updateMany(
            { _id: { $in: idsArray } },
            { deleted: true, deletedAt: new Date() });
        req.flash('success', 'Items deleted successfully.');
    }

    res.redirect(req.get('Referrer') || '/');
}

// [GET] /admin/categories/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findById(id);
    res.render("admin/pages/category/viewDetail", {
        pageTitle: "Chi tiết danh mục",
        category: category
    });
}

// [DELETE] /admin/categories/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // console.log('Deleting product with ID:', id);
    await Category.updateOne(
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

// [GET] /admin/categories/edit/:id
exports.edit = async (req, res) => {
    const category = await Category.findById(req.params.id);
    const allCategories = await Category.find({ deleted: false });
    const categoriesHierarchy = buildCategoryHierarchy(allCategories);

    res.render('admin/pages/category/edit', {
        prefixAdmin: systemConfig.prefixAdmin,
        category: category,
        categories: categoriesHierarchy
    });
};

// [PATCH] /admin/categories/edit/:id
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const categoryData = req.body;
        const category = await Category.findById(id);

        // Xử lý file imgUrl        
        if (req.files && req.files.imgUrl && req.files.imgUrl[0]) {
            // Xóa file cũ nếu tồn tại
            if (category.imgUrl) {
                const oldImagePath = `.${category.imgUrl}`;
                await fs.unlink(oldImagePath).catch(err => console.error('Error deleting old image:', err));
            }
            categoryData.imgUrl = `/uploads/${req.files.imgUrl[0].filename}`;
        } else {
            categoryData.imgUrl = category.imgUrl || '';
        }
        // Xử lý file iconUrl
        if (req.files && req.files.iconUrl && req.files.iconUrl[0]) {
            // Xóa file cũ nếu tồn tại
            if (category.iconUrl) {
                const oldIconPath = `.${category.iconUrl}`;
                await fs.unlink(oldIconPath).catch(err => console.error('Error deleting old icon:', err));
            }
            categoryData.iconUrl = `/uploads/${req.files.iconUrl[0].filename}`;
        } else {
            categoryData.iconUrl = category.iconUrl || '';
        }
        await Category.updateOne({ _id: id }, categoryData);

        req.flash('success', 'Category updated successfully');
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating category');
        res.redirect(`${systemConfig.prefixAdmin}/categories/edit/${req.params.id}`);
    }
}


// [GET] /admin/categories/create
exports.create = async (req, res) => {
    const allCategories = await Category.find({ deleted: false });
    const categoriesHierarchy = buildCategoryHierarchy(allCategories);

    res.render('admin/pages/category/create', {
        prefixAdmin: systemConfig.prefixAdmin,
        categories: categoriesHierarchy
    });
};

// [POST] /admin/categories/create
module.exports.store = async (req, res) => {
    try {
        const categoryData = req.body;
        console.log(categoryData);

        // Xử lý file imgUrl
        if (req.files && req.files.imgUrl && req.files.imgUrl[0]) {
            categoryData.imgUrl = `/uploads/${req.files.imgUrl[0].filename}`;
        } else {
            categoryData.imgUrl = '';
        }

        // Xử lý file icon
        if (req.files && req.files.iconUrl && req.files.iconUrl[0]) {
            categoryData.iconUrl = `/uploads/${req.files.iconUrl[0].filename}`;
        } else {
            categoryData.iconUrl = '';
        }

        categoryData.displayOrder = await Category.countDocuments() + 1;

        const category = new Category(categoryData);

        await category.save();

        req.flash('success', 'Category created successfully');
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error creating category');
        res.redirect(`${systemConfig.prefixAdmin}/categories/create`);
    }
}