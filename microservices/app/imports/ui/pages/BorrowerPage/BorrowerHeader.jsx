import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';

import Progress from './Progress';

export const getLink = (tab, borrowerId, pathname) =>
  `${pathname.split('borrowers/')[0]}borrowers/${borrowerId}/${tab}`;

const BorrowerHeader = ({ borrowers, match, history }) => {
  const { tab, borrowerId } = match.params;
  const { pathname } = history.location;

  return (
    <header className="flex center">
      {borrowers.map((b, i) => (
        <div
          className={classNames({
            'flex-col center borrower': true,
            scale: b._id === borrowerId,
          })}
          key={b._id}
        >
          <Link to={getLink(tab, b._id, pathname)}>
            <span
              className={classNames({
                'fa fa-user-circle-o fa-5x': true,
                secondary: b._id !== borrowerId,
              })}
            />
          </Link>
          <h1 className="no-margin">
            {b.firstName || (
              <T id="BorrowerHeader.title" values={{ index: i + 1 }} />
            )}
          </h1>
          <h3 className="secondary no-margin">
            <Progress borrower={b} match={match} />
          </h3>
        </div>
      ))}
    </header>
  );
};

BorrowerHeader.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default BorrowerHeader;
