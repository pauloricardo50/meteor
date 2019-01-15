// @flow
import React from 'react';

import formatMessage from 'core/utils/intl';
import T from 'core/components/Translation/Translation';
import Chip from 'core/components//Material/Chip';
import OrganisationModifier from './OrganisationModifier';

type SingleOrganisationPageHeaderProps = {
  organisation: Object,
};

const SingleOrganisationPage = ({
  organisation,
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
                  .map(feature => formatMessage(`Forms.features.${feature}`))
                  .join(', ')}
              </small>
              <small className="flex center space-children">
                {tags.map(tag => (
                  <Chip label={formatMessage(`Forms.tags.${tag}`)} key={tag} />
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

export default SingleOrganisationPage;
