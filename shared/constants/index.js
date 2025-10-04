// Centralized configuration constants for the Quote Image Generator

export const CANVAS_CONFIG = {
  WIDTH: 1080,
  HEIGHT: 1080,
  INSTAGRAM_FORMAT: true
};

export const COLORS = {
  PRIMARY_TEXT: '#F5F2ED',
  ACCENT: '#8B7355',
  ACCENT_HOVER: '#9A8265',
  BACKGROUND: '#1C1B1A',
  SECONDARY_BACKGROUND: '#2A2928',
  BORDER: '#3E4144',
  BORDER_FOCUS: '#8B7355'
};

export const TEMPLATES = {
  template1: { file: 'theme-01.png', label: 'Template 1' },
  template2: { file: 'theme-02.png', label: 'Template 2' },
  template3: { file: 'theme-03.png', label: 'Template 3' },
  template4: { file: 'theme-04.png', label: 'Template 4' },
  template5: { file: 'theme-05.png', label: 'Template 5' },
  template6: { file: 'theme-06.png', label: 'Template 6' }
};

export const FONTS = {
  PATHS: {
    JOST_MEDIUM: 'public/font/Jost-Medium.ttf',
    JOST_BOLD: 'public/font/Jost-Bold.ttf',
    CRIMSON_REGULAR: 'public/font/CrimsonText-Regular.ttf'
  },
  FAMILIES: {
    JOST_MEDIUM: 'Jost Medium',
    JOST_BOLD: 'Jost Bold',
    CRIMSON_REGULAR: 'CrimsonText Regular'
  }
};

export const LAYOUT = {
  MAX_WIDTH_RATIO: 0.7, // 70% of canvas width
  MARGIN_TOP_RATIO: 0.35, // Rule of thirds positioning
  LINE_HEIGHT: 1.5,
  TEXT_OPACITY: 0.85
};

export const TEXT_SHADOW = {
  COLOR: 'rgba(0, 0, 0, 0.3)',
  BLUR: 2,
  OFFSET_X: 0,
  OFFSET_Y: 0
};

export const API = {
  ENDPOINTS: {
    GENERATE_IMAGE: '/api/generate-image'
  },
  METHODS: {
    POST: 'POST'
  },
  HEADERS: {
    CONTENT_TYPE: 'application/json'
  }
};

export const UI = {
  CONTAINER_MAX_WIDTH: 600,
  GRID_COLUMNS: 3,
  IMAGE_MAX_HEIGHT: 400,
  BORDER_RADIUS: 4,
  BORDER_RADIUS_LARGE: 8
};

export const DOWNLOAD = {
  DEFAULT_FILENAME: 'quote-images',
  FILE_EXTENSION: '.png',
  MIME_TYPE: 'image/png'
};
