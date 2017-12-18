import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DialogSimple from 'core/components/DialogSimple';
import IconButton from 'core/components/IconButton';
import Icon from '/imports/ui/components/general/Icon';
import Button from 'core/components/Button';

import CustomFieldAdder from './CustomFieldAdder';
import FilterIcon from './FilterIcon';
import SortIcon from './SortIcon';

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
      <span className="text">{text}</span>
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
      addCustomField,
      handleReset,
      onHoverEnter,
      onHoverLeave,
      handleFilter,
      handleSort,
      hovered,
      scrollLeft,
      noProperties,
    } = this.props;

    const { pinHeader } = this.state;

    return (
      <ul
        className="mask1 compare-column header-column"
        ref={(node) => {
          this.node = node;
        }}
        style={{
          // Make sure the header stays in palce if no properties are shown
          // this is due to overflow and absolute not mixing well
          position: noProperties ? 'relative' : 'absolute',
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
            dense
            label="Reset"
            onClick={handleReset}
            icon={<Icon type="loop" style={{ color: 'white' }} />}
            style={{ color: 'white' }}
          />
          <IconButton
            type={pinHeader ? 'lock' : 'lockOpen'}
            tooltip="Pin"
            onClick={this.togglePin}
            style={{ position: 'absolute', right: 0, top: 0 }}
            iconStyle={{ color: 'white' }}
          />
        </li>
        {fields.map(field => (
          <li
            key={field.id}
            onMouseEnter={() => onHoverEnter(field.id)}
            onMouseLeave={onHoverLeave}
            className={hovered === field.id && 'hovered'}
            onClick={
              field.type === 'boolean'
                ? () => handleFilter(field.id)
                : () => handleSort(field.id)
            }
          >
            {renderField(this.props, field)}
          </li>
        ))}

        <li>
          {/* <DialogSimple
            label="+"
            primary
            passProps
            actions={[]}
            title={<T id="CustomFieldAdder.title" />}
            buttonProps={{ dense: true }}
          > */}
          <CustomFieldAdder addCustomField={addCustomField} />
          {/* </DialogSimple> */}
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
