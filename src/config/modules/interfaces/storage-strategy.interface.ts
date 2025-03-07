import { ConfigService } from "@nestjs/config";
import { StorageEngine } from "multer";

export interface StorageStrategy {
    getStorage(config: ConfigService): StorageEngine;
}
