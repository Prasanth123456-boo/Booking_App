import nodemailer from "nodemailer" //module

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //simple mail transport Protocol
    port: 587,
    secure: false, 
    auth: {
      user: '0mrboss24o7@gmail.com', 
      pass: 'gqraaidfcqqrqxgw', 
    
    },
  });