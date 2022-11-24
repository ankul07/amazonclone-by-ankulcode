const router = require("express").Router();
const Products = require("../models/productSchema")
const USER = require("../models/userSchema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const authenicate = require("../middleware/authenticate")


router.get("/get",async (req,res)=>{
try {
    const productData = await Products.find();
    // console.log(productData)
    res.status(201).json(productData)
} catch (error) {
    console.log("error");
}
})


router.get("/getproductsone/:id", async(req, res)=>{
    try {
        const { id } = req.params; 
        //ise hum aise bhi likh sakte hai const id = req.params.id humnse bs object desctructing kiya hai
        const individualdata = await Products.findOne({ id:id })
        //pehli wali id database wali hai or dusri wali id humarei params wali id hai key wali database hai
        // console.log(individualdata)
        res.status(201).json(individualdata);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error})
    }

})


//yahan pr me register krne ke liye router banara hu

router.post("/register", async(req,res)=>{
    // console.log(req.body); 

    const {fname,email,mobile,password,cpassword} = req.body;
    //yahan pr hum body se key le rahe hai

    if(!fname || !email || !mobile || !password || !cpassword){
        res.status(422).json({error:"fill all the data"})
        console.log("no data available");

        //yahan pr hum check kr rahe hai ki key ki value agar nahi hai to error thorw krede 
    }

    try {
        const preUser = await USER.findOne({email:email})
        //yahan pr hum  check kr rahe hi ki body jo value aa rahi hai vo kahi pehle se hi exits to nahi hai findone ke andar pehle wala email database se hai or second wala req.body se aara ha jo humse upper se get kiya hai ye true ya false return krega

        if(preUser){
            res.status(422).json({error:"this user already exits"})
            //agar true hai to  ye this usr already exists wala error throw krega or agar false hai to aage jayga

        }
        else if(password !== cpassword){
            res.status(422).json({error:"password and confirm password not match"})

            //yahan pr ye req.body se password or confirm passord check krega agar same nahi h ue to error throw krega or agar same hue to else part me jayega
        }
        else{
            const finalUser = new USER({
                fname,email,mobile,password,cpassword
            })

            //yahan pr sav validation hone ke baad final user me store or ho jayega 


            /*==========================
            =======yahan pr database me store hone se pehle vo hash ho joki humse is USER schema ke andar define kiya hai
            =============================== */

            const storeData = await finalUser.save();
            // console.log(storeData);
            res.status(201).json(storeData);
            //yahan pr humne use database me store kiya hai or console krake use res json mtlb frontend me bhej diyaa mtlb bs ki return kiya ek type se jahan se data aaya vahi pr respond send kiya hai
        }
    } catch (error) {
       console.log(error)
    }
})




//login ke liye new router 

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({error:"fill the all data"})
    }

    try {
        const userLogin = await USER.findOne({email:email})
        // console.log(userLogin);
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);
            console.log(isMatch)
        
              
                //yahan pe hum ab token generate krwaynge or vo hum isi USER schema ke andar define krenge
                const token = await userLogin.generateAuthToken();
                // console.log(token);
                
                res.cookie("Amazonweb",token,{
                    expires:new Date(Date.now() + 900000 ),
                    httpOnly:true
                })
                

        if(!isMatch){
            res.status(400).json({error:"invalid details"})
        }
        else{
            res.status(201).json(userLogin)
        }
    }
    else{
        res.status(400).json({error:"invalid details"})
    }
    } catch (error) {
        res.status(400).json({error:"invalid details catch"})
    }
})

//heading th e data into post 

router.post("/addcart/:id",authenicate, async(req, res)=>{
try {
    const {id} = req.params;

    const cart = await Products.findOne({id:id})
    // console.log(cart);

    const UserContact = await USER.findOne({_id:req.userID})
    // console.log(UserContact);

    if(UserContact){
        const cartData = await UserContact.addcartdata(cart);
        await UserContact.save();
        // console.log(cartData);
        res.status(201).json(UserContact)
    }
    else{
        res.status(401).json({error:"invalid user"})
    }
} catch (error) {
    res.status(401).json({error:"invalid user"})
}
})


//details carts for router 

router.get("/cartdetails",authenicate,async (req,res)=>{
        try {
            const buyuser = await USER.findOne({_id:req.userID});
            res.status(201).json(buyuser)
        } catch (error) {
            console.log(error);
        }

})

// get valid user 

router.get("/validateuser",authenicate,async (req,res)=>{
    try {
        const validuserone = await USER.findOne({_id:req.userID});
        res.status(201).json(validuserone)
    } catch (error) {
        console.log("error");
    }

})



//cart delete wala router add to cart se

router.delete("/remove/:id",authenicate,async(req,res)=>{
    try {
        const {id} = req.params;
        

        req.rootUser.carts = req.rootUser.carts.filter((curval)=>{
            return curval.id !=id;
        })

        req.rootUser.save();
        res.status(201).json(req.rootUser)
        console.log("item remove")
    } catch (error) {
        res.status(400).json(req.rootUser)
        console.log(error);
    }
})

//for user logout 

router.get("/logout",authenicate,(req,res)=>{
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curele)=>{
            return curele.token !== req.token
        })

        res.clearCookie("Amazonweb",{path:"/"});
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens)
        console.log("user logout")
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;