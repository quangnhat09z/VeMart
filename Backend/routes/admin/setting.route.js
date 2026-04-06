const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/setting.controller.js')
const upload = require('../../helpers/storageMulter.js');
const { handleMulterError } = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/updateGeneralSetting.validator.js');

router.get('/general', controller.general);
router.post('/general',
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'favicon', maxCount: 1 }
    ]),
    handleMulterError,
    validate.validateUpdateGeneralSetting,
    controller.updateGeneral
);

module.exports = router;
