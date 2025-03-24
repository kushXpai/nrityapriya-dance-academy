import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
  });
}

const adminDB = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDB, adminAuth, adminStorage };
