let express=require('express')
let router=express.Router()
let User=require('../models/user')
router.get('/',(req,res)=>{
   res.send("hello");
})
router.post("/signUp", async (req, res) => {

   let { name, email, passWord, role } = req.body;

   let findData = await User.findOne({ email });

   console.log(findData, "hjehehe");

   if (findData) {
      return res.send("user jinda haii....");
   }

   let updateddP = await bcryptjs.hash(passWord, 10);

   console.log(updateddP, "dekhoooooo");

   let UserInfo = new User({
      name,
      email,
      passWord: updateddP,
      role: role || "user"
   });

   await UserInfo.save();

   res.send("done.......");
});
module.exports=router