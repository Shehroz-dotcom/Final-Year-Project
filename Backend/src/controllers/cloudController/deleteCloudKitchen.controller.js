import CloudKitchenModel from '../../models/cloudKitchen.model.js';

const deleteCloudKitchen = async (req, res) => {
  try {
    const { branch_code } = req.body;

    // 1. Validate input
    if (!branch_code) {
      return res.status(400).json({
        success: false,
        message: 'branch_code is required',
      });
    }

    // 2. Find & delete
    const deletedKitchen = await CloudKitchenModel.findOneAndDelete({
      branch_code,
    });

    // 3. Handle not found
    if (!deletedKitchen) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen not found',
      });
    }

    // 4. Success response
    return res.status(200).json({
      success: true,
      message: 'Kitchen deleted successfully',
      data: deletedKitchen,
    });
  } catch (error) {
    console.error('Delete kitchen error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { deleteCloudKitchen };
