// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, mobile, address, course, mode } = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'nrityapriya.kathak@gmail.com',
        pass: process.env.EMAIL_PASSWORD, // Store this in .env.local
      },
    });

    // Email to the user
    const mailOptions = {
      from: '"NrityaPriya Dance Academy" <nrityapriya.kathak@gmail.com>',
      to: email,
      subject: 'Thank You for Your Inquiry – NrityaPriya Dance Academy',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to NrityaPriya Dance Academy!</p>
          <p>I am Priyanka, the founder and instructor at the academy. I've received your inquiry and truly appreciate your interest. I'll be getting in touch with you very soon to discuss your requirements in detail.</p>
          <p>Here's a summary of your inquiry:</p>
          <ul>
            <li><strong>Course:</strong> ${course}</li>
            <li><strong>Mode:</strong> ${mode}</li>
            <li><strong>Contact:</strong> ${mobile}</li>
          </ul>
          <p>In the meantime, feel free to explore our Instagram page to see glimpses of our performances, classes, and student progress: <a href="https://www.instagram.com/nrityapriya_/">https://www.instagram.com/nrityapriya_/</a></p>
          <p>Looking forward to connecting with you!</p>
          <p>
            Warm regards,<br />
            <strong>Priyanka</strong><br />
            NrityaPriya Dance Academy
          </p>
        </div>
      `,
    };

    // Email notification to you
    const notificationOptions = {
      from: '"NrityaPriya Website" <nrityapriya.kathak@gmail.com>',
      to: 'nrityapriya.kathak@gmail.com',
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Student Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Course:</strong> ${course}</p>
          <p><strong>Mode:</strong> ${mode}</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(notificationOptions);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}