require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require("path")
require("./db/connection")






const Products = require("./models/productSchema")
const DefaultData = require("./defaultdata.js/defaultData")
const cors = require('cors');
const Router = require("./routes/router");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(cors());
app.use(Router)


//here we do developnet code
app.use(express.static(path.join(__dirname,"./client/build")))

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})




app.listen(PORT,()=>{
    console.log(`we are listening the port number is ${PORT}`)
})

DefaultData();