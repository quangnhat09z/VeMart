const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/auth.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/login.validate.js');
const { handleMulterError } = require('../../helpers/storageMulter.js')


router.get('/login', controller.index);
router.post('/login', 
    validate.login, 
    controller.login
);
router.get('/logout', controller.logout);

module.exports = router;
