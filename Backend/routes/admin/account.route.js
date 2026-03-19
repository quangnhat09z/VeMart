const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/account.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/createAccount.js');
const { handleMulterError } = require('../../helpers/storageMulter.js')


router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',
    upload.single('avatar'),
    validate.validateCreateAccount,
    controller.store
);
module.exports = router;