import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import DashboardInfoTeamForm from './DashboardInfoTeamForm';

const DashboardInfoTeamMember = ({
  src,
  name,
  title,
  email,
  phoneNumber,
  allowEdit,
  editContact,
  removeContact,
}) => (
  <div className="dashboard-info-team-company-member">
    {src && <img src={src} alt={name} />}

    <div className="person">
      <h4>{name}</h4>
      <p>{title}</p>
    </div>

    <div className="contact">
      {allowEdit && (
        <DashboardInfoTeamForm
          button={
            <IconButton type="edit" tooltip={<T id="general.modify" />} />
          }
          onSubmit={values => editContact(name, values)}
          initialValues={{ name, title, email, phoneNumber }}
          form={name}
          renderAdditionalActions={({ handleClose }) => (
            <Button onClick={() => removeContact(name).then(handleClose)}>
              <T id="general.delete" />
            </Button>
          )}
        />
      )}

      <a href={`mailto:${email}`}>
        <IconButton
          type="mail"
          tooltip={<T id="DashboardInfoTeamMember.emailTooltip" />}
        />
      </a>

      {phoneNumber && (
        <a href={`tel:${phoneNumber}`}>
          <IconButton
            type="phone"
            tooltip={<T id="DashboardInfoTeamMember.phoneTooltip" />}
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
