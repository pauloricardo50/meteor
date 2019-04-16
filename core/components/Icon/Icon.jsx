import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
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
import TrendingUp from '@material-ui/icons/TrendingUp';
import TrendingDown from '@material-ui/icons/TrendingDown';
import TrendingFlat from '@material-ui/icons/TrendingFlat';
import Star from '@material-ui/icons/Star';
import StarHalf from '@material-ui/icons/StarHalf';
import StarEmpty from '@material-ui/icons/StarBorder';
import PersonAdd from '@material-ui/icons/PersonAdd';
import OfflinePin from '@material-ui/icons/OfflinePin';
import Save from '@material-ui/icons/Save';
import SupervisorAccount from '@material-ui/icons/SupervisedUserCircle';
import FlashOn from '@material-ui/icons/FlashOn';
import Report from '@material-ui/icons/Report';
import DeleteForever from '@material-ui/icons/DeleteForever';
import DeleteSweep from '@material-ui/icons/DeleteSweep';
import GroupAdd from '@material-ui/icons/GroupAdd';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsBackupRestore from '@material-ui/icons/SettingsBackupRestore';
import FilterList from '@material-ui/icons/FilterList';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Domain from '@material-ui/icons/Domain';
import Info from '@material-ui/icons/Info';
import AttachFile from '@material-ui/icons/AttachFile';
import CloudDownload from '@material-ui/icons/CloudDownload';
import LocalHospital from '@material-ui/icons/LocalHospital';
import Help from '@material-ui/icons/Help';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import InsertChart from '@material-ui/icons/InsertChart';
import Image from '@material-ui/icons/Image';
import Delete from '@material-ui/icons/Delete';
import Phonelink from '@material-ui/icons/Phonelink';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Add from '@material-ui/icons/Add';
import Settings from '@material-ui/icons/Settings';

export const iconMap = {
  close: CloseIcon,
  check: CheckIcon,
  add: AddIcon,
  addBasic: Add,
  remove: RemoveIcon,
  warning: WarningIcon,
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
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  trendingFlat: TrendingFlat,
  expandMore: ExpandMoreIcon,
  backupRestore: SettingsBackupRestore,
  filter: FilterList,
  arrowUp: ArrowUpward,
  arrowDown: ArrowDownward,
  domain: Domain,
  info: Info,
  attachFile: AttachFile,
  download: CloudDownload,
  health: LocalHospital,
  help: Help,
  monetizationOn: MonetizationOn,
  chart: InsertChart,
  image: Image,
  delete: Delete,
  phoneLink: Phonelink,
  openInNew: OpenInNew,
  settings:Settings,
};

const Icon = ({
  type,
  size,
  tooltip,
  tooltipPlacement,
  style = {},
  ...props
}) => {
  const iconStyle = {
    ...style,
    ...(size ? { width: size, height: size } : {}),
  };

  if (type !== null && typeof type === 'object') {
    return React.cloneElement(type, { style: iconStyle });
  }

  const MyIcon = iconMap[type];

  if (!MyIcon) {
    throw new Error(`invalid icon type: ${type}`);
  } else if (MyIcon.component) {
    return <MyIcon.component {...MyIcon.props} {...props} {...iconStyle} />;
  }

  const icon = <MyIcon style={iconStyle} {...props} />;

  if (tooltip) {
    return (
      <Tooltip placement={tooltipPlacement} title={tooltip}>
        {icon}
      </Tooltip>
    );
  }

  return icon;
};

Icon.propTypes = {
  size: PropTypes.number,
  type: PropTypes.node.isRequired,
};

Icon.defaultProps = {
  size: undefined,
};

export default Icon;
