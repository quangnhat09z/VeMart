const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/checkout.controller.js');


router.get('/', controller.viewCheckout);

module.exports = router;