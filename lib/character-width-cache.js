const { createCanvas } = require('canvas');
const typographyConfig = require('../config/typography');

// Pre-computed character width cache for template1
// This is created once at module load time for optimal performance
const CHARACTER_WIDTH_CACHE = (() => {
  const config = typographyConfig.template1;
  
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
})();

// Fallback canvas for measuring uncached characters
const FALLBACK_CANVAS = createCanvas(1, 1);
const FALLBACK_CTX = FALLBACK_CANVAS.getContext('2d');

// Font configurations for fallback measurements
const FONT_CONFIGS = {
  regular: {
    family: 'Jost Medium',
    size: 42
  },
  bold: {
    family: 'Jost Bold',
    size: 42
  }
};

/**
 * Get the pre-computed character width cache
 * @returns {Object} Character width cache with regular and bold maps
 */
function getCharacterWidthCache() {
  return CHARACTER_WIDTH_CACHE;
}

/**
 * Calculate width of a word using the character width cache
 * @param {Object} word - Word object with text and bold properties
 * @param {Object} charWidthCache - Character width cache
 * @returns {number} Word width in pixels
 */
function calculateWordWidth(word, charWidthCache) {
  const cache = word.bold ? charWidthCache.bold : charWidthCache.regular;
  let totalWidth = 0;
  
  for (const char of word.text) {
    const charWidth = cache.get(char);
    if (charWidth !== undefined) {
      totalWidth += charWidth;
    } else {
      // Fallback: measure character if not in cache
      const fontConfig = word.bold ? FONT_CONFIGS.bold : FONT_CONFIGS.regular;
      FALLBACK_CTX.font = `${fontConfig.size}px "${fontConfig.family}", "CrimsonText Regular", serif`;
      totalWidth += FALLBACK_CTX.measureText(char).width;
    }
  }
  
  return totalWidth;
}

/**
 * Calculate total width of a line of words
 * @param {Array} words - Array of word objects
 * @param {Object} charWidthCache - Character width cache
 * @returns {number} Total line width in pixels
 */
function calculateLineWidth(words, charWidthCache) {
  let totalWidth = 0;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    totalWidth += calculateWordWidth(word, charWidthCache);
    
    // Add space width between words (except for last word)
    if (i < words.length - 1) {
      totalWidth += charWidthCache.regular.get(' ');
    }
  }
  
  return totalWidth;
}

module.exports = {
  getCharacterWidthCache,
  calculateWordWidth,
  calculateLineWidth
};
