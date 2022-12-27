var express = require('express');
var router = express.Router();
const path = require('path');
const upload = require("../middleWare/multer");
const resize = require('../middleWare/resize');
const buyerCollection  = require("../schemas/buyerSchema")

router.post("/signUpAsBuyer",async(req,res)=>{
  try{
    let data = await buyerCollection.findOne({email : req.body.email})
    if(data) return res.status(400).send("User already Exist"); 

      const buyer = new buyerCollection
      buyer.name = req.body.name,
      buyer.email = req.body.email,
      buyer.phone = req.body.phone,
      buyer.image = req.body.image,
      buyer.password = req.body.password,
      await buyer.generateHashedPassword();

      await buyer.save();
      res.status(200).send(true)

  }catch(err){
    console.log("buyerRoutePostError " + err.message)
    return res.status(400).send(err.message)
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

  router.post('/profileImage', upload.single('image'), async function (req, res) {
    try{
      const imagePath = path.join(__dirname, '../public/images');
      const fileUpload = new resize(imagePath);
      if (!req.file) {
       return res.status(401).json({error: 'Please provide an image'});
      }
      const filename = await fileUpload.save(req.file.buffer);
      return res.status(200).json({ path: filename });

    }catch(err){
      console.log(err.message)
      res.status(400).send(err.messsage)
    }
  });






module.exports = router;
