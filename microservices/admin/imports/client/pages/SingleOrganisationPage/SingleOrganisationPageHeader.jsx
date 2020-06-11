import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import queryString from 'query-string';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { organisationRemove } from 'core/api/organisations/methodDefinitions';
import { ROLES } from 'core/api/users/userConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import Chip from 'core/components/Material/Chip';
import T from 'core/components/Translation/Translation';

import Advisor from '../../components/Advisor/Advisor';
import OrganisationModifier from './OrganisationModifier';

const SingleOrganisationPage = ({ organisation, currentUser }) => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const {
    _id: organisationId,
    address,
    assignedEmployeeId,
    features = [],
    logo,
    name,
    tags = [],
    type,
  } = organisation;
  return (
    <>
      <div className="single-organisation-page-header">
        <div className="flex flex-row center">
          {logo ? <img src={logo} alt={name} /> : name}

          <div className="single-organisation-page-header-type">
            <div className="flex center-align">
              <h1 className="mr-8">{name}</h1>
              <Advisor
                advisorId={assignedEmployeeId}
                tooltip="Conseiller par défaut des referrals"
              />
            </div>

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
        </div>

        <div>
          {Roles.userIsInRole(currentUser, ROLES.DEV) && (
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

export default SingleOrganisationPage;
