const systemConfig = require("../../config/system.js");
const SettingGeneral = require("../../models/settings-general.model.js");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/settings/general.pug",{
        pageTitle: "General",
        settingGeneral : settingGeneral
    });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) =>{
    
    const settingGeneral = await SettingGeneral.findOne({});
    if (settingGeneral){
        await SettingGeneral.updateOne({_id:settingGeneral.id},req.body);
    }else{
        const record = new SettingGeneral(req.body);
        await record.save();
    };

    res.redirect("back");
};