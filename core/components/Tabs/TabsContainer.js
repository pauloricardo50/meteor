import { withStyles } from '@material-ui/core/styles';
import { withProps, compose } from 'recompose';

import withMatchParam from '../../containers/withMatchParam';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
  },
  labelContainer: {
    paddingRight: 12,
    paddingLeft: 12,
  },
});

export default compose(
  withStyles(styles),
  withMatchParam(({ routerParamName }) => routerParamName),
  withProps(({ routerParamName, tabs, ...props }) => {
    if (!routerParamName) {
      return {};
    }

    const routerParam = props[routerParamName];

    if (!routerParam) {
      return { initialIndex: 0 };
    }

    return { initialIndex: tabs.map(tab => tab.id).indexOf(routerParam) };
  }),
);
