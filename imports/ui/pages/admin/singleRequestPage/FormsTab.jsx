import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';

import PropertyFormArray from '/imports/js/arrays/PropertyFormArray';
import {
  getBorrowerInfoArray,
  getBorrowerFinanceArray,
} from '/imports/js/arrays/BorrowerFormArray';

const getBorrowerForms = borrowers => {
  const array = [];
  borrowers.forEach((b, i) => {
    array.push(
      <MenuItem
        value={`borrower.${b._id}.personal`}
        primaryText={`Emprunteur ${i + 1} perso`}
        key={`personal${i}`}
      />,
    );
    array.push(
      <MenuItem
        value={`borrower.${b._id}.finance`}
        primaryText={`Emprunteur ${i + 1} finance`}
        key={`finance${i}`}
      />,
    );
    // array.push(
    //   <MenuItem
    //     value={`borrower.${b._id}.files`}
    //     primaryText={`Emprunteur ${i + 1} fichiers`}
    //     key={`files${i}`}
    //   />,
    // );
  });

  return array;
};

const getRequestForms = request => {
  const array = [];
  array.push(
    <MenuItem value={`request.${request._id}.property`} key="property" primaryText={'Propriété'} />,
  );

  return array;
};

const getForm = (props, value, modify) => {
  if (!value) {
    return null;
  }

  const splittedValue = value.split('.');
  switch (splittedValue[0]) {
    case 'borrower': {
      switch (splittedValue[2]) {
        case 'personal':
          return (
            <AutoForm
              key={value}
              inputs={getBorrowerInfoArray(props.borrowers, splittedValue[1])}
              formClasses="user-form"
              documentId={splittedValue[1]}
              updateFunc="updateBorrower"
              pushFunc="pushBorrowerValue"
              popFunc="popBorrowerValue"
              doc={props.borrowers.find(b => b._id === splittedValue[1])}
              disabled={!modify}
              noPlaceholders
              admin
            />
          );
        case 'finance': {
          return (
            <AutoForm
              key={value}
              inputs={getBorrowerFinanceArray(props.borrowers, splittedValue[1])}
              borrowers={props.borrowers}
              documentId={splittedValue[1]}
              updateFunc="updateBorrower"
              pushFunc="pushBorrowerValue"
              popFunc="popBorrowerValue"
              doc={props.borrowers.find(b => b._id === splittedValue[1])}
              disabled={!modify}
              noPlaceholders
              admin
            />
          );
        }
        case 'files': {
          return null;
        }
        default:
          throw new Error('invalid form id value');
      }
    }
    case 'request': {
      return (
        <AutoForm
          key={value}
          inputs={PropertyFormArray(props.loanRequest, props.borrowers)}
          documentId={props.loanRequest._id}
          updateFunc="updateRequest"
          pushFunc="pushRequestValue"
          popFunc="popRequestValue"
          doc={props.loanRequest}
          disabled={!modify}
          noPlaceholders
          admin
        />
      );
    }
    default:
      throw new Error('invalid form id value');
  }
};

// 1. Takes the form array and filters out the fields that aren't required
// 2. if this is a conditional input, push the first value only
// 3. Verifies if the id exists in the validationArray,
// and adds 1 normalized by the length of the array to get a value between 0 and 1
const reduceToPercent = (formArray, validationArray) =>
  formArray
    .filter(i => i.condition !== false && i.ignore !== true)
    .map(i => (i.type === 'conditionalInput' ? i.inputs[0] : i))
    .reduce(
      (tot, i, index, array) => (get(validationArray, i.id) ? tot + 1 / array.length : tot),
      0,
    );

const getPercent = (request, borrowers) => {
  const percentages = [
    reduceToPercent(PropertyFormArray(request, borrowers), request.adminValidation),
  ];

  borrowers.forEach(b => {
    percentages.push(reduceToPercent(getBorrowerFinanceArray(borrowers, b._id), b.adminValidation));
    percentages.push(reduceToPercent(getBorrowerInfoArray(borrowers, b._id), b.adminValidation));
  });

  // const arr = getBorrowerFinanceArray(borrowers, borrowers[0]._id)
  //   .filter(i => i.condition !== false && i.ignore !== true)
  //   .map(i => (i.type === 'conditionalInput' ? i.inputs[0] : i));
  // console.log(percentages);
  // console.log(arr.map(i => i.id));
  // console.log(arr.length);
  // Return the average of all the percentages
  // Use to Fixed to round out the percentage when it's 0.99999997
  return (
    percentages.length > 0 &&
    percentages.map(p => Number(p.toFixed(3))).reduce((p, c) => p + c, 0) / percentages.length
  );
};

export default class FormsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modify: false,
      value: `request.${props.loanRequest._id}.property`,
    };
  }

  handleChange = (event, index, value) => this.setState({ value });
  handleToggle = (event, isInputChecked) => this.setState({ modify: isInputChecked });

  render() {
    return (
      <section>
        <SelectField
          floatingLabelText="Formulaire"
          value={this.state.value}
          onChange={this.handleChange}
        >
          {getBorrowerForms(this.props.borrowers)}
          {getRequestForms(this.props.loanRequest)}
        </SelectField>
        <Toggle
          label="Peut modifier"
          toggled={this.state.modify}
          onToggle={this.handleToggle}
          style={{ width: 'unset' }}
        />

        <div>
          Vérification:
          {' '}
          {Math.round(getPercent(this.props.loanRequest, this.props.borrowers) * 1000) / 10}
          %
        </div>

        <hr />

        {getForm(this.props, this.state.value, this.state.modify)}
      </section>
    );
  }
}

FormsTab.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
