const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/auth.controller.js')
const upload = require('../../helpers/storageMulter.js');
const validate = require('../../validator/admin/createAccount.validate.js');
const { handleMulterError } = require('../../helpers/storageMulter.js')


router.get('/login', controller.index);
router.post('/login', controller.login);

module.exports = router;
