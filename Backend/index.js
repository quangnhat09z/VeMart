const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

require('dotenv').config(); 

const db = require('./config/database.js')

const systemConfig = require('./config/system.js');
const route = require('./routes/client/index.route.js')
const routeAdmin = require('./routes/admin/index.route.js')

db.connect();

const app = express()
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});