import { auth } from '../server';

export interface FileUploadConfig {
  maxFileSize?: number;
  allowedTypes?: string[];
  customPath?: (userId: string, filename: string) => string;
}

export const uploadFileToR2 = async (
  file: File | Buffer,
  userId: string,
  config?: FileUploadConfig
) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    customPath,
  } = config || {};

  // Validate file size
  const fileSize = file instanceof File ? file.size : file.length;
  if (fileSize > maxFileSize) {
    throw new Error(`File size exceeds maximum of ${maxFileSize} bytes`);
  }

  // Validate file type for File objects
  if (file instanceof File && !allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }

  // Generate file path
  const filename = file instanceof File ? file.name : `upload-${Date.now()}`;
  const filePath = customPath 
    ? customPath(userId, filename)
    : `users/${userId}/${Date.now()}-${filename}`;

  try {
    // Use better-auth-cloudflare's R2 upload functionality
    const uploadResult = await auth.api.uploadFile({
      file,
      path: filePath,
      userId,
    });

    return {
      success: true,
      fileId: uploadResult.id,
      url: uploadResult.url,
      path: filePath,
      size: fileSize,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file to R2');
  }
};

export const deleteFileFromR2 = async (fileId: string, userId: string) => {
  try {
    await auth.api.deleteFile({
      fileId,
      userId,
    });
    return { success: true };
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error('Failed to delete file from R2');
  }
};

export const getFileUrl = async (fileId: string, userId: string) => {
  try {
    const result = await auth.api.getFileUrl({
      fileId,
      userId,
    });
    return result.url;
  } catch (error) {
    console.error('Get file URL error:', error);
    throw new Error('Failed to get file URL');
  }
};