const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/product.controller.js')
const upload = require('../../helpers/storageMulter.js');
const multerErrorHandler = require('../../middleware/admin/multerErrorHandler.js');  

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multiple-status', controller.changeMultipleStatus);
router.delete('/delete/:id', controller.deleteItem);
router.get('/create', controller.create);
router.post('/create', upload.single('imgUrl'), controller.store);

//error handler
// router.use(multerErrorHandler);

module.exports = router;