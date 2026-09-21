let express = require("express");
let mongoose = require("mongoose");
let bcryptjs = require("bcryptjs");
let cors = require("cors");
let jwt = require("jsonwebtoken");
let crypto = require("crypto");

let app = express();

let User = require("./db/db.js");
let { sendEmail } = require("./sendEmail.js");
const { log } = require("console");

app.use(express.json());
app.use(cors());


// ================= DATABASE =================

mongoose.connect("mongodb://127.0.0.1:27017/db")
   .then(() => {
      console.log("db......");
   })
   .catch((error) => {
      console.log("Database connection error:", error);
   });


// ================= SIGNUP =================

app.post("/signUp", async (req, res) => {

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


// ================= LOGIN =================

app.post("/login", async (req, res) => {

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


// ================= AUTHORIZATION =================

let auth = (req, res, next) => {

   let token = req.headers.authorization;

   console.log(token, "toeknn");

   if (!token) {
      return res.send("kaun hai app...");
   }

   let decode = jwt.verify(
      token,
      "hehehehehe"
   );

   console.log(decode, "isse");

   req.user = decode;

   next();
};


// ================= ROLE CHECK =================

let roleCheck = (role) => {

   return (req, res, next) => {

      if (req.user.role !== role) {
         return res.send("who the hell are u...........");
      }

      next();
   };
};


// ================= ADMIN =================

app.get(
   "/admin",
   auth,
   roleCheck("admin"),
   (req, res) => {

      res.send("hello only admin can acces me!");
   }
);


// ================= FORGOT PASSWORD =================

app.post("/forgot-password", async (req, res) => {

   const { email } = req.body;

   try {

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).send("User not found");
      }

      const resetToken = crypto
         .randomBytes(20)
         .toString("hex");

      user.resetToken = resetToken;

      user.resetTokenExpiry =
         Date.now() + 3600000;

      await user.save();

      const resetUrl =
         `http://localhost:3000/reset-password/${resetToken}`;

      await sendEmail(
         user.email,
         "Password Reset Request",
         `Click the link below to reset your password:\n\n${resetUrl}`
      );

      res
         .status(200)
         .send("Password reset email sent");

   } catch (error) {

      res
         .status(500)
         .send(
            "Error sending password reset email: "
            + error.message
         );
   }
});


// ================= RESET PASSWORD =================

app.post("/reset-password/:token", async (req, res) => {

   let { newP } = req.body;

   let { token } = req.params;

   let user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: {
         $gt: Date.now()
      }
   });

   if (!user) {
      return res.send("invaliddd.......");
   }

   let updatedP =
      await bcryptjs.hash(newP, 10);

   user.passWord = updatedP;

   user.resetToken = undefined;
   user.resetTokenExpiry = undefined;

   await user.save();

   res.send("Password reset successful");
});
app.get('/error',(req,res)=>{
   try{
   let user=null
   console.log(user.name);
   console.log("hehehehe")
   console.log("hey!!");
   res.send("hello");

}
catch(err){
   res.send("erororor",err)
}
})



// ================= SERVER =================

app.listen(3000, () => {

   console.log(
      "Server running on port 3000"
   );

});