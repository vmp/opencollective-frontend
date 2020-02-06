import { variant } from 'styled-system';
import { transparentize, shade, tint } from 'polished';

// Import defaults
import defaultBreakpoints from './breakpoints';
import defaultColors from './colors';
import defaultSpaces from './spaces';
import { defaultFontSizes, defaultLineHeights } from './text-sizes';

function toPx(value) {
  return `${value}px`;
}

function getBtnGradient(baseColor, percentage) {
  return `linear-gradient(180deg, ${baseColor} 0%, ${shade(percentage, baseColor)} 100%);`;
}

export const generateTheme = ({
  colors = defaultColors,
  fontSizes = defaultFontSizes,
  lineHeights = defaultLineHeights,
  space = defaultSpaces,
} = {}) => ({
  colors,
  fontSizes,
  lineHeights,
  space,
  breakpoints: defaultBreakpoints,
  buttons: {
    standard: {
      backgroundColor: 'white',
      borderColor: colors.black[300],
      color: colors.black[700],

      '&:hover': {
        borderColor: colors.primary[300],
        color: colors.primary[400],
      },

      '&:focus': {
        backgroundColor: 'white',
        borderColor: colors.primary[400],
      },

      '&:active': {
        background: getBtnGradient(tint(0.05, colors.primary[600]), 0.125),
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[500],
        color: 'white',
      },

      '&:disabled': {
        backgroundColor: colors.black[50],
        borderColor: colors.black[200],
        color: colors.black[300],
      },
    },

    primary: {
      background: getBtnGradient(tint(0.05, colors.primary[600]), 0.125),
      backgroundColor: colors.primary[600],
      borderColor: colors.primary[600],
      color: 'white',

      '&:hover': {
        background: getBtnGradient(tint(0.1, colors.primary[500]), 0.08),
        backgroundColor: colors.primary[400],
        borderColor: colors.primary[400],
        color: 'white',
      },

      '&:focus': {
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[700],
      },

      '&:active': {
        background: getBtnGradient(colors.primary[600], 0.25),
        backgroundColor: colors.primary[800],
        borderColor: colors.primary[800],
        color: 'white',
      },

      '&:disabled': {
        background: getBtnGradient(tint(0.85, colors.primary[600]), 0.01),
        backgroundColor: colors.primary[50],
        color: colors.white.full,
        borderColor: colors.primary[50],
      },
    },

    danger: {
      background: `linear-gradient(180deg, #E03F6A 0%, #CC2955 100%)`,
      backgroundColor: colors.red[500],
      borderColor: colors.red[500],
      color: 'white',

      '&:hover': {
        background: 'linear-gradient(180deg, #F55882 0%, #E03F6A 100%)',
        backgroundColor: colors.red[400],
        borderColor: colors.red[400],
        color: 'white',
      },

      '&:focus': {
        backgroundColor: colors.red[500],
        borderColor: colors.red[700],
      },

      '&:active': {
        background: '#A32143',
        backgroundColor: colors.red[600],
        borderColor: colors.red[600],
      },

      '&:disabled': {
        background: getBtnGradient(colors.red[100], 0.02),
        backgroundColor: colors.red[100],
        borderColor: colors.red[100],
      },
    },

    success: {
      background: `linear-gradient(180deg, #29CC75 0%, #25B869 100%);`,
      backgroundColor: colors.green[500],
      borderColor: colors.green[500],
      color: 'white',

      '&:hover': {
        background: `linear-gradient(180deg, #51E09D 0%, #29CC80 100%)`,
        backgroundColor: colors.green[300],
        borderColor: colors.green[300],
        color: 'white',
      },

      '&:focus': {
        backgroundColor: colors.green[500],
        borderColor: colors.green[600],
      },

      '&:active': {
        background: colors.green[600],
        backgroundColor: colors.green[600],
        borderColor: colors.green[600],
        color: 'white',
      },

      '&:disabled': {
        background: getBtnGradient(colors.green[100], 0.02),
        backgroundColor: colors.green[100],
        borderColor: colors.green[100],
        color: 'white',
      },
    },

    secondary: {
      background: colors.white.full,
      backgroundColor: colors.white.full,
      borderColor: colors.primary[500],
      color: colors.primary[600],

      '&:hover': {
        backgroundColor: colors.black[50],
      },

      '&:focus': {
        borderColor: colors.primary[700],
      },

      '&:active': {
        background: getBtnGradient(colors.primary[600], 0.08),
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
        color: 'white',
      },

      '&:disabled': {
        background: colors.white.full,
        color: colors.black[300],
        borderColor: colors.black[300],
      },
    },

    dark: {
      background: `linear-gradient(180deg, #313233 0%, #141414 100%)`,
      backgroundColor: colors.black[700],
      color: colors.white.full,
      borderColor: colors.black[700],

      '&:hover': {
        background: `linear-gradient(180deg, #4E5052 0%, #313233 100%)`,
        backgroundColor: colors.black[900],
        color: colors.white.full,
      },

      '&:active': {
        background: getBtnGradient(colors.black[900], 0.01),
        backgroundColor: colors.black[900],
      },

      '&:disabled': {
        background: getBtnGradient(colors.black[100], 0.01),
        backgroundColor: colors.black[100],
        borderColor: colors.black[100],
      },
    },
  },
  buttonSizes: {
    large: {
      fontSize: toPx(fontSizes.LeadParagraph),
      lineHeight: toPx(fontSizes.LeadParagraph + 2),
      paddingBottom: toPx(space[3]),
      paddingLeft: toPx(space[5]),
      paddingRight: toPx(space[5]),
      paddingTop: toPx(space[3]),
    },

    medium: {
      fontSize: toPx(fontSizes.Paragraph),
      lineHeight: toPx(fontSizes.Paragraph + 7),
      paddingBottom: toPx(space[2]),
      paddingLeft: toPx(space[3]),
      paddingRight: toPx(space[3]),
      paddingTop: toPx(space[2]),
    },

    small: {
      fontSize: toPx(fontSizes.Caption),
      lineHeight: toPx(fontSizes.Caption + 2),
      paddingBottom: toPx(space[1]),
      paddingLeft: toPx(space[2]),
      paddingRight: toPx(space[2]),
      paddingTop: toPx(space[1]),
    },
  },
  messageTypes: {
    white: {
      backgroundColor: colors.white.full,
      borderColor: colors.black[200],
    },
    dark: {
      backgroundColor: transparentize(0.2, colors.black[900]),
      borderColor: colors.black[900],
      color: colors.white.full,
    },
    info: {
      backgroundColor: colors.blue[100],
      borderColor: colors.blue[500],
      color: colors.blue[500],
    },
    success: {
      backgroundColor: colors.green[100],
      borderColor: colors.green[500],
      color: colors.green[700],
    },
    warning: {
      backgroundColor: colors.yellow[100],
      borderColor: colors.yellow[500],
      color: colors.yellow[700],
    },
    error: {
      backgroundColor: colors.red[100],
      borderColor: colors.red[500],
      color: colors.red[700],
    },
  },
  sizes: {
    navbarHeight: 68,
  },
});

// Export variants
export const buttonStyle = variant({
  key: 'buttons',
  prop: 'buttonStyle',
});

export const buttonSize = variant({
  key: 'buttonSizes',
  prop: 'buttonSize',
});

export const messageType = variant({
  key: 'messageTypes',
  prop: 'type',
});

// Generate and export main theme
const theme = generateTheme();
export default theme;
