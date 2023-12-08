const nodemailer = require('nodemailer');
// Create a transporter with your SMTP configuration

function sendMail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'testresultsnotifier@gmail.com',
      pass: 'ibmz wwii nfad nfie',
    },
  });
  // Define the email options
  const mailOptions = {
    from: 'testresultsnotifier@gmail.com',
    to: 'jayarajum@ideyalabs.com',
    subject: 'HTML File Notification',
    text: 'Run Finished and attached is the file',
    attachments: [
      {
        filename: 'Hubsync_test_run_report.html',
        path: 'html-report/Hubsync_test_run_report.html', // Replace with the actual file path
      },
    ],
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error:', error.message);
    }
    console.log('Email sent:', info.response);
  });
}
sendMail()