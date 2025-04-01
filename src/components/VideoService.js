// src/components/VideoService.js
import { v4 as uuidv4 } from "uuid";
import {
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
    PutCommand,
    DeleteCommand,
    ScanCommand,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, docClient, S3_BUCKET_NAME, DYNAMODB_TABLE_NAME } from "../../aws/aws";

// Generate a unique filename with original extension
export const generateUniqueFileName = (file) => {
    const timestamp = Date.now();
    const uuid = uuidv4();
    const fileExtension = file.name.split(".").pop();
    return `${timestamp}-${uuid}.${fileExtension}`;
};

// Upload file to S3
export const uploadFileToS3 = async (file, key, contentType) => {
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: arrayBuffer,
      ContentType: contentType,
    };
  
    await s3Client.send(new PutObjectCommand(params));
    return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  };

// Get signed URL for temporary access
export const getSignedFileUrl = async (fileKey, expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
};

// Delete file from S3
export const deleteFileFromS3 = async (fileKey) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
    };

    return await s3Client.send(new DeleteObjectCommand(params));
};

// Extract S3 key from full URL
export const extractKeyFromUrl = (url) => {
    const urlObj = new URL(url);
    // Remove the leading slash
    return urlObj.pathname.substring(1);
};

// Save video metadata to DynamoDB
export const saveVideoMetadata = async (videoData) => {
    const params = {
        TableName: DYNAMODB_TABLE_NAME,
        Item: {
            id: uuidv4(),
            ...videoData,
            created_at: new Date().toISOString(),
            archived: false,
        },
    };

    await docClient.send(new PutCommand(params));
    return params.Item;
};

// Get all videos from DynamoDB
export const getAllVideos = async (includeArchived = false) => {
    const params = {
        TableName: DYNAMODB_TABLE_NAME,
    };

    const { Items } = await docClient.send(new ScanCommand(params));

    // Filter archived videos if needed
    if (!includeArchived) {
        return Items.filter(video => !video.archived);
    }

    return Items;
};

// Get video by ID
export const getVideoById = async (id) => {
    const params = {
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id },
    };

    const { Item } = await docClient.send(new GetCommand(params));
    return Item;
};

// Delete video (both metadata and files)
export const deleteVideo = async (id, videoUrl, thumbnailUrl) => {
    // Delete metadata from DynamoDB
    const deleteParams = {
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id },
    };

    await docClient.send(new DeleteCommand(deleteParams));

    // Delete files from S3
    try {
        await deleteFileFromS3(extractKeyFromUrl(videoUrl));
        await deleteFileFromS3(extractKeyFromUrl(thumbnailUrl));
    } catch (error) {
        console.error("Error deleting S3 files:", error);
        // Continue with the process even if file deletion fails
    }

    return true;
};

// Archive/unarchive a video
export const updateVideoArchiveStatus = async (id, archived) => {
    const params = {
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id },
        UpdateExpression: "set archived = :archived",
        ExpressionAttributeValues: {
            ":archived": archived,
        },
        ReturnValues: "ALL_NEW",
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
};

export const updateVideoDetails = async (id, updates) => {
    const params = {
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name", // Using ExpressionAttributeNames because 'name' is a reserved word
        },
        ExpressionAttributeValues: {
            ":name": updates.name,
            ":description": updates.description,
        },
        ReturnValues: "ALL_NEW",
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
};