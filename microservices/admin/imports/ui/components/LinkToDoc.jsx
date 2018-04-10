import React from 'react';
import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';

const isEmptyObject = obj => Object.keys(obj).length === 0;

const getRelatedDoc = ({ borrower, loan, property, user }) => {
  if (!isEmptyObject(borrower)) {
    const { _id, firstName, lastName } = borrower;

    return {
      link: `/borrowers/${_id}`,
      icon: 'people',
      text: getBorrowerFullName({ firstName, lastName }),
      translationId: 'borrower',
    };
  }

  if (!isEmptyObject(loan)) {
    const { _id, name } = loan;

    return {
      link: `/loans/${_id}`,
      icon: 'dollarSign',
      text: name,
      translationId: 'loan',
    };
  }

  if (!isEmptyObject(property)) {
    const { _id, address1 } = property;

    return {
      link: `/properties/${_id}`,
      icon: 'building',
      text: address1,
      translationId: 'property',
    };
  }

  if (!isEmptyObject(user)) {
    const { _id, username, emails } = user;

    return {
      link: `/users/${_id}`,
      icon: 'contactMail',
      text: username || emails[0].address,
      translationId: 'user',
    };
  }

  return {};
};

const LinkToDoc = ({ borrower, loan, property, user }) => {
  const { link, icon, text, translationId } = getRelatedDoc({
    borrower,
    loan,
    property,
    user,
  });

  return link && icon ? (
    <Link to={link}>
      <Icon type={icon} />
      {text || <T id={`general.${translationId}`} />}
    </Link>
  ) : null;
};

LinkToDoc.propTypes = {
  borrower: PropTypes.object,
  loan: PropTypes.object,
  property: PropTypes.object,
  user: PropTypes.object,
};

LinkToDoc.defaultProps = {
  borrower: {},
  loan: {},
  property: {},
  user: {},
};

export default LinkToDoc;
