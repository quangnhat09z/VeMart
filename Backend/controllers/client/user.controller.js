const User = require('../../models/user.model.js');

module.exports.register = async (req, res) => {
    res.render('client/pages/user/register');   
}

module.exports.login = async (req, res) => {
    res.render('client/pages/user/login');   
}