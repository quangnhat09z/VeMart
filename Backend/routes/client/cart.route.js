const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/cart.controller.js');

router.get('/', controller.viewCart);
router.post('/add/:productId', controller.addToCart);
router.delete('/delete/:productId', controller.removeFromCart);
router.patch('/update/:productId/:quantity', controller.updateQuantity);

module.exports = router;