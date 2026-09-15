let cors = require("cors")
let express= require("express")
let mongoose=   require('mongoose')
let bcryptjs=  require('./node_modules/bcryptjs/umd/index.js')
let jwt = require('jsonwebtoken')
let app=  express()
let User=  require('./db/db.js')
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/db").then(()=>{
   console.log("db......");
   
})
app.post("/signUp", async(req,res)=>{
   let {name,email,passWord ,role}=req.body
  let findData=   await User.findOne({email})
  console.log(findData,"hjehehe");
  if(findData){
   return res.send("user jinda haii....")
  }else{
     let updateddP = await bcryptjs.hash(passWord,10)

     console.log(updateddP,"dekhoooooo");
     
 let UserInfo=  new User({
      name,email,
      passWord:updateddP,
      role:role||'user'
   

   })
      await UserInfo.save()
      res.send("done.......")
  }
})
app.post('/login', async(req,res)=>{
   let {email,passWord}=req.body

 let findData=   await User.findOne({email})    
 console.log(findData,"heheh");

 let validP= await   bcryptjs.compare(passWord,findData.passWord)
 if(!validP){
   return res.send("kuch nhi ho payega aapse.....")
 }

  let token=jwt.sign({email:findData.email,role:findData.role},"hehehehehe")
  console.log(token,"hehe");

 res.json({msg:"done",token:token})

})

let auth=(req,res,next)=>{
   let token=req.headers.authorization;
   console.log(token,"tokenn");
   
   if(!token){
      return res.send("kaun hai app...")
   }
  let decode=  jwt.verify(token,"hehehehehe")
  console.log(decode,"isse");
  next()
}


app.get("/api",auth,(req,res)=>{
   res.send("heheh")

})



app.post('/forgot-password', async (req, res) => {

   const { email } = req.body;

   try {

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).send('User not found');
      }

      // Generate reset token
      const resetToken = jwt.sign(
         { email: user.email },
         "hehehehehe",
         { expiresIn: "10m" }
      );

      // Save token and expiry
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      // For testing in Thunder Client
      res.json({
         msg: "Reset token generated",
         token: resetToken
      });

   } catch (error) {

      res.status(500).send(
         'Error generating reset token: ' + error.message
      );

   }

});


app.post('/reset-password/:token', async (req, res) => {

   const { token } = req.params;
   const { newPassword } = req.body;

   try {

      const user = await User.findOne({
         resetToken: token,
         resetTokenExpiry: { $gt: Date.now() }
      });

      if (!user) {
         return res.status(400).send('Invalid or expired token');
      }

      // Hash the new password
      const hashedPassword = await bcryptjs.hash(newPassword, 10);

      // Update password
      user.passWord = hashedPassword;

      // Remove reset token
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;

      await user.save();

      res.status(200).send('Password reset successfully');

   } catch (error) {

      res.status(500).send(
         'Error resetting password: ' + error.message
      );

   }

});


app.listen(3000, () => {
   console.log("server......");
});



