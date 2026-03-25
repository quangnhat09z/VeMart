const productRoutes = require('./product.route.js');
const homeRoutes = require('./home.route.js');
const categoryRoutes = require('./category.route.js');

module.exports = (app) => {
    app.use('/', homeRoutes);

    app.use('/product', productRoutes);

    app.use('/category', categoryRoutes);

}