const saveNutrition = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const token = req.cookies?.accessToken;

    console.log('token:', token);
    console.log('cartItems:', cartItems);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export {saveNutrition}