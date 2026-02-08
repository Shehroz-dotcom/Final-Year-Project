const logOut = async (req, res) => {
  try {
    //clear cloud tokens
    res.clearCookie('cloudAccessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.clearCookie('cloudRefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      success: true,
      message: 'cloud  logged out successfully',
    });
  } catch (error) {
    console.error('logout error', error);
    return res.status(500).json({
      success: false,
      message: 'cloud logout failed please try again ',
    });
  }
};

export { logOut };
