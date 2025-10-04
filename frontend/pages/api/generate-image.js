import ImageGenerator from '../../../backend/services/image-generator.js';
import { handleApiError, validateText, validateTemplate } from '../../../backend/errors/error-handler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { text, template = 'template1' } = req.body;
    
    // Validate input
    validateText(text);
    validateTemplate(template);
    
    // Generate images
    const imageGenerator = new ImageGenerator();
    const imageBuffers = await imageGenerator.generateImage(text, template);
    
    // Convert all images to base64
    const base64Images = imageBuffers.map((buffer, index) => ({
      id: index + 1,
      data: buffer.toString('base64'),
      mimeType: 'image/png'
    }));
    
    res.status(200).json({ 
      success: true, 
      message: `Generated ${imageBuffers.length} image(s)`,
      imageCount: imageBuffers.length,
      images: base64Images
    });
  } catch (error) {
    return handleApiError(error, res);
  }
}
