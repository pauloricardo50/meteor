import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import SimpleSchema from 'simpl-schema';
import { AutoFormDialog } from '../core/components/AutoForm2';

const { Front } = window;

const getContactSubtitle = ({ collection, isEpotekResource, contact }) => {
  if (!isEpotekResource) {
    const { source } = contact;
    return source.charAt(0).toUpperCase() + source.slice(1);
  }

  const { roles } = contact;

  if (collection === 'contacts') {
    return 'Contact e-Potek';
  }

  switch (roles[0]) {
    case 'user':
      return 'Client(e) e-Potek';
    case 'dev':
      return 'Dev e-Potek';
    case 'admin':
      return 'Admin e-Potek';
    case 'pro':
      return 'Pro e-Potek';

    default:
      return '';
  }
};

const schema = new SimpleSchema({ name: String });

const FrontContactHeader = ({ collection, contact, isEpotekResource }) => {
  const { assignedEmployee, referredByUser, referredByOrganisation } = contact;
  return (
    <div className="mb-32">
      <div
        className="mb-16 flex center-align"
        style={{ justifyContent: 'space-between' }}
      >
        <div>
          <div
            className={cx('flex', { link: isEpotekResource })}
            onClick={() => {
              if (isEpotekResource) {
                Front.openUrl(
                  `https://admin.e-potek.ch/${collection}/${contact._id}`,
                );
              }
            }}
          >
            {isEpotekResource && (
              <img
                src="https://backend.e-potek.ch/img/logo_square_black.svg"
                style={{ width: 24, height: 24, marginRight: 8 }}
                alt="logo"
              />
            )}
            <h3 style={{ margin: 0, marginBottom: 8 }}>{contact.name}</h3>
          </div>

          <span className="secondary">
            <span>
              {getContactSubtitle({ collection, contact, isEpotekResource })}
            </span>
            {isEpotekResource && (
              <span>
                {' '}
                depuis{' '}
                {
                  moment(contact.createdAt)
                    .fromNow()
                    .split('il y a')[1]
                }
              </span>
            )}
          </span>
        </div>

        {/* <Button primary raised size="small">
          + Tâche
        </Button> */}
        <AutoFormDialog
          buttonProps={{ label: '+ Tâche', raised: true, primary: true }}
          schema={schema}
          onSubmit={console.log}
        />
      </div>

      {(!!assignedEmployee || !!referredByUser || !!referredByOrganisation) && (
        <div>
          <div className="flex fb-50 mb-8">
            {!!assignedEmployee && (
              <div className="mr-8">
                <b>Conseiller:</b>&nbsp;
                <span>{assignedEmployee.name}</span>
              </div>
            )}

            {!!referredByUser && (
              <div>
                <b>Référé par:</b>&nbsp;
                <span>{referredByUser.name}</span>
              </div>
            )}
          </div>
          <div>
            {!!referredByOrganisation && (
              <div>
                <b>Référé par Orga:</b>&nbsp;
                <span>{referredByOrganisation.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontContactHeader;
