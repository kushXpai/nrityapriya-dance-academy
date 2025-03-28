import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const { method } = req;
  const { publicId } = req.query;

  if (!publicId) {
    return res.status(400).json({ error: 'No publicId provided' });
  }

  try {
    const fullPublicId = `nityapriyavideos/${publicId}`;

    if (method === 'DELETE') {
      try {
        const result = await cloudinary.uploader.destroy(fullPublicId, { resource_type: 'video' });

        if (result.result === 'ok' || result.result === 'not found') {
          res.status(200).json({ 
            message: 'Video deleted successfully', 
            result 
          });
        } else {
          res.status(400).json({ 
            error: 'Failed to delete video', 
            details: result 
          });
        }
      } catch (error) {
        console.error('Detailed Cloudinary Delete Error:', error);

        res.status(500).json({ 
          error: 'Failed to delete video', 
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