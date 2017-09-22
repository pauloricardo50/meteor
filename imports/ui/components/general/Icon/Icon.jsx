import React from 'react';
import PropTypes from 'prop-types';

import omit from 'lodash/omit';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import LoopIcon from 'material-ui/svg-icons/av/loop';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import ForumIcon from 'material-ui/svg-icons/communication/forum';
import MailIcon from 'material-ui/svg-icons/communication/mail-outline';
import PhoneIcon from 'material-ui/svg-icons/communication/call';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import WaitingIcon from 'material-ui/svg-icons/action/hourglass-empty';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import DropDownCircle from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SearchIcon from 'material-ui/svg-icons/action/search';
import PowerOffIcon from 'material-ui/svg-icons/action/power-settings-new';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import BuildingIcon from 'material-ui/svg-icons/communication/business';
import HomeIcon from 'material-ui/svg-icons/action/home';
import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import FolderIcon from 'material-ui/svg-icons/file/folder-open';
import Person from 'material-ui/svg-icons/social/person';
import FaceIcon from 'material-ui/svg-icons/action/face';
import Eye from 'material-ui/svg-icons/action/visibility';
import EyeCrossed from 'material-ui/svg-icons/action/visibility-off';
import SortIcon from 'material-ui/svg-icons/content/sort';
import MoreIcon from 'material-ui/svg-icons/navigation/more-horiz';

import Star from 'material-ui/svg-icons/toggle/star';
import StarHalf from 'material-ui/svg-icons/toggle/star-half';
import StarEmpty from 'material-ui/svg-icons/toggle/star-border';

import colors from '/imports/js/config/colors';

const iconMap = {
  close: CloseIcon,
  check: CheckIcon,
  add: AddIcon,
  warning: WarningIcon,
  download: DownloadIcon,
  menu: MenuIcon,
  forum: ForumIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  waiting: WaitingIcon,
  up: ArrowUp,
  down: ArrowDown,
  right: ArrowRight,
  left: ArrowLeft,
  dropdown: DropDownCircle,
  search: SearchIcon,
  powerOff: PowerOffIcon,
  lock: LockIcon,
  lockOpen: LockOpen,
  home: HomeIcon,
  building: BuildingIcon,
  dashboard: AssessmentIcon,
  folder: FolderIcon,
  loop: { component: LoopIcon, className: 'fa-spin' },
  person: Person,
  face: FaceIcon,
  eye: Eye,
  eyeCrossed: EyeCrossed,
  sort: SortIcon,
  more: MoreIcon,
  star: Star,
  starHalf: StarHalf,
  starEmpty: StarEmpty,
};

const Icon = (props) => {
  const { type } = props;
  const iconProps = props.withColors
    ? { ...props, color: colors.iconColor, hoverColor: colors.iconHoverColor }
    : { ...props };

  const MyIcon = iconMap[type];

  if (!MyIcon) {
    throw new Error('invalid icon type');
  } else if (MyIcon.component) {
    return (
      <MyIcon.component
        className={MyIcon.className}
        {...omit(iconProps, ['withColors'])}
      />
    );
  }

  return <MyIcon {...omit(iconProps, ['withColors'])} />;
};

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  withColors: PropTypes.bool,
};

Icon.defaultProps = {
  color: '',
  hoverColor: '',
  withColors: false,
};

export default Icon;
