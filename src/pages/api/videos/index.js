import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
    sizeLimit: '100mb',
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Promisify cloudinary upload
const cloudinaryUpload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Upload a video
async function handleUploadVideo(req, res) {
  const form = formidable({
    keepExtensions: true,
    multiples: true,
    maxFileSize: 100 * 1024 * 1024,
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Ensure the video file exists
    const videoFile = files.file;
    const thumbnailFile = files.thumbnail;

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Read video file as a buffer using fs.promises
    const videoBuffer = await fs.readFile(videoFile.filepath);

    // Extract additional metadata
    const name = fields.name || videoFile.originalFilename;
    const description = fields.description || '';
    const isArchived = fields.isArchived === 'true';

    // Upload video to Cloudinary
    const videoResult = await cloudinaryUpload(videoBuffer, {
      folder: 'nityapriyavideos',
      resource_type: 'video',
      public_id: name ? name.replace(/\s+/g, '-').toLowerCase() : undefined
    });

    // Upload thumbnail if provided
    let thumbnailUrl = null;
    if (thumbnailFile) {
      const thumbnailBuffer = await fs.readFile(thumbnailFile.filepath);
      const thumbnailResult = await cloudinaryUpload(thumbnailBuffer, {
        folder: 'nityapriyavideos/thumbnails',
        resource_type: 'image',
        public_id: `${name}-thumbnail`.replace(/\s+/g, '-').toLowerCase()
      });

      thumbnailUrl = thumbnailResult.secure_url;

      // Delete temp thumbnail file
      await fs.unlink(thumbnailFile.filepath);
    }

    // Delete temp video file
    await fs.unlink(videoFile.filepath);

    // Attach additional metadata to the response
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

// Existing handleGetVideos function (unchanged)
async function handleGetVideos(req, res) {
  try {
    // Fetch Cloudinary videos
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'nityapriyavideos/', // Specify video folder
      max_results: 500,
      resource_type: 'video'
    });

    // Fetch all video metadata from Firestore
    const videosRef = collection(db, 'videos');
    const querySnapshot = await getDocs(videosRef);

    // Create a map of metadata by publicId
    const metadataMap = {};
    querySnapshot.forEach(doc => {
      const data = doc.data();
      metadataMap[data.publicId] = data;
    });

    // Attach metadata to Cloudinary resources
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