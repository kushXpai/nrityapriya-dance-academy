import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGetPhotos(req, res);
        break;
      case 'POST':
        await handleUploadPhoto(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}

// Get all photos
async function handleGetPhotos(req, res) {
    try {
      // Fetch Cloudinary photos
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'nityapriyaphotos/', // Optional: specify a folder
        max_results: 500
      });
  
      // Fetch all photo metadata from Firestore
      const photosRef = collection(db, 'photos');
      const querySnapshot = await getDocs(photosRef);
      
      // Create a map of metadata by publicId
      const metadataMap = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        metadataMap[data.publicId] = data;
      });
  
      // Attach metadata to Cloudinary resources
      const photosWithMetadata = result.resources.map(photo => ({
        ...photo,
        metadata: metadataMap[photo.public_id] || {}
      }));
  
      res.status(200).json(photosWithMetadata);
    } catch (error) {
      console.error('Get Photos Error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch photos', 
        details: error.message 
      });
    }
  }

// Upload a photo
async function handleUploadPhoto(req, res) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form Parse Error:', err);
        res.status(500).json({ 
          error: 'File upload failed', 
          details: err.message 
        });
        return resolve();
      }

      try {
        // Ensure the file exists
        const file = files.file;
        if (!file) {
          res.status(400).json({ error: 'No file uploaded' });
          return resolve();
        }

        // Extract additional metadata
        const name = fields.name || file.originalFilename;
        const description = fields.description || '';
        const isArchived = fields.isArchived === 'true';

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'nityapriyaphotos',
          resource_type: 'auto',
          public_id: name ? name.replace(/\s+/g, '-').toLowerCase() : undefined
        });

        // Optional: Remove temporary file
        try {
          fs.unlinkSync(file.filepath);
        } catch (unlinkError) {
          console.warn('Failed to delete temporary file:', unlinkError);
        }

        // Attach additional metadata to the response
        const enhancedResult = {
          ...result,
          name,
          description,
          isArchived
        };

        res.status(200).json(enhancedResult);
        resolve();
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        res.status(500).json({ 
          error: 'Upload to Cloudinary failed', 
          details: uploadError.message 
        });
        resolve();
      }
    });
  });
}