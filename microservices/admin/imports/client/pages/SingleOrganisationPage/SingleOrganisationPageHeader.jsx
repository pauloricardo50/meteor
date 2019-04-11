// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';

import T from 'core/components/Translation/Translation';
import Chip from 'core/components//Material/Chip';
import OrganisationModifier from './OrganisationModifier';

type SingleOrganisationPageHeaderProps = {
  organisation: Object,
  history: Object,
};

const SingleOrganisationPage = ({
  organisation,
  history,
  intl: { formatMessage },
}: SingleOrganisationPageHeaderProps) => {
  const { logo, name, type, features = [], address, tags = [] } = organisation;
  return (
    <>
      <div className="single-organisation-page-header">
        <h1>
          <span className="flex flex-row center">
            {logo ? <img src={logo} alt={name} /> : name}
            <div className="single-organisation-page-header-type secondary">
              <T id={`Forms.type.${type}`} />
              <small className="secondary">
                {features
                  .map(feature =>
                    formatMessage({ id: `Forms.features.${feature}` }))
                  .join(', ')}
              </small>
              <small className="flex center space-children">
                {tags.map(tag => (
                  <Chip
                    label={formatMessage({ id: `Forms.tags.${tag}` })}
                    key={tag}
                    onClick={() =>
                      history.push(`/organisations?${queryString.stringify(
                        { tags: [tag] },
                        { arrayFormat: 'bracket' },
                      )}`)
                    }
                  />
                ))}
              </small>
            </div>
          </span>
        </h1>
        <OrganisationModifier organisation={organisation} />
      </div>
      <p>{address}</p>
    </>
  );
};

export default compose(
  withRouter,
  injectIntl,
)(SingleOrganisationPage);
