import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';
import ExpertiseResult from './expertisePage/ExpertiseResult.jsx';

const fakeExpertiseResult = {
  result: Math.random() < 0.5 ? 'high' : 'normal',
};

const handleClick = requestId => {
  const object = {};
  object['logic.expertiseDone'] = true;
  cleanMethod('updateRequest', object, requestId);
};

const ExpertisePage = props => {
  let content = null;

  if (props.loanRequest.logic.expertiseDone) {
    content = <ExpertiseResult expertiseResult={fakeExpertiseResult} />;
  } else {
    content = (
      <div>
        <div className="description">
          <p>
            <AutoTooltip>
              En cliquant sur continuer, nous ferons passer à votre future propriété une expertise en ligne. Ça révelera si votre propriété est au prix correct.
            </AutoTooltip>
          </p>
        </div>

        <div className="text-center" style={{ margin: '40px 0' }}>
          <RaisedButton
            label="Lancer l'expertise"
            primary
            onTouchTap={() => handleClick(props.loanRequest._id)}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="mask1">
      <h1>L'Expertise</h1>

      {content}
    </section>
  );
};

ExpertisePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ExpertisePage;
