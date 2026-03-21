const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/product.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/createProduct.validate.js');
const { handleMulterError } = require('../../helpers/storageMulter.js');

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multiple-status', controller.changeMultipleStatus);
router.delete('/delete/:id', controller.deleteItem);
router.get('/create', controller.create);
router.post('/create',
    upload.single('imgUrl'),
    handleMulterError,
    validate.validateCreateProduct,
    controller.store
);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',
    upload.single('imgUrl'),
    handleMulterError,
    validate.validateUpdateProduct,
    controller.update
);
router.get('/:id', controller.detail);
module.exports = router;