const productRoutes = require('./product.route.js');
const homeRoutes = require('./home.route.js');

module.exports = (app) => {
    app.use('/', homeRoutes);

    app.use('/product', productRoutes);

}