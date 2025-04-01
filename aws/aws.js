// aws/aws.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

// AWS Configuration
const region = process.env.NEXT_PUBLIC_AWS_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

// Initialize S3 Client
export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Initialize DynamoDB Client
const dynamoClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Create the document client interface for DynamoDB
export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Constants
export const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
export const DYNAMODB_TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;

// Creatig custom policy is left
// {
//     "Version": "2012-10-17",
//     "Statement": [
//       {
//         "Effect": "Allow",
//         "Action": [
//           "s3:PutObject",
//           "s3:GetObject",
//           "s3:DeleteObject",
//           "s3:ListBucket"
//         ],
//         "Resource": [
//           "arn:aws:s3:::your-bucket-name",
//           "arn:aws:s3:::your-bucket-name/*"
//         ]
//       },
//       {
//         "Effect": "Allow",
//         "Action": [
//           "dynamodb:PutItem",
//           "dynamodb:GetItem",
//           "dynamodb:UpdateItem",
//           "dynamodb:DeleteItem",
//           "dynamodb:Scan",
//           "dynamodb:Query"
//         ],
//         "Resource": "arn:aws:dynamodb:your-region:your-account-id:table/your-table-name"
//       }
//     ]
//   }