import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const { method } = req;
  const { publicId } = req.query;

  // Log received publicId for debugging
  console.log('Received publicId:', publicId);

  if (!publicId) {
    return res.status(400).json({ error: 'No publicId provided' });
  }

  try {
    // Construct full public ID with folder prefix
    const fullPublicId = `nityapriyaphotos/${publicId}`;
    
    // Log full public ID
    console.log('Full publicId for deletion:', fullPublicId);

    if (method === 'DELETE') {
      try {
        // Attempt to destroy the image
        const result = await cloudinary.uploader.destroy(fullPublicId);

        // Log the result of destroy operation
        console.log('Cloudinary destroy result:', result);

        // Check if deletion was successful
        if (result.result === 'ok' || result.result === 'not found') {
          res.status(200).json({ 
            message: 'Photo deleted successfully', 
            result 
          });
        } else {
          res.status(400).json({ 
            error: 'Failed to delete photo', 
            details: result 
          });
        }
      } catch (error) {
        // Log the full error
        console.error('Detailed Cloudinary Delete Error:', error);

        res.status(500).json({ 
          error: 'Failed to delete photo', 
          details: error.message,
          stack: error.stack
        });
      }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).json({ 
      error: 'Unexpected server error', 
      details: error.message 
    });
  }
}