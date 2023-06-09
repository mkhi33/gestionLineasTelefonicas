// Importa nodemailer
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, 
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD 
  }
});

export default transporter;