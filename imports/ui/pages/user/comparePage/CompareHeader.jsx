import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';
import LoopIcon from 'material-ui/svg-icons/av/loop';
import IconButton from 'material-ui/IconButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import LockClosed from 'material-ui/svg-icons/action/lock-outline';

import { T } from '/imports/ui/components/general/Translation.jsx';
import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';

import CustomFieldAdder from './CustomFieldAdder.jsx';
import FilterIcon from './FilterIcon.jsx';
import SortIcon from './SortIcon.jsx';

const renderField = (props, field) => {
  const { id, type, name, custom } = field;
  const text = custom ? name : <T id={`Comparator.${id}`} />;
  let icon;

  if (type === 'boolean') {
    icon = (
      <FilterIcon filtered={props.filtering.find(filt => filt.id === id)} />
    );
  } else {
    icon = <SortIcon sorted={props.sorting.find(sort => sort.id === id)} />;
  }

  return (
    <div className="content">
      <span className="text">
        {text}
      </span>
      {icon}
    </div>
  );
};

export default class CompareHeader extends Component {
  constructor(props) {
    super(props);

    this.state = { pinHeader: true };
  }

  togglePin = () => this.setState(prev => ({ pinHeader: !prev.pinHeader }));

  render() {
    const {
      fields,
      handleReset,
      onHoverEnter,
      onHoverLeave,
      handleFilter,
      handleSort,
      addCustomField,
      hovered,
      scrollLeft,
    } = this.props;

    const { pinHeader } = this.state;

    return (
      <ul
        className="mask1 compare-column header-column"
        ref={node => {
          this.node = node;
        }}
        style={{
          position: 'absolute',
          left: pinHeader ? Math.max(scrollLeft, 16) : 16,
          zIndex: 2,
          transition: 'left 200ms ease-in-out',
          marginBottom: 0,
        }}
      >
        <li
          className="text-center"
          style={{ position: 'relative', overflow: 'visible' }}
        >
          <Button
            label="Reset"
            onTouchTap={handleReset}
            icon={<LoopIcon style={{ color: 'white' }} />}
            style={{ color: 'white' }}
          />
          <IconButton
            tooltip="Pin"
            onTouchTap={this.togglePin}
            style={{ position: 'absolute', right: 0, top: 0 }}
          >
            {pinHeader
              ? <LockClosed color="white" />
              : <LockOpen color="white" />}
          </IconButton>
        </li>
        {fields.map(field =>
          <li
            key={field.id}
            onMouseEnter={() => onHoverEnter(field.id)}
            onMouseLeave={onHoverLeave}
            className={hovered === field.id && 'hovered'}
            onTouchTap={
              field.type === 'boolean'
                ? () => handleFilter(field.id)
                : () => handleSort(field.id)
            }
          >
            {renderField(this.props, field)}
          </li>,
        )}

        <li>
          <DialogSimple
            label="+"
            primary
            passProps
            actions={[]}
            title={<T id="CustomFieldAdder.title" />}
          >
            <CustomFieldAdder addCustomField={addCustomField} />
          </DialogSimple>
        </li>
      </ul>
    );
  }
}

CompareHeader.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  sorting: PropTypes.arrayOf(PropTypes.object),
  filtering: PropTypes.arrayOf(PropTypes.object),
  handleSort: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  addCustomField: PropTypes.func.isRequired,
  onHoverEnter: PropTypes.func.isRequired,
  onHoverLeave: PropTypes.func.isRequired,
  hovered: PropTypes.string,
  scrollLeft: PropTypes.number.isRequired,
};

CompareHeader.defaultProps = {
  sorting: [],
  filtering: [],
  hovered: undefined,
};
