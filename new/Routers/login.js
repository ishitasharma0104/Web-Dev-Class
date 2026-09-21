
let express=require('express')
let router=express.Router()
let user=require('../models/user')

router.post("/login", async (req, res) => {

   let { email, passWord } = req.body;

   let findData = await User.findOne({ email });

   console.log(findData, "heheh");

   if (!findData) {
      return res.send("User not found");
   }

   let validP = await bcryptjs.compare(
      passWord,
      findData.passWord
   );

   if (!validP) {
      return res.send("kuch nhi ho payega aapse.....");
   }

   let token = jwt.sign(
      {
         id: findData._id,
         email: findData.email,
         role: findData.role
      },
      "hehehehehe"
   );

   console.log(token, "hehe");

   res.json({
      msg: "done",
      token: token
   });
});