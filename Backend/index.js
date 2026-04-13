const express = require('express')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')

const { createServer } = require('node:http');
const { Server } = require('socket.io');

require('dotenv').config()

const db = require('./config/database.js')
const systemConfig = require('./config/system.js')
const route = require('./routes/client/index.route.js')
const routeAdmin = require('./routes/admin/index.route.js')
const routeApi = require('./routes/api/index.route.js')

const socketMiddleware = require('./middleware/client/socket.middleware.js');
const chatController = require('./controllers/client/chat.controller');

db.connect()

const app = express()
const port = process.env.PORT

// socket io
const server = createServer(app);
const io = new Server(server);
global.io = io;
socketMiddleware(io);
chatController.initSocket(io);


app.set('views', './views')
app.set('view engine', 'pug')

app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.prefixClient = systemConfig.prefixClient

app.use(express.static('public'))
app.use(methodOverride('_method'))

// Parse body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cookieParser())


app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

app.use(flash())

// Routes
route(app)
routeAdmin(app)
routeApi(app)

app.use((req, res) => {
  res.status(404).render('client/pages/errors/404')
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})