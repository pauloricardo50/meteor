import React from 'react';
import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';

const getRelatedDoc = ({ borrower, loan, property, user }) => {
  if (borrower) {
    const { _id, firstName, lastName } = borrower;

    return {
      link: `/borrowers/${_id}`,
      icon: 'people',
      text: getBorrowerFullName({ firstName, lastName }),
      translationId: 'borrower',
    };
  }

  if (loan) {
    const { _id, name } = loan;

    return {
      link: `/loans/${_id}`,
      icon: 'dollarSign',
      text: name,
      translationId: 'loan',
    };
  }

  if (property) {
    const { _id, address1 } = property;

    return {
      link: `/properties/${_id}`,
      icon: 'building',
      text: address1,
      translationId: 'property',
    };
  }

  if (user) {
    const { _id, username, emails } = user;

    return {
      link: `/users/${_id}`,
      icon: 'contactMail',
      text: username || emails[0].address,
      translationId: 'user',
    };
  }

  return null;
};

const RelatedDoc = ({ possibleRelatedDocs }) => {
  const { borrower, loan, property, user } = possibleRelatedDocs;
  const { link, icon, text, translationId } = getRelatedDoc({
    borrower,
    loan,
    property,
    user,
  });

  return (
    <Link to={link}>
      <Icon type={icon} />
      {text || <T id={`general.${translationId}`} />}
    </Link>
  );
};

RelatedDoc.propTypes = {
  possibleRelatedDocs: PropTypes.object.isRequired,
};

export default RelatedDoc;
