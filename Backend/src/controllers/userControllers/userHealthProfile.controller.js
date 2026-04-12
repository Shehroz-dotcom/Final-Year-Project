import jwt from 'jsonwebtoken';
import userModel from '../../models/user.model.js';

const userHealthProfile = async (req, res) => {
  try {
    // 1. Get token
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded._id;

    // 3. Find user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Get data from frontend
    const { dietType, spiceTolerance, allergies, goals, avoid } = req.body;

    console.log('Saving health profile:', req.body);

    // 5. SAVE INTO MONGODB (IMPORTANT PART)
    user.healthProfile = {
      dietType,
      spiceTolerance,
      allergies,
      goals,
      avoid,
    };

    await user.save(); // <-- THIS ACTUALLY WRITES TO DB

    // 6. Response
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
