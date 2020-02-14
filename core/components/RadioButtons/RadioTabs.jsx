import React, { useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import colors from 'core/config/colors';

const StyledTabs = withStyles({
  root: {
    minHeight: 40,
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: colors.primary,
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    minWidth: 72,
    marginRight: theme.spacing(2),
    minHeight: 40,
    padding: 0,
    '&:hover': {
      color: colors.primary,
      opacity: 0.8,
    },
    '&$selected': {
      color: colors.primary,
    },
    '&:focus': {
      color: colors.primary,
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />);

const RadioTabs = ({ options, value, onChange, ...props }) => {
  useEffect(() => {
    onChange(value);
  }, []);
  return (
    <StyledTabs
      {...props}
      value={options.findIndex(({ id }) => id === value)}
      onChange={(e, index) => onChange(options[index].id)}
      centered
    >
      {options.map(option => (
        <StyledTab key={option.id} label={option.label} />
      ))}
    </StyledTabs>
  );
};

export default RadioTabs;
