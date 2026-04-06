const SettingGeneral = require('../../models/setting-general.model.js');
const systemConfig = require('../../config/system.js'); 
const fs = require('fs').promises; // Sử dụng fs.promises để làm việc với file một cách async/await

module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne(); 
    res.render('admin/pages/settings/general', { 
        settingGeneral 
    });
}

module.exports.updateGeneral = async (req, res) => {
    try {
        const generalData = req.body;
        const existingSetting = await SettingGeneral.findOne();

        // Xử lý file logo 
        if (req.files && req.files.logo && req.files.logo[0]) {
            if (existingSetting && existingSetting.logo) {
                const oldLogoPath = `.${existingSetting.logo}`;
                await fs.unlink(oldLogoPath).catch(err => console.error('Error deleting old logo:', err));
            }
            generalData.logo = `/uploads/${req.files.logo[0].filename}`;
        } else {
            generalData.logo = existingSetting ? existingSetting.logo : '';
        }
        // Xử lý file favicon
        if (req.files && req.files.favicon && req.files.favicon[0]) {
            if (existingSetting && existingSetting.favicon) {
                const oldFaviconPath = `.${existingSetting.favicon}`;
                await fs.unlink(oldFaviconPath).catch(err => console.error('Error deleting old favicon:', err));
            }
            generalData.favicon = `/uploads/${req.files.favicon[0].filename}`;
        } else {
            generalData.favicon = existingSetting ? existingSetting.favicon : '';
        }

        const generalSetting = existingSetting || new SettingGeneral();
        Object.assign(generalSetting, generalData);
        await generalSetting.save();

        req.flash('success', 'General settings updated successfully');
        res.redirect(`${systemConfig.prefixAdmin}/settings/general`);

    } catch (error) {
        console.error('Error updating general settings:', error);
        req.flash('error', 'Failed to update general settings');
        res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
    }

    res.send('General settings updated successfully');
}