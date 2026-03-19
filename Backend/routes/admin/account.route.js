const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/account.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/createAccount.validate.js');
const { handleMulterError } = require('../../helpers/storageMulter.js')


router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',
    upload.single('avatar'),
    handleMulterError,
    validate.validateCreateAccount,
    controller.store
);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',
    upload.single('avatar'),
    handleMulterError,
    validate.validateUpdateAccount,
    controller.update
);
// router.delete('/:id', controller.delete);
module.exports = router;