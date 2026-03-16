const Product = require('../../models/product.model.js')
const Category = require('../../models/category.model.js')
const Role = require('../../models/role.model.js')

const filterStatusHelperFn = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system.js');
const sort = require('../../helpers/sort.js');

const fs = require('fs').promises;

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let filter = {
        deleted: false,
    }
    const roles = await Role.find(filter);

   // pagination
    const totalCategories = await Category.countDocuments(filter);
    const objectPagination = paginationHelper(req.query, totalCategories);

    res.render("admin/pages/role/index", {
        pageTitle: "Role management",
        roles: roles,
        pagination: objectPagination

    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Create new role",
    });
}

// [POST] /admin/roles/create
module.exports.store = async (req, res) => {
    console.log("Request body:", req.body); 
    try {
        const { title, description } = req.body;        
        const newRole = new Role({
            title,
            description,    
        });
        await newRole.save();
        req.flash('success', 'Role created successfully.');
        res.redirect(systemConfig.prefixAdmin + '/roles');
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).send("Internal Server Error");
    }   
}
    
