const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'ishita.iit.sharma@gmail.com', 
      pass: 'obrx wrym lsqg keby', 
    },
  });

  const mailOptions = {
    from: 'ishita.iit.sharma@gmail.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };