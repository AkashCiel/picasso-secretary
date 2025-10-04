// Template service for managing template configurations
import { TEMPLATES } from '../../shared/constants/index.js';

class TemplateService {
  /**
   * Get template configuration by name
   * @param {string} templateName - The template identifier
   * @returns {Object} Template configuration object
   */
  static getTemplateConfig(templateName) {
    return TEMPLATES[templateName] || TEMPLATES.template1;
  }

  /**
   * Get all available templates for UI selection
   * @returns {Array} Array of template objects with value and label
   */
  static getAllTemplates() {
    return Object.entries(TEMPLATES).map(([key, config]) => ({
      value: key,
      label: config.label
    }));
  }

  /**
   * Get template file name by template identifier
   * @param {string} templateName - The template identifier
   * @returns {string} Template file name
   */
  static getTemplateFileName(templateName) {
    const config = this.getTemplateConfig(templateName);
    return config.file;
  }

  /**
   * Check if template exists
   * @param {string} templateName - The template identifier
   * @returns {boolean} True if template exists
   */
  static templateExists(templateName) {
    return templateName in TEMPLATES;
  }

  /**
   * Get template mapping for image generator
   * @returns {Object} Template name to file name mapping
   */
  static getTemplateMapping() {
    const mapping = {};
    Object.entries(TEMPLATES).forEach(([key, config]) => {
      mapping[key] = config.file;
    });
    return mapping;
  }
}

export default TemplateService;
