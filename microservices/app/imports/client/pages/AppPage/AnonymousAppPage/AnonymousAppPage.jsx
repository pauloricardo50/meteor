// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import AnonymousAppPageContainer from './AnonymousAppPageContainer';
import NoLoanStart from './NoLoanStart';

type AnonymousAppPageProps = {};

const AnonymousAppPage = (props: AnonymousAppPageProps) => {
  const { anonymousLoan, insertAnonymousLoan } = props;

  return (
    <div className="anonymous-app-page">
      {!anonymousLoan && (
        <NoLoanStart insertAnonymousLoan={insertAnonymousLoan} />
      )}
      {anonymousLoan && <span>Continuer!</span>}
      <div className="flex-col center">
        <T id="AnonymousAppPage.alreadyAccount" />
        <Button primary link to="/login">
          <T id="general.login" />
        </Button>
      </div>
    </div>
  );
};

export default AnonymousAppPageContainer(AnonymousAppPage);
