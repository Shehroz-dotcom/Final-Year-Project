import CloudKitchenModel from '../../models/cloudKitchen.model.js';

const getAllKitchens = async (req, res) => {
  try {
    const kitchens = await CloudKitchenModel.find().lean();
    console.log('get all kitchens ', kitchens);

    return res.status(200).json({
      success: true,
      count: kitchens.length,
      data: kitchens,
    });
  } catch (error) {
    console.error('Error fetching kitchens:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch kitchens',
    });
  }
};

export { getAllKitchens };
