import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { sendEnrollmentEmail, toggleAccount } from 'core/api';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import EmailModifier from 'core/components/EmailModifier';
import Icon from 'core/components/Icon';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Roles from 'core/components/Roles';
import Toggle from 'core/components/Toggle';
import TooltipArray from 'core/components/TooltipArray';
import T from 'core/components/Translation';
import UpdateField from 'core/components/UpdateField';

import UserAssignDropdown from '../../components/AssignAdminDropdown/UserAssignDropdown';
import RolePicker from '../../components/RolePicker';
import { UserModifier } from '../../components/UserDialogForm';
import LastSeen from './LastSeen';
import ReferredByAssignDropdown from './ReferredByAssignDropdown';
import ReferredByOrganisationAssignDropdown from './ReferredByOrganisationAssignDropdown';
import UserDeleter from './UserDeleter';

const SingleUserPageHeader = ({ user, currentUser }) => {
  const {
    _id: userId,
    assignedEmployee,
    createdAt,
    roles = [],
    phoneNumbers,
    name,
    email,
    organisations = [],
    emails = [],
    isDisabled,
  } = user;
  const { roles: currentUserRoles = [] } = currentUser || {};
  const allowAssign =
    currentUserRoles.includes(ROLES.DEV) ||
    (!roles.includes(ROLES.DEV) && !roles.includes(ROLES.ADMIN));
  const emailVerified = !!emails.length && emails[0].verified;
  const toggleUserAccount = () => toggleAccount.run({ userId });

  return (
    <div className="single-user-page-header">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <div className="top">
        <h1>
          {name}

          <small className="secondary">
            &nbsp;-&nbsp;
            <Roles roles={roles} />
          </small>

          <RolePicker userId={userId} />
        </h1>
        <UserModifier user={user} />
        <ConfirmMethod
          method={() => sendEnrollmentEmail.run({ userId })}
          label="Envoyer email d'invitation"
          keyword="ENVOYER"
        />
        <UserDeleter user={user} currentUser={currentUser} />
        <ImpersonateLink user={user} className="impersonate-link" />
      </div>
      <Toggle
        labelLeft={<T id="SingleUserPage.Enabled" />}
        toggled={!isDisabled}
        onToggle={toggleUserAccount}
      />
      <div className="bottom">
        <div>
          <LastSeen userId={userId} />
        </div>
        <div className="organisations">
          {!!organisations.length && (
            <TooltipArray
              items={organisations.map(organisation => (
                <CollectionIconLink
                  key={organisation._id}
                  relatedDoc={{
                    ...organisation,
                    collection: ORGANISATIONS_COLLECTION,
                  }}
                />
              ))}
              title="Organisations"
            />
          )}
        </div>
        <div className="email">
          <Icon type="mail" /> <a href={`mailto:${email}`}>{email}</a>
          <Tooltip
            title={
              emailVerified
                ? "Cette adresse email a été vérifiée, le client s'est connecté avec."
                : "Cette adresse email n'a pas été vérifiée, le client ne s'est pas connecté avec."
            }
          >
            <FontAwesomeIcon
              icon={emailVerified ? faCheckCircle : faExclamationCircle}
              className={cx(
                emailVerified ? 'email-verified' : 'email-unverified',
              )}
            />
          </Tooltip>{' '}
          <EmailModifier userId={userId} email={email} />
        </div>
        {!!(phoneNumbers && phoneNumbers.length) && (
          <div className="phone">
            <Icon type="phone" />{' '}
            <TooltipArray
              title="Numéros de téléphone"
              items={phoneNumbers.map(number => (
                <a key={number} href={`tel:${number}`}>
                  <span>
                    {number}
                    &nbsp;
                  </span>
                </a>
              ))}
            />
          </div>
        )}

        <p className="secondary created-at">
          <T id="UsersTable.createdAt" />{' '}
          {moment(createdAt).format('D MMM YY à HH:mm:ss')}
        </p>

        {allowAssign && (
          <div className="flex-col">
            <div className="assigned-employee space-children">
              {assignedEmployee && (
                <>
                  <T id="UsersTable.assignedTo" />
                  <CollectionIconLink
                    relatedDoc={{
                      ...assignedEmployee,
                      collection: USERS_COLLECTION,
                    }}
                  />
                </>
              )}
              <UserAssignDropdown doc={user} />
            </div>
            <div className="assigned-employee space-children">
              <ReferredByAssignDropdown user={user} />
            </div>
            <div className="assigned-employee space-children">
              <ReferredByOrganisationAssignDropdown user={user} />
            </div>
            <div>
              <UpdateField
                collection={USERS_COLLECTION}
                doc={user}
                fields={['acquisitionChannel']}
                autosaveDelay={250}
                style={{ maxWidth: 250 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SingleUserPageHeader.propTypes = {
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default SingleUserPageHeader;
