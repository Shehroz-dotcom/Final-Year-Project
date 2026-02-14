import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const adminAuth = (req, res) => {
  try {
    const token = req.cookies?.adminAccesToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Not authorized, please login',
      });
    }

    const decoded = JwtDecode(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded._id) {
      return res.status(403).json({
        success: false,
        authenticated: false,
        message: 'Invalid token payload',
      });
    }

    // 🔴 ROLE CHECK
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        authenticated: false,
        message: 'Access denied. Admins only.',
      });
    }

    // ✅ SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      authenticated: true,
      data: decoded,
    });
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(403).json({
      success: false,
      authenticated: false,
      message: 'Invalid or expired token',
    });
  }
};

export { adminAuth };
