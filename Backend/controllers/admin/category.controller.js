const Category = require('../../models/category.model.js')
const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system.js');
const sort = require('../../helpers/sort.js');

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

    // sắp xếp
    sortOption = sort.sort(req, res);

    // lọc danh mục + phân trang
    const categories = await Category.find(filter)
        .sort(sortOption)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/category/index", {
        pageTitle: "Quản lý danh mục",
        categories: categories,
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

// [GET] /admin/categories/create
module.exports.create = (req, res) => {
    res.render("admin/pages/category/create", {
        pageTitle: "Thêm danh mục"
    })
}

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