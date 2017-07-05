import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import LoopIcon from 'material-ui/svg-icons/av/loop';

import { T } from '/imports/ui/components/general/Translation.jsx';
import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';

import CustomFieldAdder from './CustomFieldAdder.jsx';
import FilterIcon from './FilterIcon.jsx';
import SortIcon from './SortIcon.jsx';

const renderField = (props, field) => {
  const text = field.custom ? field.name : <T id={`Comparator.${field.id}`} />;
  let icon;
  const { id, type } = field;

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

const CompareHeader = props =>
  (<ul className="mask1 compare-column header-column">
    <li className="text-center">
      <FlatButton
        label="Reset"
        onTouchTap={props.handleReset}
        icon={<LoopIcon style={{ color: 'white' }} />}
        style={{ color: 'white' }}
        disabled={props.filtering.length === 0 && props.sorting.length === 0}
      />
    </li>
    {props.fields.map(field =>
      (<li
        key={field.id}
        onMouseEnter={() => props.onHoverEnter(field.id)}
        onMouseLeave={props.onHoverLeave}
        className={props.hovered === field.id && 'hovered'}
        onTouchTap={
          field.type === 'boolean'
            ? () => props.handleFilter(field.id)
            : () => props.handleSort(field.id)
        }
      >
        {renderField(props, field)}
      </li>),
    )}

    <li>
      <DialogSimple
        label="+"
        primary
        passProps
        actions={[]}
        title={<T id="CustomFieldAdder.title" />}
      >
        <CustomFieldAdder addCustomField={props.addCustomField} />
      </DialogSimple>
    </li>
  </ul>);

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
};

CompareHeader.defaultProps = {
  sorting: [],
  filtering: [],
  hovered: undefined,
};

export default CompareHeader;
