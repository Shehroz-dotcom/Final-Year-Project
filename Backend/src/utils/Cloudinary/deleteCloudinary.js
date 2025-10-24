import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//delete from cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error('No public_id provided for deletion.');
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'image', // change if needed (video/raw)
    });

    if (result.result === 'not found') {
      console.warn(
        `Image with public_id "${public_id}" was not found on Cloudinary.`
      );
    } 

    return result;
  } catch (error) {
    console.error('Error deleting the photo from Cloudinary:', error);
    throw error;
  }
};
export default deleteFromCloudinary