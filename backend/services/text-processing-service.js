// Text processing service for handling text parsing and formatting
import { getCharacterWidthCache, calculateWordWidth, calculateLineWidth } from '../utils/character-width-cache.js';

class TextProcessingService {
  /**
   * Parse text for **bold** formatting and split into words
   * @param {string} text - Input text with **bold** markers
   * @returns {Array} Array of word objects with text and bold properties
   */
  static parseBoldText(text) {
    const words = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add words before bold
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        const wordsBefore = this._splitIntoWords(textBefore);
        words.push(...wordsBefore.map(word => ({ text: word, bold: false })));
      }
      
      // Add bold words
      const boldWords = this._splitIntoWords(match[1]);
      words.push(...boldWords.map(word => ({ text: word, bold: true })));
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining words
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const remainingWords = this._splitIntoWords(remainingText);
      words.push(...remainingWords.map(word => ({ text: word, bold: false })));
    }
    
    return words;
  }

  /**
   * Split text into words, filtering out empty strings
   * @param {string} text - Text to split
   * @returns {Array} Array of non-empty words
   * @private
   */
  static _splitIntoWords(text) {
    return text.split(' ').filter(w => w.length > 0);
  }

  /**
   * Wrap words to lines based on maximum width
   * @param {Array} words - Array of word objects
   * @param {number} maxWidth - Maximum line width in pixels
   * @param {Object} config - Typography configuration
   * @returns {Array} Array of lines, each containing word objects
   */
  static wrapTextToLines(words, maxWidth, config) {
    const charWidthCache = getCharacterWidthCache();
    const lines = [];
    let currentLine = [];
    let remainingWidth = maxWidth;
    
    for (const word of words) {
      const wordWidth = calculateWordWidth(word, charWidthCache);
      const spaceWidth = charWidthCache.regular.get(' ');
      
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

  /**
   * Calculate text positioning for centering
   * @param {Array} lines - Array of lines to position
   * @param {number} canvasWidth - Canvas width
   * @param {Object} config - Typography configuration
   * @returns {Object} Positioning information
   */
  static calculateTextPositioning(lines, canvasWidth, config) {
    const charWidthCache = getCharacterWidthCache();
    const lineHeight = config.font.size * config.font.lineHeight;
    const maxWidth = canvasWidth * config.layout.maxWidth;
    const x = canvasWidth / 2;
    const y = canvasWidth * config.layout.marginTop;
    
    // Calculate line positions
    const linePositions = lines.map((line, lineIndex) => {
      const lineWidth = calculateLineWidth(line, charWidthCache);
      const lineStartX = x - lineWidth / 2;
      const lineY = y - (lines.length - 1) * lineHeight / 2 + lineIndex * lineHeight;
      
      return {
        line,
        lineStartX,
        lineY,
        lineWidth
      };
    });
    
    return {
      linePositions,
      lineHeight,
      maxWidth
    };
  }

  /**
   * Parse text with line breaks (--- separator)
   * @param {string} text - Input text with --- separators
   * @returns {Array} Array of text segments
   */
  static parseTextWithLineBreaks(text) {
    return text.split('---').map(segment => segment.trim()).filter(segment => segment.length > 0);
  }

  /**
   * Calculate width of a word using the character width cache
   * @param {Object} word - Word object with text and bold properties
   * @param {Object} charWidthCache - Character width cache
   * @returns {number} Word width in pixels
   */
  static calculateWordWidth(word, charWidthCache) {
    return calculateWordWidth(word, charWidthCache);
  }

  /**
   * Calculate total width of a line of words
   * @param {Array} words - Array of word objects
   * @param {Object} charWidthCache - Character width cache
   * @returns {number} Total line width in pixels
   */
  static calculateLineWidth(words, charWidthCache) {
    return calculateLineWidth(words, charWidthCache);
  }
}

export default TextProcessingService;
