var express = require('express');
var router = express.Router();
const path = require('path');
const upload = require("../middleWare/multer");
const resize = require('../middleWare/resize');
const buyerCollection  = require("../schemas/buyerSchema")
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

router.post('/signUpAsBuyer', upload.single('image'), async(req,res)=>{
  try{

    let data = await buyerCollection.findOne({email : req.body.email})
    if(data) return res.status(400).send("User already Exist"); 

    const imagePath = path.join(__dirname, '../public/images');
    const fileUpload = new resize(imagePath);
    if (!req.file) 
     return res.status(401).json({error: 'Please provide an image'});
  
    const filename = await fileUpload.save(req.file.buffer);

    const buyer = new buyerCollection
    buyer.name = req.body.name,
    buyer.email = req.body.email,
    buyer.phone = req.body.phone,
    buyer.image = "/images/"+filename,
    buyer.password = req.body.password,
    await buyer.generateHashedPassword();
    buyer.save();

    res.status(200).send(buyer + " Saved")
  }catch(err){
    console.log(err.message);
    res.status(400).send(err.messsage);
  }
});

router.post("/signInAsBuyer",async (req, res)=>{
  try{

    let buyer = await buyerCollection.findOne({ email : req.body.email })
    if(!buyer) return res.status(400).send(false)

    let isValid = await bcrypt.compare(req.body.password, buyer.password)
    if(!isValid) return res.status(400).send(false)

    let payload = {
      id : buyer._id,
      name : buyer.name,
      email : buyer.email,
      image : buyer.image
    }

    let token  = jwt.sign(payload,process.env.jwtkey)
    res.status(200).send(token)
    console.log(req.body.email + " login ");

  }catch(err){
    console.log(err.message)
    res.status(400).send(err.message)
  }

})

  router.get("/buyerDetail/:buyerId", async(req,res)=>{
   try{
    let id = req.params.buyerId;
    let data  = await buyerCollection.findById(id)
    if(!data)
      return res.status(400).send("buyer Not found!!")
      res.status(200).send(data)
  }catch(err){
    console.log(err.message)
    res.status(400).send(err.message)
  }
  })



module.exports = router;
