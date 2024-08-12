import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { ConfigModule } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    // console.log('admin.apps.length :>> ', admin.apps.length);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: process.env.CLIENT_EMAIL,
          projectId: process.env.PROJECT_ID,
          privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        } as Partial<admin.ServiceAccount>),
        storageBucket: process.env.STORAGE_BUCKET,
      });
    }
    this.storage = admin.storage();
  }
  generateSignedUrlforDownload = (filename: string) => {
    const bucket = this.storage.bucket(); // Get the Bucket instance

    const options: any = {
      version: 'v2',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60,
    };
    return bucket.file(filename).getSignedUrl(options);
  };

  async generateSignedUrl(fileName: string, expiresIn: number = 60 * 60) {
    const bucket = this.storage.bucket(); // Get the Bucket instance
    const options: any = {
      version: 'v4',
      action: 'write', // Use 'read' for download URLs
      // expires: Date.now() + expiresIn * 1000, // 1 hour
    };
    const [url]: any = await bucket.file(fileName).getSignedUrl(options);

    return url;
  }
}
