import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';
import T from 'core/components/Translation';

import DashboardInfoTeamForm from './DashboardInfoTeamForm';

const DashboardInfoTeamMember = ({
  allowEdit,
  editContact,
  email,
  name,
  phoneNumber,
  removeContact,
  renderTitle,
  src,
  title,
}) => (
  <div className="dashboard-info-team-company-member">
    {src && <img src={src} alt={name} />}

    <div className="person">
      <h4>{name}</h4>
      <p>{renderTitle}</p>
    </div>

    <div className="contact">
      {allowEdit && (
        <DashboardInfoTeamForm
          triggerComponent={handleOpen => (
            <IconButton
              onClick={handleOpen}
              type="edit"
              tooltip={<T id="general.modify" />}
            />
          )}
          onSubmit={values => editContact(name, values)}
          model={{ name, title, email, phoneNumber }}
          onDelete={() => removeContact(name)}
        />
      )}

      <a className="ml-4" href={`mailto:${email}`}>
        <IconButton
          type="mail"
          tooltip={
            <T id="DashboardInfoTeamMember.emailTooltip" values={{ email }} />
          }
        />
      </a>

      {phoneNumber && (
        <a className="ml-4" href={`tel:${phoneNumber}`}>
          <IconButton
            type="phone"
            tooltip={
              <T
                id="DashboardInfoTeamMember.phoneTooltip"
                values={{ phoneNumber }}
              />
            }
          />
        </a>
      )}
    </div>
  </div>
);

DashboardInfoTeamMember.propTypes = {
  allowEdit: PropTypes.bool,
  editContact: PropTypes.func,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string,
  removeContact: PropTypes.func,
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

DashboardInfoTeamMember.defaultProps = {
  phoneNumber: undefined,
  allowEdit: false,
  editContact: undefined,
  removeContact: undefined,
};

export default DashboardInfoTeamMember;
