const { createCanvas, loadImage, registerFont } = require('canvas');
const typographyConfig = require('../config/typography');
const path = require('path');

class ImageGenerator {
  constructor() {
    this.templatePath = '/public/templates/';
    this.templateMapping = {
      template1: 'theme-01.png',
      template2: 'theme-02.png', 
      template3: 'theme-03.png',
      template4: 'theme-04.png',
      template5: 'theme-05.png',
      template6: 'theme-06.png'
    };
    this.registerFonts();
  }

  registerFonts() {
    try {
      // Register Jost fonts
      registerFont(path.join(process.cwd(), 'public/font/Jost-Medium.ttf'), { 
        family: 'Jost Medium' 
      });
      registerFont(path.join(process.cwd(), 'public/font/Jost-Bold.ttf'), { 
        family: 'Jost Bold' 
      });
      registerFont(path.join(process.cwd(), 'public/font/CrimsonText-Regular.ttf'), { 
        family: 'CrimsonText Regular' 
      });
    } catch (error) {
      console.warn('Font registration failed:', error.message);
    }
  }

  async generateImage(text, template = 'template1') {
    try {
      // Load template based on template name
      const templateImage = await this.loadTemplate(template);
      
      // Parse text segments
      const textSegments = this.parseTextWithLineBreaks(text);
      
      // Generate images for each segment using the same typography config
      const images = [];
      for (const segment of textSegments) {
        const imageBuffer = await this.createImageWithText(segment, templateImage);
        images.push(imageBuffer);
      }
      
      return images;
    } catch (error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  async loadTemplate(templateName) {
    const templateFile = this.templateMapping[templateName] || 'theme-01.png';
    return await loadImage(path.join(process.cwd(), this.templatePath + templateFile));
  }

  parseTextWithLineBreaks(text) {
    return text.split('---').map(segment => segment.trim()).filter(segment => segment.length > 0);
  }

  async createImageWithText(text, templateImage) {
    // Create canvas
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');
    
    // Draw template background
    ctx.drawImage(templateImage, 0, 0, 1080, 1080);
    
    // Apply typography and render text
    const config = typographyConfig.template1;
    this.applyTypography(ctx, text, config, 1080);
    
    return canvas.toBuffer('image/png');
  }

  applyTypography(ctx, text, config, canvasWidth) {
    // Set text alignment and baseline
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Apply text shadow
    this.addTextShadow(ctx);
    
    // Calculate text positioning
    const maxWidth = canvasWidth * config.layout.maxWidth;
    const x = canvasWidth / 2;
    const y = 1080 * config.layout.marginTop;
    
    // Parse text for bold formatting and render
    this.parseAndRenderText(ctx, text, x, y, maxWidth, config);
  }

  parseAndRenderText(ctx, text, x, y, maxWidth, config) {
    // Parse text for **bold** formatting
    const parts = this.parseBoldText(text);
    const lines = this.wrapTextToLines(parts, maxWidth, config);
    
    // Render lines
    const lineHeight = config.font.size * config.font.lineHeight;
    const startY = y - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, lineIndex) => {
      let currentX = x;
      const lineY = startY + lineIndex * lineHeight;
      
      line.forEach((part, partIndex) => {
        // Set font based on bold formatting
        const fontConfig = part.bold ? config.boldFont : config.font;
        ctx.font = `${fontConfig.size}px "${fontConfig.family}", "CrimsonText Regular", serif`;
        ctx.fillStyle = fontConfig.color;
        ctx.globalAlpha = fontConfig.opacity;
        
        // Render text part
        ctx.fillText(part.text, currentX, lineY);
        
        // Update X position for next part
        const metrics = ctx.measureText(part.text);
        currentX += metrics.width;
      });
    });
  }

  parseBoldText(text) {
    // Parse **bold** text formatting
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          bold: false
        });
      }
      
      // Add bold text
      parts.push({
        text: match[1],
        bold: true
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        bold: false
      });
    }
    
    return parts;
  }

  wrapTextToLines(parts, maxWidth, config) {
    const lines = [];
    let currentLine = [];
    
    for (const part of parts) {
      const testLine = [...currentLine, part];
      const testWidth = this.calculateLineWidth(testLine, config);
      
      if (testWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [part];
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  calculateLineWidth(parts, config) {
    // Create a temporary canvas context to measure text accurately
    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    
    let totalWidth = 0;
    for (const part of parts) {
      const fontConfig = part.bold ? config.boldFont : config.font;
      tempCtx.font = `${fontConfig.size}px "${fontConfig.family}", "CrimsonText Regular", serif`;
      const metrics = tempCtx.measureText(part.text);
      totalWidth += metrics.width;
    }
    return totalWidth;
  }

  addTextShadow(ctx) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

module.exports = ImageGenerator;
