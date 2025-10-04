import { createCanvas, loadImage, registerFont } from 'canvas';
import typographyConfig from '../config/typography.js';
import path from 'path';
import { getCharacterWidthCache } from './character-width-cache.js';
import TemplateService from './template-service.js';
import TextProcessingService from './text-processing-service.js';
import { CANVAS_CONFIG, FONTS, TEXT_SHADOW } from '../config/constants.js';
import { ImageGenerationError, TemplateError, FontError } from './error-handler.js';

class ImageGenerator {
  constructor() {
    this.templatePath = '/public/templates/';
    this.templateMapping = TemplateService.getTemplateMapping();
    this.registerFonts();
  }

  registerFonts() {
    try {
      // Register Jost fonts
      registerFont(path.join(process.cwd(), FONTS.PATHS.JOST_MEDIUM), { 
        family: FONTS.FAMILIES.JOST_MEDIUM 
      });
      registerFont(path.join(process.cwd(), FONTS.PATHS.JOST_BOLD), { 
        family: FONTS.FAMILIES.JOST_BOLD 
      });
      registerFont(path.join(process.cwd(), FONTS.PATHS.CRIMSON_REGULAR), { 
        family: FONTS.FAMILIES.CRIMSON_REGULAR 
      });
    } catch (error) {
      throw new FontError('Font registration failed', 'all', error);
    }
  }

  async generateImage(text, template = 'template1') {
    try {
      // Load template based on template name
      const templateImage = await this.loadTemplate(template);
      
      // Parse text segments
      const textSegments = TextProcessingService.parseTextWithLineBreaks(text);
      
      // Generate images for each segment using the same typography config
      const images = [];
      for (const segment of textSegments) {
        const imageBuffer = await this.createImageWithText(segment, templateImage);
        images.push(imageBuffer);
      }
      
      return images;
    } catch (error) {
      if (error instanceof ImageGenerationError || error instanceof TemplateError || error instanceof FontError) {
        throw error;
      }
      throw new ImageGenerationError(`Image generation failed: ${error.message}`, 'GENERATION_FAILED', error);
    }
  }

  async loadTemplate(templateName) {
    try {
      const templateFile = this.templateMapping[templateName] || TemplateService.getTemplateFileName('template1');
      return await loadImage(path.join(process.cwd(), this.templatePath + templateFile));
    } catch (error) {
      throw new TemplateError(`Failed to load template: ${templateName}`, templateName, error);
    }
  }

  async createImageWithText(text, templateImage) {
    // Create canvas
    const canvas = createCanvas(CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // Draw template background
    ctx.drawImage(templateImage, 0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
    
    // Apply typography and render text
    const config = typographyConfig.template1;
    this.applyTypography(ctx, text, config, CANVAS_CONFIG.WIDTH);
    
    return canvas.toBuffer('image/png');
  }

  applyTypography(ctx, text, config, canvasWidth) {
    // Set text alignment and baseline
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Apply text shadow
    this.addTextShadow(ctx);
    
    // Calculate text positioning
    const maxWidth = canvasWidth * config.layout.maxWidth;
    const x = canvasWidth / 2;
    const y = canvasWidth * config.layout.marginTop;
    
    // Parse text for bold formatting and render
    this.parseAndRenderText(ctx, text, x, y, maxWidth, config);
  }

  parseAndRenderText(ctx, text, x, y, maxWidth, config) {
    // Parse text for **bold** formatting and split into words
    const words = TextProcessingService.parseBoldText(text);
    const lines = TextProcessingService.wrapTextToLines(words, maxWidth, config);
    
    // Get the pre-computed character width cache
    const charWidthCache = getCharacterWidthCache();
    
    // Render lines
    const lineHeight = config.font.size * config.font.lineHeight;
    const startY = y - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, lineIndex) => {
      let currentX = x;
      const lineY = startY + lineIndex * lineHeight;
      
      // Calculate total width of line for centering
      const lineWidth = TextProcessingService.calculateLineWidth(line, charWidthCache);
      const lineStartX = x - lineWidth / 2;
      currentX = lineStartX;
      
      line.forEach((word, wordIndex) => {
        // Set font based on bold formatting
        const fontConfig = word.bold ? config.boldFont : config.font;
        ctx.font = `${fontConfig.size}px "${fontConfig.family}", "CrimsonText Regular", serif`;
        ctx.fillStyle = fontConfig.color;
        ctx.globalAlpha = fontConfig.opacity;
        
        // Add space before word (except for first word in line)
        if (wordIndex > 0) {
          const spaceWidth = charWidthCache.regular.get(' ');
          currentX += spaceWidth;
        }
        
        // Render word
        ctx.fillText(word.text, currentX, lineY);
        
        // Update X position for next word
        const wordWidth = TextProcessingService.calculateWordWidth(word, charWidthCache);
        currentX += wordWidth;
      });
    });
  }

  addTextShadow(ctx) {
    ctx.shadowColor = TEXT_SHADOW.COLOR;
    ctx.shadowBlur = TEXT_SHADOW.BLUR;
    ctx.shadowOffsetX = TEXT_SHADOW.OFFSET_X;
    ctx.shadowOffsetY = TEXT_SHADOW.OFFSET_Y;
  }
}

export default ImageGenerator;
