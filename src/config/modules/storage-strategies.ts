import * as fs from 'fs';
import * as multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { StorageEngine } from "multer";
import { diskStorage } from "multer";
import { StorageStrategy } from "./interfaces/storage-strategy.interface";
import { Request } from 'express';
import { APP_DEFAULTS } from '../constants/app.constants';

export const s3Strategy: StorageStrategy = {
  getStorage: (config: ConfigService): StorageEngine => multerS3({
    s3: new S3Client({
      region: config.get('AWS_REGION'),
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY') || ''
      }
    }),
    bucket: config.get<string>('AWS_S3_BUCKET') || '',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: Request, file, cb) => {
      const ext = file.originalname.split('.')[1]
      const url = req.originalUrl;
      const endpointName = url
        .replace(APP_DEFAULTS.GLOBAL_PREFIX, '')
        .split('/')
        .filter(Boolean)[0];
      const uniqueSuffix = Date.now().toString() + Math.round(Math.random() * 1E9);
      const filePath = `${endpointName}/${uniqueSuffix}.${ext}`;

      cb(null, filePath);
    }
  })
}

export const localStrategy: StorageStrategy = {
  getStorage: (config: ConfigService): StorageEngine => diskStorage({
    destination: (req, file, cb) => {
      const { id } = req.params;
      const url = req.originalUrl;
      const endpointName = url
          .replace(APP_DEFAULTS.GLOBAL_PREFIX, '')
          .split('/')
          .filter(Boolean)[0]
          .toUpperCase();
      
      const uploadPath = `${config.get<string>(`UPLOAD_${endpointName}_PATH`)}/${id}`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.')[1];
      const uniqueSuffix = Date.now().toString() + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}.${ext}`);
    }
  })
}
