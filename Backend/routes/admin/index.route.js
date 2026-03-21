const systemConfig = require('../../config/system.js');
const dashboardRoutes = require('./dashboard.route.js');
const productRoutes = require('./product.route.js');
const categoryRoutes = require('./category.route.js');
const roleRoutes = require('./role.route.js');
const accountRoutes = require('./account.route.js');
const authRoutes = require('./auth.route.js');
const personalRoutes = require('./personal.route.js');
const authMiddleware = require('../../middleware/admin/auth.middleware.js');


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard',
        authMiddleware.authRequired,
        dashboardRoutes
    );

    app.use(PATH_ADMIN + '/products',
        authMiddleware.authRequired,
        productRoutes
    );

    app.use(PATH_ADMIN + '/categories',
        authMiddleware.authRequired,
        categoryRoutes
    );

    app.use(PATH_ADMIN + '/roles',
        authMiddleware.authRequired,
        roleRoutes
    );

    app.use(PATH_ADMIN + '/accounts',
        authMiddleware.authRequired,
        accountRoutes
    );
    
    app.use(PATH_ADMIN + '/auth', authRoutes);
    app.use(PATH_ADMIN + '/personal', 
        authMiddleware.authRequired,
        personalRoutes
    );
}