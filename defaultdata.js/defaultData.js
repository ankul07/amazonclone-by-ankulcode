const Products = require("../models/productSchema")
const productData = require("../constants/productdata")


const DefaultData = async()=>{
    try {
        const storeData = await Products.insertMany(productData)
        console.log("store succesfully")
    } catch (error) {
        console.log("not done")
    }
}

module.exports = DefaultData;