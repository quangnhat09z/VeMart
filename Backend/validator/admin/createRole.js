const systemConfig = require('../../config/system.js');
const fs = require("fs");

module.exports.validateCreateRole = (req, res, next) => {
    const roleData = req.body;
    if (!roleData.title || !roleData.title.trim()) {
        req.flash('error', 'Role title is required.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/roles/create`);
    }
    next();
}