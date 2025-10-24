import nodemailer from 'nodemailer';
import userModel from '../../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const User = await userModel.findOne({ email: email });

    if (!User) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = User.generateResetPasswordToken();
    
    

    // ❌ your typo: "validateBefireSave"
    // ✅ correct:
    await User.save({ validateBeforeSave: false });

    //frontend url where you want to direct user 
    const resetUrl = `${process.env.FRONTEND_URL}/reset_Password/${resetToken}`;

    const message = ` 
      <h2>Password Reset Link</h2>
      <p>Click below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ capture and log the info returned by sendMail
    const info = await transporter.sendMail({
      from: `"Eatelligence" <${process.env.SMTP_USER}>`,
      to: User.email,
      subject: 'Password Reset Request',
      html: message,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      success: true,
      message: 'Reset link sent to your email.',
    });
  } catch (error) {
    console.error('❌ Error in ForgetPassword:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error while forget password' });
  }
};

export { ForgetPassword };
