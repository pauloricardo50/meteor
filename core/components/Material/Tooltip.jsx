import DefaultTooltip from '@material-ui/core/Tooltip';
import { withProps } from 'recompose';

export default withProps({ leaveDelay: 100, interactive: true })(
  DefaultTooltip,
);
