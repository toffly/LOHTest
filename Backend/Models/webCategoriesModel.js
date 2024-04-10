const mongoose = require("mongoose");

const webCategoriesSchema = mongoose.Schema({
    id: Number,
    title_th: String,
    title_en: String,
    parent_id: Number, //  relationship with id in web_categories // null is root
    link: String,
    image: String,
    status: String,
    sequence: Number
});

const webCategories = mongoose.model('web_categories', webCategoriesSchema);

module.exports = webCategories;