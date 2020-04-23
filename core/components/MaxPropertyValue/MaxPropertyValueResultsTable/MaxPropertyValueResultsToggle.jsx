import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';

import Toggle from '../../Toggle';
import T from '../../Translation';

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
          <T
            id={
              isSmallMobile
                ? 'MaxPropertyValueResultsToggle.leastCompetitiveShort'
                : 'MaxPropertyValueResultsToggle.leastCompetitive'
            }
          />
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
          <T
            id={
              isSmallMobile
                ? 'MaxPropertyValueResultsToggle.mostCompetitiveShort'
                : 'MaxPropertyValueResultsToggle.mostCompetitive'
            }
          />
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
