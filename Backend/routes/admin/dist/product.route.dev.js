"use strict";

var e = require('express');

var express = require('express');

var router = express.Router();

var controller = require('../../controllers/admin/product.controller.js');

router.get('/', controller.index);
router.get('/change-status/:status/:id', controller.changeStatus);
module.exports = router;