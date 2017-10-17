import React from 'react';
import PropTypes from 'prop-types';

import CheckIcon from 'material-ui-icons/Check';
import CloseIcon from 'material-ui-icons/Close';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import DownloadIcon from 'material-ui-icons/FileDownload';
import LoopIcon from 'material-ui-icons/Loop';
import WarningIcon from 'material-ui-icons/Warning';
import ForumIcon from 'material-ui-icons/Forum';
import MailIcon from 'material-ui-icons/MailOutline';
import PhoneIcon from 'material-ui-icons/Call';
import MenuIcon from 'material-ui-icons/Menu';
import WaitingIcon from 'material-ui-icons/HourglassEmpty';
import ArrowUp from 'material-ui-icons/KeyboardArrowUp';
import DropDownCircle from 'material-ui-icons/ArrowDropDownCircle';
import ArrowDown from 'material-ui-icons/KeyboardArrowDown';
import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import ArrowRight from 'material-ui-icons/KeyboardArrowRight';
import SearchIcon from 'material-ui-icons/Search';
import PowerOffIcon from 'material-ui-icons/PowerSettingsNew';
import LockIcon from 'material-ui-icons/LockOutline';
import LockOpen from 'material-ui-icons/LockOpen';
import BuildingIcon from 'material-ui-icons/Business';
import HomeIcon from 'material-ui-icons/Home';
import AssessmentIcon from 'material-ui-icons/Assessment';
import FolderIcon from 'material-ui-icons/FolderOpen';
import Person from 'material-ui-icons/Person';
import FaceIcon from 'material-ui-icons/Face';
import Eye from 'material-ui-icons/Visibility';
import EyeCrossed from 'material-ui-icons/VisibilityOff';
import SortIcon from 'material-ui-icons/Sort';
import MoreIcon from 'material-ui-icons/MoreHoriz';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Apps from 'material-ui-icons/Apps';

import Star from 'material-ui-icons/Star';
import StarHalf from 'material-ui-icons/StarHalf';
import StarEmpty from 'material-ui-icons/StarBorder';

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
  loop: LoopIcon,
  'loop-spin': { component: LoopIcon, className: 'fa-spin' },
  person: Person,
  face: FaceIcon,
  eye: Eye,
  eyeCrossed: EyeCrossed,
  sort: SortIcon,
  more: MoreIcon,
  star: Star,
  starHalf: StarHalf,
  starEmpty: StarEmpty,
  accountCircle: AccountCircle,
  app: Apps,
};

const Icon = (props) => {
  const { type } = props;
  const MyIcon = iconMap[type];

  if (!MyIcon) {
    throw new Error(`invalid icon type: ${type}`);
  } else if (MyIcon.component) {
    return <MyIcon.component className={MyIcon.className} {...props} />;
  }

  return <MyIcon {...props} />;
};

Icon.propTypes = {
  type: PropTypes.string.isRequired,
};

Icon.defaultProps = {};

export default Icon;
