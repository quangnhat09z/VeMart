const systemConfig = require('../../config/system.js');
const Account = require('../../models/account.model.js');
const Role = require('../../models/role.model.js');
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let filter = {
        deleted: false,
    }
    const accounts = await Account.find(filter);
    const roles = await Role.find({ deleted: false });

    const roleMap = {};
    roles.forEach(role => {
        roleMap[role._id] = role.title;
    });

    res.render('admin/pages/account/index', {
        title: 'Quản lý tài khoản',
        accounts: accounts,
        roleMap: roleMap
    });
}



// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render('admin/pages/account/create', {
        title: 'Thêm tài khoản mới',
        roles: roles
    });
}

// [POST] /admin/accounts/create
module.exports.store = async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    try {
        const accoutData = req.body;

        //  Xử lý file ảnh với validation
        if (req.file) {
            uploadedFilename = req.file.filename;
            accoutData.avatar = `/uploads/${req.file.filename}`;
        } else {
            accoutData.avatar = '';
        }

        const newAccount = new Account(accoutData);
        await newAccount.save();

        req.flash('success', 'Account created successfully');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch (error) {
        console.error('Error creating account:', error);
        req.flash('error', 'An error occurred while creating the account.');
        res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    }
    // res.send('Account creation logic goes here');
}