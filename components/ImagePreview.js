import { useState } from 'react';
import DownloadService from '../lib/download-service.js';

export default function ImagePreview({ images, template }) {
  const [downloading, setDownloading] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const handleDownloadImage = (image, index) => {
    const filename = DownloadService.generateFilename(template, index, images.length);
    DownloadService.downloadImage(image.data, filename);
  };

  const handleDownloadAll = () => {
    setDownloading(true);
    const baseFilename = `quote-${template.replace('template', '')}-${new Date().toISOString().slice(0, 10)}`;
    DownloadService.downloadAllAsZip(images, baseFilename);
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="image-preview">
      <div className="image-preview-header">
        <h3>Generated Images ({images.length})</h3>
        <button 
          onClick={handleDownloadAll}
          disabled={downloading}
          className="download-all-btn"
        >
          {downloading ? 'Downloading...' : 'Download All'}
        </button>
      </div>
      
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={image.id} className="image-item">
            <div className="image-container">
              <img 
                src={`data:${image.mimeType};base64,${image.data}`}
                alt={`Generated quote ${index + 1}`}
                className="generated-image"
              />
            </div>
            <button 
              onClick={() => handleDownloadImage(image, index)}
              className="download-btn"
            >
              Download Image {index + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
