import React from 'react';
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import { T } from '/imports/ui/components/general/Translation';
import Icon from '/imports/ui/components/general/Icon';
import track from '/imports/js/helpers/analytics';

const styles = {
  div: {
    width: '90%',
    marginTop: 8,
    height: 62,
  },
  dropdown: {
    width: '100%',
  },
};

const handleChange = (value, props) => {
  if (value === 0) {
    track('RequestSelector - clicked on new request', {});
    console.log('new request!');
  } else {
    track('RequestSelector - switched to request', { requestId: value });
    props.toggleDrawer();
    props.history.push(`/app/requests/${value}`);
  }
};

const renderSelected = ({ props }) => (
  <span style={{ display: 'flex', alignItems: 'center' }}>
    {React.cloneElement(props.leftIcon, {
      style: { marginLeft: 8, marginRight: 16, color: '#757575' },
    })}
    {props.primaryText}
  </span>
);

const RequestSelector = props => (
  <div style={styles.div}>
    <DropDownMenu
      value={props.currentValue}
      onChange={(e, i, value) => handleChange(value, props)}
      autoWidth={false}
      style={styles.dropdown}
      selectionRenderer={(value, item) => renderSelected(item)}
    >
      {props.loanRequests.map(r => (
        <MenuItem
          key={r._id}
          value={r._id}
          primaryText={r.name}
          leftIcon={
            r.property.style === 'villa' ? (
              <Icon type="home" />
            ) : (
              <Icon type="building" />
            )
          }
        />
      ))}
      {props.loanRequests.length > 0 && <Divider />}
      <MenuItem value={0} primaryText={<T id="RequestSelector.addRequest" />} />
    </DropDownMenu>
  </div>
);

RequestSelector.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  currentValue: PropTypes.string,
  toggleDrawer: PropTypes.func.isRequired,
};

RequestSelector.defaultProps = {
  loanRequests: [],
  currentValue: '',
};

export default RequestSelector;
