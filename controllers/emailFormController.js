//Local Dependcies
const { sendEmail, emailTemplate } = require("../utils/sendmail");

const emailSent = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Return If Partial Information Provided
    if (email === undefined || name === undefined || subject === undefined || message === undefined) {
      return res.status(206).json({ success: false, payload: { message: "Please fill all details" } });
    }

    //To email
    const adminEmail = process.env.ADMIN_MAIL;

    await sendEmail(adminEmail, subject, emailTemplate(email, message, subject));
    res.status(200).json({
      success: true,
      message: `message sent to mail id ${adminEmail} succesfully `,
    });
  } catch (error) {
    res.status(406).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  emailSent,
};
