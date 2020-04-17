import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';

import Toggle from '../../Toggle';

const MaxPropertyValueResultsToggle = ({
  showBest,
  setShowBest,
  isSmallMobile,
  minOrganisationName,
  maxOrganisationName,
}) => (
  <Toggle
    className="show-best-toggle"
    toggled={showBest}
    onToggle={setShowBest}
    labelLeft={
      <div className="flex-col">
        <span className={cx({ secondary: showBest })}>
          {isSmallMobile ? 'Le moins compétitif' : 'Prêteur le - compétitif'}
        </span>
        {Meteor.microservice === 'admin' && (
          <span>
            [ADMIN]&nbsp;
            {minOrganisationName}
          </span>
        )}
      </div>
    }
    labelRight={
      <div className="flex-col">
        <span className={cx({ secondary: !showBest })}>
          {isSmallMobile ? 'Le plus compétitif' : 'Prêteur le + compétitif'}
        </span>
        {Meteor.microservice === 'admin' && (
          <span>
            [ADMIN]&nbsp;
            {maxOrganisationName}
          </span>
        )}
      </div>
    }
  />
);
export default MaxPropertyValueResultsToggle;
