// @flow
import React from 'react';
import cx from 'classnames';
import { Meteor } from 'meteor/meteor';

import Calculator from 'core/utils/Calculator';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import BorrowerForm from './BorrowerForm';

type SimpleBorrowerPageFormsProps = {};

const createParams = ({ id, ...rest }, idKey) => ({ [idKey]: id, ...rest });

const overrides = {
  updateFunc: idKey => (rawParams) => {
    const { object = {}, id } = rawParams;

    if (Object.keys(object).includes('insurance2Simple')) {
      return new Promise((resolve, reject) => {
        const insurance2 = object.insurance2Simple
          ? [{ value: object.insurance2Simple }]
          : [];
        Meteor.call(
          'borrowerUpdate',
          {
            borrowerId: id,
            object: { insurance2 },
          },
          (error, result) => {
            if (error) {
              reject(error);
            }

            resolve(result);
          },
        );
      });
    }

    return new Promise((resolve, reject) => {
      const params = createParams(rawParams, idKey);

      Meteor.call('borrowerUpdate', params, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  },
};

const SimpleBorrowerPageForms = ({
  loan,
  simpleForm,
}: SimpleBorrowerPageFormsProps) => {
  const { borrowers, userFormsEnabled } = loan;
  const twoBorrowers = borrowers.length === 2;

  return (
    <div className={cx('forms', { 'two-borrowers': twoBorrowers })}>
      {borrowers.length === 1 && (
        <BorrowerForm
          borrowerId={borrowers[0]._id}
          userFormsEnabled={userFormsEnabled}
          loan={loan}
          overrides={simpleForm && overrides}
          simple={simpleForm}
        />
      )}
      {twoBorrowers && (
        <Tabs
          tabs={borrowers.map((borrower, index) => {
            const progress = Calculator.personalInfoPercentSimple({
              borrowers: borrower,
              loan,
              simple: simpleForm,
            });

            return {
              id: borrower._id,
              content: (
                <BorrowerForm
                  borrowerId={borrowers[index]._id}
                  userFormsEnabled={userFormsEnabled}
                  loan={loan}
                  key={borrowers[index]._id}
                  overrides={simpleForm && overrides}
                  simple={simpleForm}
                />
              ),
              label: (
                <span className="borrower-tab-labels">
                  {borrower.name || (
                    <T
                      id="BorrowerHeader.title"
                      values={{ index: index + 1 }}
                    />
                  )}
                  &nbsp;&bull;&nbsp;
                  <PercentWithStatus
                    value={progress}
                    status={progress < 1 ? null : undefined}
                    rounded
                  />
                </span>
              ),
            };
          })}
        />
      )}
    </div>
  );
};

export default SimpleBorrowerPageForms;
