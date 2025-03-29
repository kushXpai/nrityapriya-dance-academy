// 1. First, create a new API endpoint to generate a signature
// pages/api/videos/signature.js

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get parameters from request
    const { folder, publicId, timestamp } = req.body;
    
    // Generate the signature
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: folder || 'nityapriyavideos',
      public_id: publicId,
    }, process.env.CLOUDINARY_API_SECRET);

    // Return the signature and other necessary parameters
    return res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return res.status(500).json({ error: 'Failed to generate signature' });
  }
}