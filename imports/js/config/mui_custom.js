import muiColors from 'material-ui/styles/colors';
import ColorManipulator from 'material-ui/utils/colorManipulator';
import Spacing from 'material-ui/styles/spacing';

import colors from './colors';

const muiCustom = {
  // spacing: Spacing.default,
  fontFamily: 'Source Sans Pro, sans-serif',
  fontWeight: 300,
  palette: {
    primary1Color: colors.primary,
    // primary2Color: '#50A1FF',
    // primary3Color: muiColors.grey600,
    accent1Color: colors.secondary,
    // accent2Color: muiColors.grey100,
    // accent3Color: muiColors.grey500,
    // textColor: muiColors.darkBlack,
    // secondaryTextColor: (0, ColorManipulator.fade)(muiColors.darkBlack, 0.54),
    // alternateTextColor: muiColors.white,
    // canvasColor: muiColors.white,
    // borderColor: muiColors.grey300,
    // disabledColor: (0, ColorManipulator.fade)(muiColors.darkBlack, 0.3),
    // pickerHeaderColor: muiColors.cyan500,
    // clockCircleColor: (0, ColorManipulator.fade)(muiColors.darkBlack, 0.07),
    // shadowColor: muiColors.fullBlack,
  },
  raisedButton: {
    // color: palette.alternateTextColor,
    // textColor: colors.primary,
    // primaryColor: colors.primary,
    // primaryTextColor: colors.primary,
    // secondaryColor: palette.accent1Color,
    // secondaryTextColor: palette.alternateTextColor,
    // disabledColor: darken(palette.alternateTextColor, 0.1),
    // disabledTextColor: fade(palette.textColor, 0.3),
    // fontSize: typography.fontStyleButtonFontSize,
    // fontWeight: typography.fontWeightMedium,
  },
  slider: {
    trackSize: 2,
    handleSize: 20,
    handleSizeDisabled: 15,
    handleSizeActive: 30,
  },
};

export default muiCustom;
