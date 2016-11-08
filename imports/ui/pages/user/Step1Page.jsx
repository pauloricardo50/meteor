import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


const styles = {
  ul: {
    padding: 0,
  },
};

const todoCards = [
  {
    title: 'Check-up initial',
    duration: '5 min',
  }, {
    title: 'Mes Partenaires Financiers Particuliers',
    duration: '20 sec',
  }, {
    title: 'Ma déclaration d\'impôts',
    duration: '5 sec',
  }, {
    title: 'Évaluer mon bien immobilier',
    duration: '2 min',
  },
];


export default class Step1Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: this.getPercentages(),
    };

    this.setProgress = this.setProgress.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
  }


  getPercentages() {
    let part1 = 0;
    let part2 = 0;
    let part3 = 0;
    let part4 = 0;
    const r = this.props.creditRequest;

    // all values from the forms
    const part1Values = [
      r.personalInfo.twoBuyers, r.personalInfo.age2, r.personalInfo.age1, r.propertyInfo.type,
      r.financialInfo.salary, r.financialInfo.bonusExists, r.financialInfo.fortune,
      r.financialInfo.insuranceFortune, r.propertyInfo.value,
    ];
    const part2Values = [
      r.financialInfo.personalBank, r.financialInfo.corporateBankExists,
      r.financialInfo.corporateBank, r.financialInfo.avoidLenderExists, r.financialInfo.avoidLender,
    ];

    let length1 = part1Values.length;
    let length2 = part2Values.length;

    if (r.personalInfo.twoBuyers === 'false') { length1 -= 1; } // Don't count age2
    if (r.personalInfo.bonusExists === 'false') { length1 -= 1; } // Don't count bonus
    if (r.financialInfo.corporateBankExists === 'false') { length2 -= 1; } // Don't count corporate bank
    if (r.financialInfo.avoidLenderExists === 'false') { length2 -= 1; } // Don't count avoided lender


    // Filter out values
    part1 = Math.round((part1Values.filter(this.filterFunc).length / length1) * 100);
    part2 = Math.round((part2Values.filter(this.filterFunc).length / length2) * 100);


    return [part1, part2, part3, part4];
  }


// TODO: remove this, progress should come from the database
  setProgress(i, newPercent) {
    this.setState({
      progress: this.state.progress.map(
        (currentPercent, index3) => ((index3 === i) ? newPercent : currentPercent)
      ),
    });
  }


  // Only return true for values which aren't equal to 0, or an empty string
  filterFunc(value) {
    return value !== 0 && value !== '' && value !== undefined && value !== null;
  }


  render() {
    return (
      <section>
        <div
          className="text-center"
          id="todo-text-top"
        >
          Appuyez sur une carte incomplète pour avancer
        </div>
        <hr id="todo-hr-top" />
        <ul style={styles.ul}>
          {todoCards.map((card, index) =>
            (<TodoCard
              title={card.title}
              duration={card.duration}
              completionPercentage={this.state.progress[index]}
              setProgress={this.setProgress}
              cardId={`1-${index + 1}`}
              key={index}
            />)
          )}
        </ul>
      </section>
    );
  }
}

Step1Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
