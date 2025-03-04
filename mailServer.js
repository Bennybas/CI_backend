const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5005;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use your email service
  auth: {
    user: 'your-email@gmail.com',  // Your email
    pass: 'your-app-password'      // App-specific password
  }
});

app.post('/api/send_newsletter_email', async (req, res) => {
  const { email, subject, pdfDataUri } = req.body;

  try {
    // Remove the prefix from the data URI (e.g., "data:application/pdf;base64,")
    const base64Data = pdfDataUri.split(',')[1];

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: subject,
      text: 'Please find attached the newsletter PDF.',
      attachments: [
        {
          filename: 'Newsletter.pdf',
          content: base64Data,
          encoding: 'base64'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully', 
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});