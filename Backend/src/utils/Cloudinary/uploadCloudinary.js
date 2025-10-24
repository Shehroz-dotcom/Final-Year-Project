import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      timeout: 60000, //increase timeout ot 60s
    });
    console.log('Uploading:', localFilePath);
    console.log('Exists:', fs.existsSync(localFilePath));

    //delete picture from uploads folder after uploading to clouinary
    fs.unlinkSync(path.resolve(localFilePath)); // clean up local file

    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
    // return just the URL
    //can also send the whote response and the  user can decide what take
  } catch (error) {
    console.error('Cloudinary upload failed: ', {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
      response: error.response,
    });
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw error; // rethrow for visibility
  }
};

export default uploadOnCloudinary;
