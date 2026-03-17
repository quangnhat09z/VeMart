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
    
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const roleId = req.params.id;
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            req.flash('error', 'Role not found.');
            return res.redirect(systemConfig.prefixAdmin + '/roles');
        }   
        res.render("admin/pages/role/edit", {
            pageTitle: "Edit role",
            role: role,
        });
    } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).send("Internal Server Error");
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.update = async (req, res) => {
    console.log("Request body for update:", req.body);
    const roleId = req.params.id;   
    try {
        const { title, description } = req.body;        
        const updatedRole = await Role.findById(roleId);
        if (!updatedRole) {
            req.flash('error', 'Role not found.');
            return res.redirect(systemConfig.prefixAdmin + '/roles');
        }
        updatedRole.title = title;
        updatedRole.description = description;
        await updatedRole.save();
        req.flash('success', 'Role updated successfully.');
        res.redirect(systemConfig.prefixAdmin + '/roles');
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).send("Internal Server Error");
    }
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    // console.log('Deleting product with ID:', id);
    await Role.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        },
        { timestamps: false }  // Ngăn cập nhật updatedAt
    );
    req.flash('success', 'Role deleted successfully.');
    res.redirect(req.get('Referrer') || '/');
}