const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/personal.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/updatePersonalInfo.validate.js');
const { handleMulterError } = require('../../helpers/storageMulter.js')


router.get('/', controller.index);
router.get('/edit', controller.edit);
router.patch('/edit',
    upload.single('avatar'),
    handleMulterError,
    validate.validateUpdatePersonalInfo,
    controller.update
);
module.exports = router;