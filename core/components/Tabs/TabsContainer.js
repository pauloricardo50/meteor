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
    maxWidth: 'unset',
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
    const filteredTabs = tabs.filter(({ condition = true }) => condition);
    if (!routerParamName) {
      return { tabs: filteredTabs };
    }

    const routerParam = props[routerParamName];

    if (!routerParam) {
      return { initialIndex: 0, tabs: filteredTabs };
    }

    return {
      initialIndex: filteredTabs.map(tab => tab.id).indexOf(routerParam),
      tabs: filteredTabs,
    };
  }),
);
