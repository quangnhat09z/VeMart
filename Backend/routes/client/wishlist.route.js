const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/wishlist.controller.js')

router.get('/', controller.wishlistPage);
router.post('/add', controller.addToWishlist);
router.delete('/remove', controller.removeFromWishlist);

module.exports = router;