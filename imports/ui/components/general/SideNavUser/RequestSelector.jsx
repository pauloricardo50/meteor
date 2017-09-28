import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import track from '/imports/js/helpers/analytics';
import Select from '../Select';
import Divider from '../Material/Divider';

const styles = {
  div: {
    width: '75%',
    height: 64,
    display: 'flex',
    alignItems: 'center',
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

const getOptions = (props) => {
  const array = [];

  props.loanRequests.forEach(r =>
    array.push({
      id: r._id,
      label: r.name,
      icon: r.property.style === 'villa' ? 'home' : 'building',
    }),
  );

  array.push(<Divider key="divider" />);
  array.push({ id: 0, label: <T id="RequestSelector.addRequest" /> });

  return array;
};

const RequestSelector = props => (
  <div style={styles.div}>
    <Select
      id="request-selector"
      value={props.currentValue}
      onChange={(id, value) => handleChange(value, props)}
      options={getOptions(props)}
      style={styles.dropdown}
    />
  </div>

  // <div style={styles.div}>
  //   <DropDownMenu
  //     value={props.currentValue}
  //     onChange={(e, i, value) => handleChange(value, props)}
  //     autoWidth={false}
  //     style={styles.dropdown}
  //     selectionRenderer={(value, item) => renderSelected(item)}
  //   >
  //     {props.loanRequests.map(r => (
  //       <MenuItem
  //         key={r._id}
  //         value={r._id}
  //         primaryText={r.name}
  //         leftIcon={
  //           r.property.style === 'villa' ? (
  //             <Icon type="home" />
  //           ) : (
  //             <Icon type="building" />
  //           )
  //         }
  //       />
  //     ))}
  //     {props.loanRequests.length > 0 && <Divider />}
  //     <MenuItem value={0} primaryText={<T id="RequestSelector.addRequest" />} />
  //   </DropDownMenu>
  // </div>
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
