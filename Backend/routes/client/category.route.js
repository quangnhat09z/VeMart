const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/category.controller.js')

router.get('/', controller.index);
router.get('/:slug', controller.categoryProducts);

module.exports = router;