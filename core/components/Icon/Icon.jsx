import React from 'react';
import PropTypes from 'prop-types';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DownloadIcon from '@material-ui/icons/FileDownload';
import LoopIcon from '@material-ui/icons/Loop';
import WarningIcon from '@material-ui/icons/Warning';
import ForumIcon from '@material-ui/icons/Forum';
import MailIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Call';
import MenuIcon from '@material-ui/icons/Menu';
import WaitingIcon from '@material-ui/icons/HourglassEmpty';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import DropDownCircle from '@material-ui/icons/ArrowDropDownCircle';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SearchIcon from '@material-ui/icons/Search';
import PowerOffIcon from '@material-ui/icons/PowerSettingsNew';
import LockOpen from '@material-ui/icons/LockOpen';
import Lock from '@material-ui/icons/Lock';
import BuildingIcon from '@material-ui/icons/Business';
import HomeIcon from '@material-ui/icons/Home';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FolderIcon from '@material-ui/icons/FolderOpen';
import Person from '@material-ui/icons/Person';
import FaceIcon from '@material-ui/icons/Face';
import Eye from '@material-ui/icons/Visibility';
import EyeCrossed from '@material-ui/icons/VisibilityOff';
import SortIcon from '@material-ui/icons/Sort';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Apps from '@material-ui/icons/Apps';
import DollarSign from '@material-ui/icons/AttachMoney';
import ContactMail from '@material-ui/icons/ContactMail';
import People from '@material-ui/icons/People';
import DeveloperMode from '@material-ui/icons/DeveloperMode';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import Edit from '@material-ui/icons/Edit';

import Star from '@material-ui/icons/Star';
import StarHalf from '@material-ui/icons/StarHalf';
import StarEmpty from '@material-ui/icons/StarBorder';

import PersonAdd from '@material-ui/icons/PersonAdd';
import OfflinePin from '@material-ui/icons/OfflinePin';
import Save from '@material-ui/icons/Save';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import FlashOn from '@material-ui/icons/FlashOn';
import Report from '@material-ui/icons/Report';
import DeleteForever from '@material-ui/icons/DeleteForever';
import DeleteSweep from '@material-ui/icons/DeleteSweep';
import GroupAdd from '@material-ui/icons/GroupAdd';

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
  lock: Lock,
  lockOpen: LockOpen,
  home: HomeIcon,
  building: BuildingIcon,
  dashboard: AssessmentIcon,
  folder: FolderIcon,
  loop: LoopIcon,
  'loop-spin': { component: LoopIcon, props: { className: 'fa-spin' } },
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
  personAdd: PersonAdd,
  offlinePin: OfflinePin,
  dollarSign: DollarSign,
  contactMail: ContactMail,
  people: People,
  developerMode: DeveloperMode,
  save: Save,
  supervisorAccount: SupervisorAccount,
  error: ErrorIcon,
  checkCircle: CheckCircle,
  radioButtonChecked: RadioButtonChecked,
  flash: FlashOn,
  report: Report,
  deleteForever: DeleteForever,
  deleteSweep: DeleteSweep,
  groupAdd: GroupAdd,
  edit: Edit,
};

const Icon = ({ type, size, ...props }) => {
  const MyIcon = iconMap[type];

  if (!MyIcon) {
    throw new Error(`invalid icon type: ${type}`);
  } else if (MyIcon.component) {
    return <MyIcon.component {...MyIcon.props} {...props} />;
  }

  return (
    <MyIcon style={size ? { width: size, height: size } : {}} {...props} />
  );
};

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
};

Icon.defaultProps = {
  size: undefined,
};

export default Icon;
