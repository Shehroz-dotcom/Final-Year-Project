import nodemailer from 'nodemailer';

(async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    console.log({
      SMTP_HOST: 'smtp.ethereal.email',
      SMTP_PORT: 587,
      SMTP_USER: testAccount.user,
      SMTP_PASS: testAccount.pass,
    });
  } catch (err) {
    console.error('❌ Error creating Ethereal account:', err);
  } finally {
    console.log('Script finished.');
  }
})();
