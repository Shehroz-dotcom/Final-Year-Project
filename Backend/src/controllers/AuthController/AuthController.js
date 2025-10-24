import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const checkAuth = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
   

    
    
    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Not Authorized, Please Login',
      });
    }

    const decoded = JwtDecode(token); // should throw if invalid

    if (!decoded || !decoded._id) {
      return res.status(403).json({
        success: false,
        authenticated: false,
        message: 'Invalid token payload',
      });
    }
    next();

    // ✅ attach user info to request
    req.userId = decoded._id;
    req.user = decoded;
    return res.status(200).json({
      data: decoded,
    });

    // pass control to next middleware/controller
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(403).json({
      success: false,
      authenticated: false,
      message: 'Invalid or expired token',
    });
  }
};

export { checkAuth };
