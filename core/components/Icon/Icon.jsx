import React from 'react';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Airplay from '@material-ui/icons/Airplay';
import Apps from '@material-ui/icons/Apps';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AttachFile from '@material-ui/icons/AttachFile';
import DollarSign from '@material-ui/icons/AttachMoney';
import BuildingIcon from '@material-ui/icons/Business';
import PhoneIcon from '@material-ui/icons/Call';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Computer from '@material-ui/icons/Computer';
import ContactMail from '@material-ui/icons/ContactMail';
import Delete from '@material-ui/icons/Delete';
import DeleteForever from '@material-ui/icons/DeleteForever';
import DeleteSweep from '@material-ui/icons/DeleteSweep';
import DeveloperMode from '@material-ui/icons/DeveloperMode';
import DragHandle from '@material-ui/icons/DragHandle';
import Edit from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import Event from '@material-ui/icons/Event';
import EventAvailable from '@material-ui/icons/EventAvailable';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FaceIcon from '@material-ui/icons/Face';
import FilterList from '@material-ui/icons/FilterList';
import FlashOn from '@material-ui/icons/FlashOn';
import Group from '@material-ui/icons/Group';
import GroupAdd from '@material-ui/icons/GroupAdd';
import Help from '@material-ui/icons/Help';
import HomeIcon from '@material-ui/icons/Home';
import WaitingIcon from '@material-ui/icons/HourglassEmpty';
import HowToReg from '@material-ui/icons/HowToReg';
import Image from '@material-ui/icons/Image';
import Info from '@material-ui/icons/Info';
import InsertChart from '@material-ui/icons/InsertChart';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';
import LoopIcon from '@material-ui/icons/Loop';
import MailIcon from '@material-ui/icons/MailOutline';
import MarkunreadMailbox from '@material-ui/icons/MarkunreadMailbox';
import MeetingRoom from '@material-ui/icons/MeetingRoom';
import MenuIcon from '@material-ui/icons/Menu';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Notifications from '@material-ui/icons/Notifications';
import Opacity from '@material-ui/icons/Opacity';
import OpenInNew from '@material-ui/icons/OpenInNew';
import People from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import PowerOffIcon from '@material-ui/icons/PowerSettingsNew';
import PriorityHigh from '@material-ui/icons/PriorityHigh';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import Report from '@material-ui/icons/Report';
import Schedule from '@material-ui/icons/Schedule';
import SearchIcon from '@material-ui/icons/Search';
import Security from '@material-ui/icons/Security';
import Send from '@material-ui/icons/Send';
import Settings from '@material-ui/icons/Settings';
import SettingsBackupRestore from '@material-ui/icons/SettingsBackupRestore';
import Snooze from '@material-ui/icons/Snooze';
import SortIcon from '@material-ui/icons/Sort';
import Star from '@material-ui/icons/Star';
import SupervisorAccount from '@material-ui/icons/SupervisedUserCircle';
import TrendingDown from '@material-ui/icons/TrendingDown';
import TrendingFlat from '@material-ui/icons/TrendingFlat';
import TrendingUp from '@material-ui/icons/TrendingUp';
import ViewWeek from '@material-ui/icons/ViewWeek';
import Eye from '@material-ui/icons/Visibility';
import EyeCrossed from '@material-ui/icons/VisibilityOff';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';

import colors from '../../config/colors';
import Tooltip from '../Material/Tooltip';

export const iconMap = {
  close: CloseIcon,
  check: CheckIcon,
  add: AddIcon,
  addBasic: Add,
  remove: RemoveIcon,
  warning: WarningIcon,
  menu: MenuIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  waiting: WaitingIcon,
  up: ArrowUp,
  down: ArrowDown,
  right: ArrowRight,
  left: ArrowLeft,
  search: SearchIcon,
  powerOff: PowerOffIcon,
  lock: Lock,
  lockOpen: LockOpen,
  home: HomeIcon,
  building: BuildingIcon,
  dashboard: AssessmentIcon,
  loop: LoopIcon,
  'loop-spin': { component: LoopIcon, props: { className: 'fa-spin' } },
  person: Person,
  face: FaceIcon,
  eye: Eye,
  eyeCrossed: EyeCrossed,
  sort: SortIcon,
  more: MoreIcon,
  star: Star,
  accountCircle: AccountCircle,
  app: Apps,
  personAdd: PersonAdd,
  dollarSign: DollarSign,
  contactMail: ContactMail,
  people: People,
  developerMode: DeveloperMode,
  supervisorAccount: SupervisorAccount,
  error: ErrorIcon,
  checkCircle: CheckCircle,
  radioButtonChecked: RadioButtonChecked,
  flash: FlashOn,
  report: Report,
  deleteForever: DeleteForever,
  deleteSweep: DeleteSweep,
  groupAdd: GroupAdd,
  group: Group,
  edit: Edit,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  trendingFlat: TrendingFlat,
  expandMore: ExpandMoreIcon,
  expandLess: ExpandLessIcon,
  backupRestore: SettingsBackupRestore,
  filter: FilterList,
  arrowUp: ArrowUpward,
  arrowDown: ArrowDownward,
  info: Info,
  attachFile: AttachFile,
  download: CloudDownload,
  help: Help,
  monetizationOn: MonetizationOn,
  chart: InsertChart,
  image: Image,
  delete: Delete,
  openInNew: OpenInNew,
  settings: Settings,
  event: Event,
  computer: Computer,
  notifications: Notifications,
  snooze: Snooze,
  dragHandle: DragHandle,
  priorityHigh: PriorityHigh,
  markunreadMailbox: MarkunreadMailbox,
  viewWeek: ViewWeek,
  schedule: Schedule,
  send: Send,
  airplay: Airplay,
  howToReg: HowToReg,
  meetingRoom: MeetingRoom,
  security: Security,
  opacity: Opacity,
  eventAvailable: EventAvailable,
};

const getColorStyle = color => ({ color: colors[color], fill: colors[color] });

const Icon = React.forwardRef(
  (
    {
      type,
      size,
      tooltip,
      tooltipPlacement,
      style = {},
      badgeContent,
      color,
      ...props
    },
    ref,
  ) => {
    let icon;
    const iconStyle = {
      ...(color ? getColorStyle(color) : {}),
      ...style,
      ...(size ? { width: size, height: size } : {}),
    };

    if (type !== null && typeof type === 'object') {
      icon = React.cloneElement(type, {
        ...props,
        fowardedRef: ref,
        style: { ...iconStyle, ...type.props.style },
      });
    } else if (typeof type === 'string') {
      const MyIcon = iconMap[type];

      if (!MyIcon) {
        throw new Error(`invalid icon type: ${type}`);
      } else if (MyIcon.component) {
        icon = <MyIcon.component {...MyIcon.props} {...props} {...iconStyle} />;
      } else {
        icon = <MyIcon ref={ref} style={iconStyle} {...props} />;
      }
    } else {
      throw new Error(
        `Icon type must be a string or a Fontawesome icon, but got ${type} instead`,
      );
    }

    if (tooltip) {
      icon = (
        <Tooltip
          placement={tooltipPlacement}
          title={tooltip}
          enterTouchDelay={0}
        >
          {icon}
        </Tooltip>
      );
    }

    if (badgeContent) {
      icon = (
        <Badge badgeContent={badgeContent} color="error">
          {icon}
        </Badge>
      );
    }

    return icon;
  },
);

Icon.propTypes = {
  size: PropTypes.number,
  type: PropTypes.node.isRequired,
};

Icon.defaultProps = {
  size: undefined,
};

export default Icon;
