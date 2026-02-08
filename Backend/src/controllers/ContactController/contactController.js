import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Ethereal uses false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.SMTP_USER,
      subject: `Contact from ${name}`,
      text: message,
    });

    // ✅ LOG ETHEREAL PREVIEW LINK
    console.log("📩 Email sent:", info.messageId);
    console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: "Email sent successfully",
      previewUrl: nodemailer.getTestMessageUrl(info), // optional for frontend
    });

  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ message: "Email failed" });
  }
};
