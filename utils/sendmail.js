const nodemailer = require("nodemailer");

const sendEmail = async function (email, subject, message) {
  // create reusable transporter object using defualt SMTP transport

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.email",
    port: 465,
    secure: true,
    auth: {
      user: (SMPT_MAIL = process.env.SMPT_MAIL),
      pass: (SMPT_PASSWORD = process.env.SMPT_PASSWORD),
    },
  });

  const mailInfo = {
    from: SMPT_MAIL,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailInfo);
};

module.exports = {
  sendEmail,
};
