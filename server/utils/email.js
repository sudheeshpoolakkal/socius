import nodemailer from 'nodemailer';

let sendEmail;

if (process.env.NODE_ENV === 'test') {
  // No-op email sender in test environment to avoid external calls
  sendEmail = async () => Promise.resolve();
} else {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  sendEmail = async (to, subject, htmlContent, textContent = null) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, ''),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
}

export default sendEmail;