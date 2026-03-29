const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/checkout.controller.js');


router.get('/', controller.viewCheckout);
router.post('/order', controller.createOrder);
router.get('/success/:orderId', controller.viewOrderSuccess);

module.exports = router;