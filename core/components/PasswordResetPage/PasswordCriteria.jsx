import React from 'react';
import cx from 'classnames';

import Icon from '../Icon';
import T from '../Translation';

const criteria = [
  {
    id: 'correctLength',
    condition: ({ newPassword }) => newPassword?.length >= 8,
  },
  {
    id: 'atLeastOneLetter',
    condition: ({ newPassword }) => newPassword?.match(/[A-Za-z]+/),
  },
  {
    id: 'atLeastOneDigit',
    condition: ({ newPassword }) => newPassword?.match(/\d+/),
  },
  {
    id: 'passwordMatch',
    condition: ({ newPassword, newPassword2 }) =>
      newPassword2 && newPassword2 === newPassword,
  },
];

const PasswordCriterion = ({ isValid, label }) => (
  <div className="flex center-align mb-0">
    <Icon
      type={isValid ? 'checkCircle' : 'info'}
      className={cx('mr-4 animated fadeIn', {
        success: isValid,
        primary: !isValid,
      })}
      style={{ height: '18px' }}
    />

    <p
      className={cx('m-0', { secondary: isValid })}
      style={{ transition: 'opacity 200ms ease' }}
    >
      <small>{label}</small>
    </p>
  </div>
);

const PasswordCriteria = ({ newPassword, newPassword2 }) => (
  <div className="flex-col">
    {criteria.map(({ id, condition }) => {
      const isValid = condition({ newPassword, newPassword2 });
      const label = <T id={`PasswordResetPage.passwordCriterion.${id}`} />;

      return <PasswordCriterion isValid={isValid} label={label} key={id} />;
    })}
  </div>
);

export default PasswordCriteria;
