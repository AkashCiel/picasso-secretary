// Typography configuration for each template
const typographyConfig = {
  template1: {
    font: {
      family: 'Futura PT Light',
      size: 42,
      lineHeight: 1.5,
      color: '#F5F2ED',
      opacity: 0.85
    },
    attribution: {
      family: 'Garamond',
      style: 'italic',
      size: 18,
      color: '#8B7355'
    },
    layout: {
      maxWidth: 0.7, // 70% of canvas width
      marginTop: 0.35, // Position from top
      textAlign: 'center'
    }
  },
  template2: {
    font: {
      family: 'Futura PT Light',
      size: 38,
      lineHeight: 1.5,
      color: '#F5F2ED',
      opacity: 0.85
    },
    attribution: {
      family: 'Garamond',
      style: 'italic',
      size: 16,
      color: '#8B7355'
    },
    layout: {
      maxWidth: 0.75,
      marginTop: 0.4,
      textAlign: 'center'
    }
  },
  template3: {
    font: {
      family: 'Futura PT Light',
      size: 45,
      lineHeight: 1.4,
      color: '#F5F2ED',
      opacity: 0.9
    },
    attribution: {
      family: 'Garamond',
      style: 'italic',
      size: 20,
      color: '#8B7355'
    },
    layout: {
      maxWidth: 0.65,
      marginTop: 0.33,
      textAlign: 'center'
    }
  }
}

module.exports = typographyConfig
