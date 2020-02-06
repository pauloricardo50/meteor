import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import AnonymousAppPageContainer from './AnonymousAppPageContainer';
import NoLoanStart from './NoLoanStart';
import WithLoanStart from './WithLoanStart';

const AnonymousAppPage = props => {
  const { anonymousLoan, insertAnonymousLoan } = props;

  return (
    <div className="anonymous-app-page">
      {!anonymousLoan && (
        <NoLoanStart insertAnonymousLoan={insertAnonymousLoan} />
      )}
      {anonymousLoan && <WithLoanStart anonymousLoan={anonymousLoan} />}
      <div className="flex-col center text-center">
        <T id="AnonymousAppPage.alreadyAccount" />
        <Button primary link to="/login">
          <T id="general.login" />
        </Button>
      </div>
    </div>
  );
};

export default AnonymousAppPageContainer(AnonymousAppPage);
