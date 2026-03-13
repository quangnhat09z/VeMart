const Category = require('../../models/category.model.js')
const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system.js');
const sort = require('../../helpers/sort.js');

const fs = require('fs').promises;

// [GET] /admin/categories
module.exports.index = (req, res) => {
    res.render("admin/pages/category/index", {
        pageTitle: "Quản lý danh mục"
    })
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