const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/category.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/createCategory.validate.js');

router.get('/', controller.index);
router.get('/create', controller.create)
router.post('/create',
    upload.fields([
        { name: 'imgUrl', maxCount: 1 },
        { name: 'iconUrl', maxCount: 1 }
    ]),
    validate.validateCreateCategory,
    controller.store
);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multiple-status', controller.changeMultipleStatus);
router.get('/:id', controller.detail);
router.delete('/delete/:id', controller.deleteItem);

module.exports = router;