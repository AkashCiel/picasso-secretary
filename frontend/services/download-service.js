// Client-side download service for images
import { DOWNLOAD } from '../../shared/constants/index.js';

class DownloadService {
  static downloadImage(imageData, filename) {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: DOWNLOAD.MIME_TYPE });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error downloading image:', error);
      return false;
    }
  }

  static downloadAllAsZip(images, baseFilename = DOWNLOAD.DEFAULT_FILENAME) {
    // For now, download images individually
    // In a production app, you might want to use a library like JSZip
    images.forEach((image, index) => {
      const filename = `${baseFilename}-${index + 1}${DOWNLOAD.FILE_EXTENSION}`;
      this.downloadImage(image.data, filename);
    });
  }

  static generateFilename(template, index, total) {
    const templateName = template.replace('template', '');
    const timestamp = new Date().toISOString().slice(0, 10);
    return `quote-${templateName}-${timestamp}-${index + 1}${DOWNLOAD.FILE_EXTENSION}`;
  }
}

export default DownloadService;
