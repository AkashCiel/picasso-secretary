// Typography configuration for all templates
import { COLORS, FONTS, LAYOUT } from '../../shared/constants/index.js';

const typographyConfig = {
  template1: {
    font: {
      family: FONTS.FAMILIES.JOST_MEDIUM,
      size: 42,
      lineHeight: LAYOUT.LINE_HEIGHT,
      color: COLORS.PRIMARY_TEXT,
      opacity: LAYOUT.TEXT_OPACITY
    },
    boldFont: {
      family: FONTS.FAMILIES.JOST_BOLD,
      size: 42,
      lineHeight: LAYOUT.LINE_HEIGHT,
      color: COLORS.PRIMARY_TEXT,
      opacity: LAYOUT.TEXT_OPACITY
    },
    layout: {
      maxWidth: LAYOUT.MAX_WIDTH_RATIO,
      marginTop: LAYOUT.MARGIN_TOP_RATIO,
      textAlign: 'center'
    }
  }
};

export default typographyConfig;
