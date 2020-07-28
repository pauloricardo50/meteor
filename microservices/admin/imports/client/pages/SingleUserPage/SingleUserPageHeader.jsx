import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  sendEnrollmentEmail,
  toggleAccount,
} from 'core/api/users/methodDefinitions';
import { ROLES } from 'core/api/users/userConstants';
import Users from 'core/api/users/users';
import NewsletterSignup from 'core/components/AccountPage/NewsletterSignup';
import AssignedRole from 'core/components/AssignedRole';
import ConfirmMethod from 'core/components/ConfirmMethod';
import EmailModifier from 'core/components/EmailModifier';
import Icon from 'core/components/Icon';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Toggle from 'core/components/Toggle';
import TooltipArray from 'core/components/TooltipArray';
import T from 'core/components/Translation';
import IntlDate from 'core/components/Translation/formattingComponents/IntlDate';
import UpdateField from 'core/components/UpdateField';

import RolePicker from '../../components/RolePicker';
import UserAssigneeSelect from '../../components/UserAssigneeSelect';
import { UserModifier } from '../../components/UserDialogForm';
import LastSeen from './LastSeen';
import ReferredByAssignDropdown from './ReferredByAssignDropdown';
import ReferredByOrganisationAssignDropdown from './ReferredByOrganisationAssignDropdown';
import SingleUserPageInformation, {
  SingleUserPageInformationItem,
} from './SingleUserPageInformation';
import UserDeleter from './UserDeleter';
import UserStatusModifier from './UserStatusModifier';

const SingleUserPageHeader = ({ user, currentUser }) => {
  const {
    _id: userId,
    assignedEmployeeCache,
    createdAt,
    roles = [],
    phoneNumbers,
    name,
    email,
    organisations = [],
    emails = [],
    isDisabled,
  } = user;
  const emailVerified = !!emails.length && emails[0].verified;
  const toggleUserAccount = () => toggleAccount.run({ userId });
  const isAdvisor = Roles.userIsInRole(user, ROLES.ADVISOR);
  const currentUserIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);

  return (
    <div className="single-user-page-header">
      <div className="top">
        <h1>
          {name}

          <UserStatusModifier user={user} className="ml-16" />
        </h1>

        <UserModifier user={user} />
        <ConfirmMethod
          method={() => sendEnrollmentEmail.run({ userId })}
          label="Envoyer email d'invitation"
          keyword="ENVOYER"
        />
        <UserDeleter userId={userId} currentUser={currentUser} />
        <ImpersonateLink user={user} className="impersonate-link" />
      </div>

      <SingleUserPageInformation>
        <SingleUserPageInformationItem className="email" label="Email">
          <Icon type="mail" />{' '}
          <a href={`mailto:${email}`}>
            <h4 className="m-0">{email}</h4>
          </a>
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
          <EmailModifier userId={userId} email={email} buttonLabel="Modifier" />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem className="phone" label="Téléphone" C>
          <Icon type="phone" />{' '}
          <h4 className="m-0">
            {phoneNumbers?.length ? (
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
            ) : (
              '-'
            )}
          </h4>
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem
          label="Rôle"
          className="flex center-align"
        >
          <h4 className="m-0 mr-8">
            <AssignedRole roles={roles} />
          </h4>
          <RolePicker userId={userId} />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem label="Créé">
          <Tooltip title={moment(createdAt).format('D MMM YYYY à HH:mm:ss')}>
            <h4 className="m-0">
              <IntlDate type="relative" value={createdAt} style="long" />
            </h4>
          </Tooltip>
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem label="Conseiller e-Potek">
          <UserAssigneeSelect
            userId={userId}
            assignedEmployeeId={assignedEmployeeCache?._id}
          />
        </SingleUserPageInformationItem>

        {isAdvisor && (
          <SingleUserPageInformationItem label="Bureau e-Potek">
            <UpdateField
              collection={Users}
              doc={user}
              fields={['office']}
              autosaveDelay={250}
              style={{ maxWidth: 200 }}
            />
          </SingleUserPageInformationItem>
        )}

        <SingleUserPageInformationItem
          Component="h4"
          label="Statut"
          className="m-0"
        >
          <Toggle
            labelLeft={<T id="SingleUserPage.Enabled" />}
            toggled={!isDisabled}
            onToggle={toggleUserAccount}
            className="disabled-toggle"
          />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem label="Dernière connexion">
          <LastSeen userId={userId} />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem
          Component="h4"
          className="organisations m-0"
          label="Organisations"
        >
          {organisations.length ? (
            <TooltipArray
              items={organisations.map(organisation => (
                <CollectionIconLink
                  key={organisation._id}
                  relatedDoc={organisation}
                />
              ))}
              title="Organisations"
            />
          ) : (
            'Aucune'
          )}
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem
          label="Referral Pro"
          Component="h4"
          className="m-0"
        >
          <ReferredByAssignDropdown user={user} />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem
          label="Referral Pro organisation"
          Component="h4"
          className="m-0"
        >
          <ReferredByOrganisationAssignDropdown user={user} />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem label="Canal d'acquisition">
          <UpdateField
            collection={Users}
            doc={user}
            fields={['acquisitionChannel']}
            autosaveDelay={250}
            style={{ maxWidth: 250, minWidth: 150 }}
          />
        </SingleUserPageInformationItem>

        <SingleUserPageInformationItem label="Newsletter" className="m-0">
          <NewsletterSignup
            userId={userId}
            label={<h4 className="m-0">Inscrit</h4>}
          />
        </SingleUserPageInformationItem>

        {isAdvisor && (
          <SingleUserPageInformationItem label="Round robin">
            <UpdateField
              collection={Users}
              doc={user}
              fields={['isInRoundRobin']}
              disabled={!currentUserIsDev}
              className="round-robin-checkbox"
            />
            <UpdateField
              collection={Users}
              doc={user}
              fields={['roundRobinTimeout']}
              autosaveDelay={500}
            />
          </SingleUserPageInformationItem>
        )}
        {/* This will be used to manually set Advisors intercomId */}
        {currentUserIsDev && (
          <SingleUserPageInformationItem label="Intercom">
            <UpdateField
              collection={Users}
              doc={user}
              fields={['intercomId']}
              autoSaveDelay={500}
            />
          </SingleUserPageInformationItem>
        )}
      </SingleUserPageInformation>
    </div>
  );
};

SingleUserPageHeader.propTypes = {
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default SingleUserPageHeader;
