const productRoutes = require('./product.route.js');
const homeRoutes = require('./home.route.js');
const categoryRoutes = require('./category.route.js');
const cartRoutes = require('./cart.route.js');
const checkoutRoutes = require('./checkout.route.js');
const userRoutes = require('./user.route.js');

const cartMiddleware = require('../../middleware/client/cart.middleware.js');
const userMiddleware = require('../../middleware/client/user.middleware.js');
const settingMiddleware = require('../../middleware/client/setting.middleware.js');

module.exports = (app) => {
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.userInfo);
    app.use(settingMiddleware.setting);

    app.use('/', homeRoutes);

    app.use('/product', productRoutes);

    app.use('/category', categoryRoutes);

    app.use('/cart', cartRoutes);

    app.use('/checkout', checkoutRoutes);

    app.use('/user', userRoutes);
}