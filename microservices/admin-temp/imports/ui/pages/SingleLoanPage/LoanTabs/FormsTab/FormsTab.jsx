import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// import SelectField from 'core/components/Material/SelectField';
// import MenuItem from 'core/components/Material/MenuItem';
import Toggle from 'core/components/Material/Toggle';
import Select from 'core/components/Select';

import AutoForm from 'core/components/AutoForm';

import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import {
  getBorrowerInfoArray,
  getBorrowerFinanceArray,
} from 'core/arrays/BorrowerFormArray';
import { IntlNumber } from 'core/components/Translation';

import FilesVerification from './FilesVerification';
import ClosingVerification from './ClosingVerification';

const getBorrowerForms = (borrowers) => {
  const array = [];
  borrowers.forEach((b, i) => {
    array.push({
      id: `borrower.${b._id}.personal`,
      label: `Emprunteur ${i + 1} Perso`,
    });
    array.push({
      id: `borrower.${b._id}.finance`,
      label: `Emprunteur ${i + 1} Finances`,
    });
    array.push({
      id: 'files',
      label: 'Documents',
    });
  });

  return array;
};

const getLoanForms = loan => [
  {
    id: `loan.${loan._id}.property`,
    label: 'Bien immobilier',
  },
  {
    id: 'closing',
    label: 'Décaissement',
  },
];

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
          inputs={getBorrowerInfoArray({
            ...props,
            borrowerId: splittedValue[1],
          })}
          formClasses="user-form"
          docId={splittedValue[1]}
          updateFunc="borrowerUpdate"
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
          inputs={getBorrowerFinanceArray({
            ...props,
            borrowerId: splittedValue[1],
          })}
          borrowers={props.borrowers}
          docId={splittedValue[1]}
          updateFunc="borrowerUpdate"
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
  case 'loan': {
    return (
      <div>
        <AutoForm
          key={`${value}1`}
          inputs={getPropertyLoanArray(props)}
          docId={props.loan._id}
          updateFunc="updateLoan"
          pushFunc="pushLoanValue"
          popFunc="popLoanValue"
          doc={props.loan}
          disabled={!modify}
          noPlaceholders
          admin
        />
        <AutoForm
          key={`${value}2`}
          inputs={getPropertyArray(props)}
          docId={props.property._id}
          updateFunc="updateProperty"
          pushFunc="pushPropertyValue"
          popFunc="popPropertyValue"
          doc={props.property}
          disabled={!modify}
          noPlaceholders
          admin
        />
      </div>
    );
  }
  case 'files':
    return (
      <FilesVerification
        loan={props.loan}
        borrowers={props.borrowers}
        property={props.property}
      />
    );
  case 'closing':
    return (
      <ClosingVerification
        loan={props.loan}
        borrowers={props.borrowers}
        property={props.property}
      />
    );
  default:
    throw new Error('invalid form id value');
  }
};

// 1. Takes the form array and filters out the fields that aren't required
// 2. if this is a conditional input, push the first value only
// 3. Verifies if the id exists in the validationArray,
// and adds 1 normalized by the length of the array to get a value between
// 0 and 1
const reduceToPercent = (formArray, validationArray) =>
  formArray
    .filter(i => i.condition !== false && i.ignore !== true)
    .map(i => (i.type === 'conditionalInput' ? i.inputs[0] : i))
    .reduce(
      (tot, i, index, array) =>
        (get(validationArray, i.id) ? tot + 1 / array.length : tot),
      0,
    );

const getPercent = (props) => {
  const percentages = [
    reduceToPercent(getPropertyLoanArray(props), props.loan.adminValidation),
  ];

  percentages.push(reduceToPercent(getPropertyArray(props), props.property.adminValidation));

  props.borrowers.forEach((b) => {
    percentages.push(reduceToPercent(
      getBorrowerFinanceArray({ ...props, borrowerId: b._id }),
      b.adminValidation,
    ));
    percentages.push(reduceToPercent(
      getBorrowerInfoArray({ ...props, borrowerId: b._id }),
      b.adminValidation,
    ));
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
    percentages.map(p => Number(p.toFixed(3))).reduce((p, c) => p + c, 0) /
      percentages.length
  );
};

const getSelectOptions = (borrowers, loan) => {
  const borrowerForms = getBorrowerForms(borrowers);
  const loanForms = getLoanForms(loan);

  return [...borrowerForms, ...loanForms];
};

export default class FormsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modify: false,
      value: `loan.${props.loan._id}.property`,
    };
  }

  handleChange = (_, value) => this.setState({ value });
  handleToggle = (event, isInputChecked) =>
    this.setState({ modify: isInputChecked });

  render() {
    const { borrowers, loan } = this.props;
    return (
      <section>
        <Select
          label="Formulaire"
          value={this.state.value}
          onChange={this.handleChange}
          options={getSelectOptions(borrowers, loan)}
          style={{ width: '100%', maxWidth: 250 }}
        />
        <Toggle
          label="Peut modifier"
          toggled={this.state.modify}
          onToggle={this.handleToggle}
          style={{ width: 'unset' }}
        />

        <div>
          Vérification:{' '}
          <IntlNumber value={getPercent(this.props)} format="percentage" />
        </div>

        <hr />

        {getForm(this.props, this.state.value, this.state.modify)}
      </section>
    );
  }
}

FormsTab.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
