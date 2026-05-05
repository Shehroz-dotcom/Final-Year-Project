import PDFDocument from 'pdfkit';
import userModel from '../../models/user.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const DownloadPersonalProfile = async (req, res) => {
  try {
    // ========================
    // AUTH
    // ========================
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - no token' });
    }

    const decoded = JwtDecode(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    // ========================
    // FETCH USER
    // ========================
    const user = await userModel.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ========================
    // WEEKLY NUTRITION CALCULATION
    // ========================
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const lastWeekLogs = (user.nutritionLog || []).filter((log) => {
      return new Date(log.date) >= weekAgo;
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    lastWeekLogs.forEach((log) => {
      totalCalories += log.totalCalories || 0;
      totalProtein += log.totalProtein || 0;
      totalCarbs += log.totalCarbs || 0;
      totalFats += log.totalFats || 0;
    });

    // ========================
    // PDF HEADERS
    // ========================
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="User_Profile_Report.pdf"'
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // ========================
    // TITLE
    // ========================
    doc.fontSize(20).text('USER PROFILE REPORT', { align: 'center' });
    doc.moveDown(2);

    // ========================
    // BASIC INFO
    // ========================
    doc.fontSize(16).text('Basic Information');
    doc.fontSize(12);

    doc.text(`Name: ${user.fullName || '-'}`);
    doc.text(`Email: ${user.email || '-'}`);
    doc.text(`Phone: ${user.phoneNo || '-'}`);
    doc.text(`Address: ${user.address || '-'}`);

    doc.moveDown(2);

    // ========================
    // HEALTH PROFILE
    // ========================
    doc.fontSize(16).text('Health Profile');
    doc.fontSize(12);

    const hp = user.healthProfile || {};

    doc.text(`Age: ${hp.age || '-'}`);
    doc.text(`Weight: ${hp.weight || '-'}`);
    doc.text(`Diet Type: ${hp.dietType || '-'}`);
    doc.text(`Spice Tolerance: ${hp.spiceTolerance || '-'}`);

    doc.moveDown();

    doc.text(`Allergies: ${(hp.allergies || []).join(', ') || '-'}`);
    doc.text(`Goals: ${(hp.goals || []).join(', ') || '-'}`);
    doc.text(`Avoid: ${(hp.avoid || []).join(', ') || '-'}`);

    doc.moveDown(2);

    // ========================
    // WEEKLY NUTRITION SUMMARY
    // ========================
    doc.fontSize(16).text('Weekly Nutrition Summary (Last 7 Days)');
    doc.fontSize(12);

    if (lastWeekLogs.length === 0) {
      doc.text('No nutrition data available for this week');
    } else {
      // 🔥 TOTALS
      doc.text(`Total Calories: ${totalCalories}`);
      doc.text(`Total Protein: ${totalProtein}`);
      doc.text(`Total Carbs: ${totalCarbs}`);
      doc.text(`Total Fats: ${totalFats}`);

      doc.moveDown();

      // 🔥 DAILY BREAKDOWN
      doc.text('Daily Breakdown:');
      doc.moveDown(0.5);

      lastWeekLogs.forEach((log, i) => {
        doc.text(
          `${i + 1}. ${new Date(log.date).toDateString()} → ` +
            `Calories: ${log.totalCalories}, Protein: ${log.totalProtein}, ` +
            `Carbs: ${log.totalCarbs}, Fats: ${log.totalFats}`
        );
      });
    }

    doc.moveDown();

    // ========================
    // FINALIZE PDF
    // ========================
    doc.end();
  } catch (error) {
    console.error('PDF ERROR:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

export { DownloadPersonalProfile };
