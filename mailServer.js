const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'reports.sandoz@chryselys.com',
    pass: 'sudhar@09'
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Function to save base64 PDF to file
const savePdfFromDataUri = (dataUri) => {

  const base64Data = dataUri.split(';base64,').pop();
  const filename = `newsletter_${uuidv4()}.pdf`;
  const filepath = path.join(uploadsDir, filename);
  
  fs.writeFileSync(filepath, base64Data, { encoding: 'base64' });
  return { filename, filepath };
};


app.post('/api/send_newsletter_email', async (req, res) => {
  try {
    const { email, subject, pdfDataUri } = req.body;

    if (!email || !pdfDataUri) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address and PDF data are required' 
      });
    }

    const { filename, filepath } = savePdfFromDataUri(pdfDataUri);

    const mailOptions = {
      from: 'reports.sandoz@chryselys.com',
      to: email,
      subject: subject || 'Your Newsletter from Sandoz',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #8B4513;">Newsletter Items</h2>
          <p>Please find attached your newsletter items from Sandoz.</p>
          <p>Thank you for using our service!</p>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'newsletter.pdf',
          path: filepath
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    setTimeout(() => {
      try {
        fs.unlinkSync(filepath);
        console.log(`Deleted file: ${filepath}`);
      } catch (err) {
        console.error(`Error deleting file: ${err}`);
      }
    }, 5000);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Helper function to clean up uploads folder
const cleanUploadFolder = () => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return;
    }
    
    // Get current time
    const now = new Date().getTime();
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      
      // Get file stats
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for file ${file}:`, err);
          return;
        }
        
        // Check if file is older than 1 hour (3600000 milliseconds)
        const fileAge = now - stats.mtime.getTime();
        if (fileAge > 3600000) {
          fs.unlink(filePath, err => {
            if (err) {
              console.error(`Error deleting file ${file}:`, err);
            } else {
              console.log(`Deleted old file: ${file}`);
            }
          });
        }
      });
    });
  });
};

// Schedule cleanup every hour
setInterval(cleanUploadFolder, 3600000);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});