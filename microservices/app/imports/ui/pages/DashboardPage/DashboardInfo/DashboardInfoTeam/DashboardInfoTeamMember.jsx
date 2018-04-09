import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import DashboardInfoTeamForm from './DashboardInfoTeamForm';

const DashboardInfoTeamMember = ({
  src,
  name,
  title,
  email,
  phone,
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
          initialValues={{ name, title, email, phone }}
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
      {phone && (
        <a href={`tel:${phone}`}>
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
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  allowEdit: PropTypes.bool,
  editContact: PropTypes.func,
  removeContact: PropTypes.func,
};

DashboardInfoTeamMember.defaultProps = {
  phone: undefined,
  allowEdit: false,
  editContact: undefined,
  removeContact: undefined,
};

export default DashboardInfoTeamMember;
