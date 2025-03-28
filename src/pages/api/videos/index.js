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
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload a video
async function handleUploadVideo(req, res) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      multiples: true,
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
        // Ensure the video file exists
        const videoFile = files.file;
        const thumbnailFile = files.thumbnail;

        if (!videoFile) {
          res.status(400).json({ error: 'No video file uploaded' });
          return resolve();
        }

        // Read video file as a buffer
        const videoBuffer = fs.readFileSync(videoFile.filepath);

        // Extract additional metadata
        const name = fields.name || videoFile.originalFilename;
        const description = fields.description || '';
        const isArchived = fields.isArchived === 'true';

        // Upload video to Cloudinary
        const videoResult = await new Promise((uploadResolve, uploadReject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'nityapriyavideos',
              resource_type: 'video',
              public_id: name ? name.replace(/\s+/g, '-').toLowerCase() : undefined
            }, 
            (error, result) => {
              if (error) uploadReject(error);
              else uploadResolve(result);
            }
          );
          uploadStream.end(videoBuffer);
        });

        // Upload thumbnail if provided
        let thumbnailUrl = null;
        if (thumbnailFile) {
          const thumbnailBuffer = fs.readFileSync(thumbnailFile.filepath);
          const thumbnailResult = await new Promise((uploadResolve, uploadReject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { 
                folder: 'nityapriyavideos/thumbnails',
                resource_type: 'image',
                public_id: `${name}-thumbnail`.replace(/\s+/g, '-').toLowerCase()
              }, 
              (error, result) => {
                if (error) uploadReject(error);
                else uploadResolve(result);
              }
            );
            uploadStream.end(thumbnailBuffer);
          });

          thumbnailUrl = thumbnailResult.secure_url;

          // Optional: Delete temp thumbnail file
          fs.unlinkSync(thumbnailFile.filepath);
        }

        // Optional: Delete temp video file
        fs.unlinkSync(videoFile.filepath);

        // Attach additional metadata to the response
        const enhancedResult = {
          ...videoResult,
          name,
          description,
          isArchived,
          thumbnailUrl
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

// Existing handleGetVideos function remains the same
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