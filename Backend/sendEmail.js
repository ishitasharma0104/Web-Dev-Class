const nodemailer = require("nodemailer");


const sendEmail = async (to, subject, text) => {

   const transporter = nodemailer.createTransport({

      service: "Gmail",

      auth: {
         user: "ishita.iit.sharma@gmail.com",

         // Put your NEW Gmail App Password here
         pass: "obrx wrym lsqg keby"
      }

   });


   const mailOptions = {

      from: "ishita.iit.sharma@gmail.com",

      to: to,

      subject: subject,

      text: text

   };


   await transporter.sendMail(mailOptions);

};


module.exports = {
   sendEmail
};