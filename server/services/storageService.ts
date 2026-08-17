import path from 'path';
import fs from 'fs';

export interface UploadedFileMeta {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedAt: string;
}

export const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

class StorageService {
  constructor() {
    this.ensureUploadDirectories();
  }

  private ensureUploadDirectories() {
    const subdirs = ['avatars', 'images', 'videos', 'documents'];
    for (const dir of subdirs) {
      const fullPath = path.join(UPLOADS_DIR, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  /**
   * Process and save avatar file
   */
  async saveAvatar(file: Express.Multer.File): Promise<UploadedFileMeta> {
    const fileExt = path.extname(file.originalname) || '.png';
    const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const destinationPath = path.join(UPLOADS_DIR, 'avatars', fileName);

    if (file.buffer) {
      await fs.promises.writeFile(destinationPath, file.buffer);
    }

    const publicUrl = `/uploads/avatars/${fileName}`;
    return {
      fileId: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      url: publicUrl,
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Future Image Upload Architecture
   */
  async saveImage(file: Express.Multer.File): Promise<UploadedFileMeta> {
    const fileExt = path.extname(file.originalname) || '.jpg';
    const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const destinationPath = path.join(UPLOADS_DIR, 'images', fileName);

    if (file.buffer) {
      await fs.promises.writeFile(destinationPath, file.buffer);
    }

    return {
      fileId: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      url: `/uploads/images/${fileName}`,
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Future Video Upload Architecture
   */
  async saveVideo(file: Express.Multer.File): Promise<UploadedFileMeta> {
    const fileExt = path.extname(file.originalname) || '.mp4';
    const fileName = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const destinationPath = path.join(UPLOADS_DIR, 'videos', fileName);

    if (file.buffer) {
      await fs.promises.writeFile(destinationPath, file.buffer);
    }

    return {
      fileId: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      url: `/uploads/videos/${fileName}`,
      uploadedAt: new Date().toISOString(),
    };
  }
}

export const storageService = new StorageService();
