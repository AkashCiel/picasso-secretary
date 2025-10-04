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
    ctx.textAlign = 'left';
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
    // Parse text for **bold** formatting and split into words
    const words = this.parseBoldText(text);
    const lines = this.wrapTextToLines(words, maxWidth, config);
    
    // Render lines
    const lineHeight = config.font.size * config.font.lineHeight;
    const startY = y - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, lineIndex) => {
      let currentX = x;
      const lineY = startY + lineIndex * lineHeight;
      
      // Calculate total width of line for centering
      const charWidthCache = this.createCharacterWidthCache(config);
      const lineWidth = this.calculateLineWidth(line, charWidthCache);
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
          const spaceWidth = ctx.measureText(' ').width;
          currentX += spaceWidth;
        }
        
        // Render word
        ctx.fillText(word.text, currentX, lineY);
        
        // Update X position for next word
        const metrics = ctx.measureText(word.text);
        currentX += metrics.width;
      });
    });
  }

  parseBoldText(text) {
    // Parse **bold** text formatting and split into words
    const words = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add words before bold
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        const wordsBefore = textBefore.split(' ').filter(w => w.length > 0);
        words.push(...wordsBefore.map(word => ({ text: word, bold: false })));
      }
      
      // Add bold words
      const boldWords = match[1].split(' ').filter(w => w.length > 0);
      words.push(...boldWords.map(word => ({ text: word, bold: true })));
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining words
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const remainingWords = remainingText.split(' ').filter(w => w.length > 0);
      words.push(...remainingWords.map(word => ({ text: word, bold: false })));
    }
    
    return words;
  }

  wrapTextToLines(words, maxWidth, config) {
    // Create character width cache for performance
    const charWidthCache = this.createCharacterWidthCache(config);
    
    // Greedy line-filling algorithm
    const lines = [];
    let currentLine = [];
    let remainingWidth = maxWidth;
    
    for (const word of words) {
      // Calculate word width using appropriate font
      const wordWidth = this.calculateWordWidth(word, charWidthCache);
      const spaceWidth = charWidthCache.regular.get(' '); // Space width
      
      if (wordWidth <= remainingWidth) {
        // Add word to current line
        currentLine.push(word);
        remainingWidth -= wordWidth;
        
        // Add space if there's room and not last word
        if (remainingWidth >= spaceWidth) {
          remainingWidth -= spaceWidth;
        }
      } else {
        // Start new line
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [word];
        remainingWidth = maxWidth - wordWidth;
        
        // Add space if there's room
        if (remainingWidth >= spaceWidth) {
          remainingWidth -= spaceWidth;
        }
      }
    }
    
    // Add final line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  createCharacterWidthCache(config) {
    // Create a temporary canvas to measure character widths
    const tempCanvas = createCanvas(1, 1);
    const regularCtx = tempCanvas.getContext('2d');
    const boldCtx = tempCanvas.getContext('2d');
    
    // Set up fonts
    regularCtx.font = `${config.font.size}px "${config.font.family}", "CrimsonText Regular", serif`;
    boldCtx.font = `${config.boldFont.size}px "${config.boldFont.family}", "CrimsonText Regular", serif`;
    
    // Create character width maps
    const regularCache = new Map();
    const boldCache = new Map();
    
    // Common characters to measure
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,:;!?\'"()-_[]{}@#$%^&*+=<>/\\|`~';
    
    for (const char of characters) {
      regularCache.set(char, regularCtx.measureText(char).width);
      boldCache.set(char, boldCtx.measureText(char).width);
    }
    
    return { regular: regularCache, bold: boldCache };
  }

  calculateWordWidth(word, charWidthCache) {
    const cache = word.bold ? charWidthCache.bold : charWidthCache.regular;
    let totalWidth = 0;
    
    for (const char of word.text) {
      const charWidth = cache.get(char);
      if (charWidth !== undefined) {
        totalWidth += charWidth;
      } else {
        // Fallback: measure character if not in cache
        const tempCanvas = createCanvas(1, 1);
        const tempCtx = tempCanvas.getContext('2d');
        const fontConfig = word.bold ? this.getBoldFontConfig() : this.getRegularFontConfig();
        tempCtx.font = `${fontConfig.size}px "${fontConfig.family}", "CrimsonText Regular", serif`;
        totalWidth += tempCtx.measureText(char).width;
      }
    }
    
    return totalWidth;
  }

  getRegularFontConfig() {
    return {
      family: 'Jost Medium',
      size: 42
    };
  }

  getBoldFontConfig() {
    return {
      family: 'Jost Bold',
      size: 42
    };
  }

  calculateLineWidth(words, charWidthCache) {
    let totalWidth = 0;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      totalWidth += this.calculateWordWidth(word, charWidthCache);
      
      // Add space width between words (except for last word)
      if (i < words.length - 1) {
        totalWidth += charWidthCache.regular.get(' ');
      }
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
