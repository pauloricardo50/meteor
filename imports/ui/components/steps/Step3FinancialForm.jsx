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

    this.getFortuneFormArray = this.getFortuneFormArray.bind(this);
    this.getInsuranceFormArray = this.getInsuranceFormArray.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getFortuneFormArray(index) {
    const r = this.props.loanRequest;

    return [
      {
        type: 'Subtitle',
        text: r.borrowers[index].firstName || `Emprunteur ${index + 1}`,
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


  render() {
    return (
      <section className="mask1">
        <h1>{this.props.loanRequest.borrowers.length > 1 ?
          'Nos informations économiques'
          :
            'Mes informations économiques'
        }</h1>

        {this.props.loanRequest.borrowers.length > 1 &&
          <p
            className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"
            style={styles.p}
          >
            Entrez les informations séparément pour chaque emprunteur, ou ensemble,
            nous les ajouterons dans tous les cas.
          </p>
        }

        <h2 style={styles.subtitle} className="col-xs-12">Fortune</h2>

        <AutoForm
          inputs={this.getFortuneFormArray(0)}
          formClasses={this.props.loanRequest.borrowers.length > 1 ? 'col-sm-5'
          : 'col-sm-10 col-sm-offset-1'}
          loanRequest={this.props.loanRequest}
        />
        {this.props.loanRequest.borrowers.length > 1 &&
          <AutoForm
            inputs={this.getFortuneFormArray(1)}
            formClasses="col-sm-offset-2 col-sm-5"
            loanRequest={this.props.loanRequest}
          />
        }

        <h2 style={styles.subtitle} className="col-xs-12">Assurances</h2>

        <AutoForm
          inputs={this.getInsuranceFormArray(0)}
          formClasses={this.props.loanRequest.borrowers.length > 1 ? 'col-sm-5'
          : 'col-sm-10 col-sm-offset-1'}
          loanRequest={this.props.loanRequest}
        />
        {this.props.loanRequest.borrowers.length > 1 &&
          <AutoForm
            inputs={this.getInsuranceFormArray(1)}
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
