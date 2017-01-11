import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


const styles = {
  subtitle: {
    marginTop: 40,
    marginBottom: 0,
    display: 'inline-block',
  },
  p: {
    padding: '40px 0px',
  },
};

var savingTimeout;

export default class Step3FinancialForm extends Component {
  constructor(props) {
    super(props);

    this.getIncomeFormArray = this.getIncomeFormArray.bind(this);
    this.getFortuneFormArray = this.getFortuneFormArray.bind(this);
    this.getInsuranceFormArray = this.getInsuranceFormArray.bind(this);
    this.getFormArray = this.getFormArray.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getIncomeFormArray(index) {
    const r = this.props.loanRequest;

    return [
      {
        type: 'h2',
        text: r.borrowers[index].firstName || `Emprunteur ${index + 1}`,
        showCondition: r.borrowers.length > 1,
      }, {
        type: 'h3',
        text: 'Revenus',
        // showCondition: index === 0,
      }, {
        type: 'TextInputMoney',
        label: 'Revenus bruts annuels',
        placeholder: 'CHF 50\'000',
        id: `borrowers.${index}.grossIncome`,
        currentValue: r.borrowers[index].grossIncome,
      },
      // {
      //   type: 'TextInputMoney',
      //   label: 'Autres revenus',
      //   placeholder: '',
      //   id: `personalInfo.borrowers.${index}.otherIncome`,
      //   currentValue: rp.borrowers[index].otherIncome,
      // },
    ];
  }

  getFortuneFormArray(index) {
    const r = this.props.loanRequest;

    return [
      {
        type: 'h3',
        text: 'Fortune',
        // showCondition: index === 0,
      }, {
        type: 'TextInputMoney',
        label: 'Biens immobiliers existants',
        placeholder: 'CHF 500\'000',
        id: `borrowers.${index}.realEstateFortune`,
        currentValue: r.borrowers[index].realEstateFortune,
      }, {
        type: 'TextInputMoney',
        label: 'Cash et titres',
        placeholder: 'CHF 100\'000',
        id: `borrowers.${index}.cashAndSecurities`,
        currentValue: r.borrowers[index].cashAndSecurities,
      }, {
        type: 'TextInputMoney',
        label: 'Dette existante',
        placeholder: 'CHF 20\'000',
        id: `borrowers.${index}.existingDebt`,
        currentValue: r.borrowers[index].existingDebt,
      },
      // {
      //   type: 'Autre fortune',
      //   label: 'Cash et titres',
      //   placeholder: 'CHF 100\'000',
      //   id: `borrowers.${index}.otherFortune`,
      //   currentValue: r.borrowers[index].otherFortune,
      // },
    ];
  }

  getInsuranceFormArray(index) {
    const r = this.props.loanRequest;

    return [
      {
        type: 'h3',
        text: 'Assurances',
        // showCondition: index === 0,
      }, {
        type: 'TextInputMoney',
        label: 'LPP / 2ème Pilier',
        placeholder: 'CHF 100\'000',
        id: `borrowers.${index}.insuranceLpp`,
        currentValue: r.borrowers[index].insuranceLpp,
      }, {
        type: 'TextInputMoney',
        label: 'Assurance 3A',
        placeholder: 'CHF 100\'000',
        id: `borrowers.${index}.insurance3A`,
        currentValue: r.borrowers[index].Insurance3A,
      }, {
        type: 'TextInputMoney',
        label: 'Assurance 3B',
        placeholder: 'CHF 100\'000',
        id: `borrowers.${index}.insurance3B`,
        currentValue: r.borrowers[index].insurance3B,
      }, {
        type: 'TextInputMoney',
        label: 'Risque Pure',
        placeholder: 'CHF 100\'000',
        id: `borrowers.${index}.insurancePureRisk`,
        currentValue: r.borrowers[index].insurancePureRisk,
      },
    ];
  }


  getFormArray(index) {
    const array = this.getIncomeFormArray(index);
    array.push(...this.getFortuneFormArray(index));
    array.push(...this.getInsuranceFormArray(index));
    return array;
  }


  render() {
    const twoBorrowers = this.props.loanRequest.borrowers.length > 1;

    return (
      <section className="mask1">
        <h1>{twoBorrowers ?
          'Nos informations économiques'
          :
            'Mes informations économiques'
        }</h1>

        {twoBorrowers &&
          <p
            className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"
            style={styles.p}
          >
            Entrez les informations séparément pour chaque emprunteur, ou ensemble,
            nous les ajouterons dans tous les cas.
          </p>
        }

        <AutoForm
          inputs={this.getFormArray(0)}
          formClasses={twoBorrowers ? 'col-sm-5'
          : 'col-sm-10 col-sm-offset-1'}
          loanRequest={this.props.loanRequest}
        />
        {twoBorrowers &&
          <AutoForm
            inputs={this.getFormArray(1)}
            formClasses="col-sm-offset-2 col-sm-5"
            loanRequest={this.props.loanRequest}
          />
        }
      </section>
    );
  }
}

Step3FinancialForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
