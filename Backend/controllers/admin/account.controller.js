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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const accountId = req.params.id;    
    const account = await Account.findById(accountId);
    const roles = await Role.find({ deleted: false });  
    if (!account) {
        req.flash('error', 'Account not found');
        return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    res.render('admin/pages/account/edit', {
        title: 'Edit Account Info',
        account: account,
        roles: roles
    });
}


// [PATCH] /admin/accounts/edit/:id
module.exports.update = async (req, res) => {
    const accountId = req.params.id;    
    try {
        const accountData = req.body;
        console.log(accountData);
        if (req.file) {
            uploadedFilename = req.file.filename;
            accountData.avatar = `/uploads/${req.file.filename}`;
        }
        
        await Account.findByIdAndUpdate(accountId, accountData);

        req.flash('success', 'Account updated successfully');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch (error) {
        console.error('Error updating account:', error);
        req.flash('error', 'An error occurred while updating the account.');
        res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${accountId}`);
    }
    // res.send('Account update logic goes here');
}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Account.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Status updated successfully.');
    res.redirect(req.get('Referrer') || '/');
}