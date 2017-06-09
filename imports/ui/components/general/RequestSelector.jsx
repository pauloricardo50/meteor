import React, { PropTypes } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import BuildingIcon from 'material-ui/svg-icons/communication/business';
import HomeIcon from 'material-ui/svg-icons/action/home';

import { T } from '/imports/ui/components/general/Translation.jsx';

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
    console.log('new request!');
  } else if (value !== props.currentValue) {
    props.history.push(`/app/requests/${value}`);
  }
};

const renderSelected = ({ props }) =>
  <span style={{ display: 'flex', alignItems: 'center' }}>
    {React.cloneElement(props.leftIcon, {
      style: { marginLeft: 8, marginRight: 16, color: '#757575' },
    })}
    {props.primaryText}
  </span>;

const RequestSelector = props =>
  <div style={styles.div}>
    <DropDownMenu
      value={props.currentValue}
      onChange={(e, i, value) => handleChange(value, props)}
      autoWidth={false}
      style={styles.dropdown}
      selectionRenderer={(value, item) => renderSelected(item)}
    >
      {props.loanRequests.map(r =>
        <MenuItem
          key={r._id}
          value={r._id}
          primaryText={r.name}
          leftIcon={r.property.style === 'villa' ? <HomeIcon /> : <BuildingIcon />}
        />,
      )}
      {props.loanRequests.length > 0 && <Divider />}
      <MenuItem value={0} primaryText={<T id="RequestSelector.addRequest" />} />
    </DropDownMenu>
  </div>;

RequestSelector.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  currentValue: PropTypes.string,
};

RequestSelector.defaultProps = {
  loanRequests: [],
  currentValue: '',
};

export default RequestSelector;
