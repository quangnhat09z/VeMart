"use strict";

var express = require('express');

var methodOverride = require('method-override');

require('dotenv').config();

var db = require('./config/database.js');

var systemConfig = require('./config/system.js');

var route = require('./routes/client/index.route.js');

var routeAdmin = require('./routes/admin/index.route.js');

db.connect();
var app = express();
var port = process.env.PORT;
app.set('views', './views');
app.set('view engine', 'pug'); // App local variables

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express["static"]('public'));
app.use(methodOverride('_method')); // Routes

route(app);
routeAdmin(app);
app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});