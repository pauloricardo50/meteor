// @flow
import React from 'react';
import cx from 'classnames';

import useMedia from 'core/hooks/useMedia';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';
import SimpleBorrowerPageForms from './SimpleBorrowerPageForms';
import SimpleBorrowersPageMaxPropertyValue from './SimpleBorrowersPageMaxPropertyValue';
import SimpleBorrowersPageHeader from './SimpleBorrowersPageHeader';
import MaxPropertyValueCTA from './MaxPropertyValueCTA';

type SimpleBorrowersPageProps = {};

const maxPropertyValueHeight = 600;
const topSpaceHeight = 132;

const SimpleBorrowersPage = ({ loan }: SimpleBorrowersPageProps) => {
  const isMobile = useMedia({ maxWidth: 1200 });
  const hasEnoughHeight = useMedia({
    minHeight: maxPropertyValueHeight + topSpaceHeight,
  });

  return (
    <div className="simple-borrowers-page animated fadeIn">
      <div
        className={cx('simple-borrowers-page-container', {
          grow: hasEnoughHeight,
        })}
      >
        <div className="card1 card-top simple-borrowers-page-forms">
          <SimpleBorrowersPageHeader loan={loan} />

          <SimpleBorrowerPageForms loan={loan} />
        </div>
        <MaxPropertyValueCTA
          loan={loan}
          isMobile={isMobile}
          hasEnoughHeight={hasEnoughHeight}
        />
      </div>
      <SimpleBorrowersPageMaxPropertyValue
        loan={loan}
        isMobile={isMobile}
        hasEnoughHeight={hasEnoughHeight}
        blue
      />
    </div>
  );
};
export default withSimpleAppPage(SimpleBorrowersPage);
