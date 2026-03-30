const User = require('../../models/user.model.js');

// GET /user/register
module.exports.registerPage = async (req, res) => {
    res.render('client/pages/user/register');   
}

// POST /user/register
module.exports.register = async (req, res) => {
    console.log(req.body);
    res.send('ok');
}

// GET /user/login
module.exports.loginPage = async (req, res) => {
    res.render('client/pages/user/login');   
}

// POST /user/login
module.exports.login = async (req, res) => {
    console.log(req.body);
    res.send('login ok');
}