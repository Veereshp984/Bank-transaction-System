require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegisterEmail(userEmail , name){
    const subject = "Welcome to Backend Ledger";
    const text = `Hello ${name}, \n\n Thankyou for registering at Backend Ledger.
    we're excited to have you on board!\n\n Best regards, \n\n The Backend Ledger Team`;
    const html = `<p>Hello ${name}, \n\n Thankyou for registering at Backend Ledger.
    we're excited to have you on board!\n\n Best regards, \n\n The Backend Ledger Team </p>`;

    await sendEmail(userEmail , subject , text , html)
}

async function sendTransactionEmail(userEmail , name , amount , toAccount){
  const subject = 'Transaction Successfull!';
  const text = `Hello ${name}, \n\n Your transaction of ${amount} to account was successful.\n\n best regards, \n\n Bank Ledger.`
  const html = `<p>Hello ${name},<br><br>Your transaction of ${amount} to account was successful.<br><br>Best regards,<br><br>Bank Ledger.</p>`

  await sendEmail(userEmail , subject , text , html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Failed!';
  const text = `Hello ${name}, \n\nYour transaction of ${amount} to account ${toAccount} has failed.\n\nPlease try again later or contact support.\n\nBest regards, \n\nBank Ledger.`;
  const html = `<p>Hello ${name},<br><br>Your transaction of ${amount} to account ${toAccount} has failed.<br><br>Please try again later or contact support.<br><br>Best regards,<br><br>Bank Ledger.</p>`;
   await sendEmail(userEmail , subject , text , html);
}

module.exports = {
    sendRegisterEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};
