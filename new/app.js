let express=require("express")
let signUp=require('./Routers/SignUp')
let app=express()
app.use('/api',signUp)
app.listen(4000,()=>{
  console.log("Server.....");
})