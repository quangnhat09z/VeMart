const mongoose = require('mongoose');

const settingGeneralSchema = new mongoose.Schema({
    site_name: { type: String, required: true },
    logo: { type: String},
    favicon: { type: String,},
    contact_email: { type: String, required: true },
    contact_phone: { type: String, required: true },
    contact_address: { type: String, required: true },
    contact_social: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },
    copyright: { type: String},
}, { timestamps: true });

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, 'setting-general');
module.exports = SettingGeneral;