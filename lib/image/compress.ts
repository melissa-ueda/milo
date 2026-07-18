import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: 1500,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.78,
  });
}
