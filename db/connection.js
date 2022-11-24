const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose.connect(DB,{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("succesfull connected")
}).catch((error)=>{
    console.log(`not connected because this error ${error}`)
})