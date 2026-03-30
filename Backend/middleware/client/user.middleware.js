const User = require('../../models/user.model');

module.exports.userInfo = async (req, res, next) => {
    const token = req.cookies.tokenUser;
    if (token) {
        const user = await User.findOne({
            tokenUser: token,
            deleted: false,
            status: 'active'
        }).select("-password");
        if (user) {
            res.locals.user = user;
        } else {
            res.clearCookie('tokenUser');
        }
    }
    next();
}