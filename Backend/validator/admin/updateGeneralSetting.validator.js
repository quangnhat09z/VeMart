const systemConfig = require('../../config/system.js');
const fs = require("fs");

function dealImage(imagePath) {
    if (imagePath) {
        fs.unlink(imagePath.path, (err) => {
            if (err) console.log(err);
        });
    }
}


module.exports.validateUpdateGeneralSetting = (req, res, next) => {
    const generalData = req.body;
    console.log('Received general settings data:', generalData);
    if (!generalData.site_name || !generalData.site_name.trim()) {
        dealImage(req.file);
        req.flash('error', 'Site name is required.');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
    }

    if (!generalData.contact_email || !generalData.contact_email.trim()) {
        dealImage(req.file);
        req.flash('error', 'Contact email is required.');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
    }

    if (generalData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(generalData.contact_email)) {
        dealImage(req.file);
        req.flash('error', 'Contact email is not valid.');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
    }

    if (!generalData.contact_phone || !generalData.contact_phone.trim()) {
        dealImage(req.file);
        req.flash('error', 'Contact phone is required.');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
    }

    if (!generalData.contact_address || !generalData.contact_address.trim()) {
        dealImage(req.file);
        req.flash('error', 'Contact address is required.');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
    }   

    if (generalData.contact_social) {
        if (generalData.contact_social.facebook && !/^https?:\/\/(www\.)?facebook\.com\/.+$/.test(generalData.contact_social.facebook)) {
            dealImage(req.file);
            req.flash('error', 'Facebook URL is not valid.');
            res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
        }
        if (generalData.contact_social.twitter && !/^https?:\/\/(www\.)?twitter\.com\/.+$/.test(generalData.contact_social.twitter)) {
            dealImage(req.file);
            req.flash('error', 'Twitter URL is not valid.');
            res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
        }
        if (generalData.contact_social.instagram && !/^https?:\/\/(www\.)?instagram\.com\/.+$/.test(generalData.contact_social.instagram)) {
            dealImage(req.file);
            req.flash('error', 'Instagram URL is not valid.');
            res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/settings/general`);
        }
    }

    next();
};