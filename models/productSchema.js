const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true
    },
    url:{
        type:String,
    },
    detailUrl:{
        type:String,
    },
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String,
})

const Products = new mongoose.model("product",productSchema);

module.exports = Products;