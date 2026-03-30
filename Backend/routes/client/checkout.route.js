const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/checkout.controller.js');
const validator = require('../../validator/client/createOrder.validate.js');

router.get('/', controller.viewCheckout);
router.post('/order', 
    validator.createOrder, 
    controller.createOrder
);
router.get('/success/:orderId', controller.viewOrderSuccess);

module.exports = router;