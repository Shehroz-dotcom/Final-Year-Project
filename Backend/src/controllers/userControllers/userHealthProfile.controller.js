import jwt from 'jsonwebtoken';
import userModel from '../../models/user.model.js';

const userHealthProfile = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded._id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ INCLUDE age & weight
    const { age, weight, dietType, spiceTolerance, allergies, goals, avoid } =
      req.body;

    console.log('Saving health profile:', req.body);

    // ⚠️ Convert to numbers (important, don't trust frontend)
    user.healthProfile = {
      age: Number(age),
      weight: Number(weight),
      dietType,
      spiceTolerance,
      allergies,
      goals,
      avoid,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Health profile saved successfully',
      data: user.healthProfile,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export { userHealthProfile };
