import React from 'react';
import queryString from 'query-string';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { organisationRemove } from 'core/api/organisations/methodDefinitions';
import { ROLES } from 'core/api/users/userConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import Chip from 'core/components/Material/Chip';
import T from 'core/components/Translation/Translation';

import OrganisationModifier from './OrganisationModifier';

const SingleOrganisationPage = ({
  organisation,
  history,
  intl: { formatMessage },
  currentUser,
}) => {
  const {
    _id: organisationId,
    logo,
    name,
    type,
    features = [],
    address,
    tags = [],
  } = organisation;
  return (
    <>
      <div className="single-organisation-page-header">
        <span className="flex flex-row center">
          {logo ? <img src={logo} alt={name} /> : name}
          <div className="single-organisation-page-header-type">
            <h1>{name}</h1>
            <h2 className="secondary">
              <T id={`Forms.type.${type}`} />
              {features.length > 0 && <>&nbsp;-&nbsp;</>}
              {features
                .map(feature =>
                  formatMessage({ id: `Forms.features.${feature}` }),
                )
                .join(', ')}
            </h2>
            <h3 className="flex center space-children">
              {tags.map(tag => (
                <Chip
                  label={formatMessage({ id: `Forms.tags.${tag}` })}
                  key={tag}
                  onClick={() =>
                    history.push(
                      `/organisations?${queryString.stringify(
                        { tags: [tag] },
                        { arrayFormat: 'bracket' },
                      )}`,
                    )
                  }
                />
              ))}
            </h3>
          </div>
        </span>
        <div>
          {currentUser.roles.includes(ROLES.DEV) && (
            <ConfirmMethod
              keyword={name}
              buttonProps={{
                outlined: true,
                error: true,
                label: 'Supprimer',
                className: 'mr-8',
              }}
              method={() => organisationRemove.run({ organisationId })}
              type="modal"
            />
          )}
          <OrganisationModifier organisation={organisation} />
        </div>
      </div>
      <p>{address}</p>
    </>
  );
};

export default compose(withRouter, injectIntl)(SingleOrganisationPage);
