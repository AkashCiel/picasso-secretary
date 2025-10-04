// Centralized error handling system

export class ImageGenerationError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'ImageGenerationError';
    this.code = code;
    this.originalError = originalError;
  }
}

export class TemplateError extends Error {
  constructor(message, templateName, originalError = null) {
    super(message);
    this.name = 'TemplateError';
    this.templateName = templateName;
    this.originalError = originalError;
  }
}

export class FontError extends Error {
  constructor(message, fontFamily, originalError = null) {
    super(message);
    this.name = 'FontError';
    this.fontFamily = fontFamily;
    this.originalError = originalError;
  }
}

export class ValidationError extends Error {
  constructor(message, field, originalError = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.originalError = originalError;
  }
}

/**
 * Handle API errors with proper HTTP status codes
 * @param {Error} error - The error to handle
 * @param {Object} res - Express response object
 */
export const handleApiError = (error, res) => {
  console.error('API Error:', error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      field: error.field
    });
  }

  if (error instanceof TemplateError) {
    return res.status(404).json({
      success: false,
      message: `Template not found: ${error.templateName}`,
      code: 'TEMPLATE_NOT_FOUND'
    });
  }

  if (error instanceof FontError) {
    return res.status(500).json({
      success: false,
      message: `Font loading failed: ${error.fontFamily}`,
      code: 'FONT_ERROR'
    });
  }

  if (error instanceof ImageGenerationError) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: error.code
    });
  }

  // Generic error handling
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
};

/**
 * Validate text input
 * @param {string} text - Text to validate
 * @returns {void}
 * @throws {ValidationError} If text is invalid
 */
export const validateText = (text) => {
  if (!text || typeof text !== 'string') {
    throw new ValidationError('Text is required', 'text');
  }

  if (text.trim().length === 0) {
    throw new ValidationError('Text cannot be empty', 'text');
  }

  if (text.length > 1000) {
    throw new ValidationError('Text is too long (max 1000 characters)', 'text');
  }
};

/**
 * Validate template name
 * @param {string} template - Template name to validate
 * @returns {void}
 * @throws {ValidationError} If template is invalid
 */
export const validateTemplate = (template) => {
  if (!template || typeof template !== 'string') {
    throw new ValidationError('Template is required', 'template');
  }

  const validTemplates = ['template1', 'template2', 'template3', 'template4', 'template5', 'template6'];
  if (!validTemplates.includes(template)) {
    throw new ValidationError(`Invalid template: ${template}`, 'template');
  }
};
