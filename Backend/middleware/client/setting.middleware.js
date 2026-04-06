const SettingGeneral = require('../../models/setting-general.model.js');

module.exports.setting = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne();
    res.locals.settingGeneral = settingGeneral;
    next();
}