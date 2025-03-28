import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
    sizeLimit: '100mb',
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryDirectUpload = (file, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

async function handleUploadVideo(req, res) {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    multiples: true,
    maxFileSize: 100 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    try {
      const videoFile = files.file;
      const thumbnailFile = files.thumbnail;

      if (!videoFile) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }

      const name = fields.name || videoFile.originalFilename;
      const description = fields.description || '';
      const isArchived = fields.isArchived === 'true';

      const videoUploadOptions = {
        folder: 'nityapriyavideos',
        resource_type: 'video',
        public_id: name ? name.replace(/\s+/g, '-').toLowerCase() : undefined
      };

      const videoResult = await cloudinaryDirectUpload(
        videoFile.filepath, 
        videoUploadOptions
      );

      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbnailUploadOptions = {
          folder: 'nityapriyavideos/thumbnails',
          resource_type: 'image',
          public_id: `${name}-thumbnail`.replace(/\s+/g, '-').toLowerCase()
        };

        const thumbnailResult = await cloudinaryDirectUpload(
          thumbnailFile.filepath, 
          thumbnailUploadOptions
        );

        thumbnailUrl = thumbnailResult.secure_url;
      }

      const enhancedResult = {
        ...videoResult,
        name,
        description,
        isArchived,
        thumbnailUrl
      };

      res.status(200).json(enhancedResult);
    } catch (uploadError) {
      console.error('Cloudinary Upload Error:', uploadError);
      res.status(500).json({
        error: 'Upload to Cloudinary failed',
        details: uploadError.message
      });
    }
  });
}

async function handleGetVideos(req, res) {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'nityapriyavideos/', 
      max_results: 500,
      resource_type: 'video'
    });

    const videosRef = collection(db, 'videos');
    const querySnapshot = await getDocs(videosRef);

    const metadataMap = {};
    querySnapshot.forEach(doc => {
      const data = doc.data();
      metadataMap[data.publicId] = data;
    });

    const videosWithMetadata = result.resources.map(video => ({
      ...video,
      metadata: metadataMap[video.public_id] || {}
    }));

    res.status(200).json(videosWithMetadata);
  } catch (error) {
    console.error('Get Videos Error:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
      details: error.message
    });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGetVideos(req, res);
        break;
      case 'POST':
        await handleUploadVideo(req, res);
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