// @flow
import React from 'react';

import Calculator from 'core/utils/Calculator';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Button from 'core/components/Button';
import SimpleFormSwitch from './SimpleFormSwitch';

type BorrowersCardHeaderProps = {};

const BorrowersCardHeader = (props: BorrowersCardHeaderProps) => {
  const {
    loan,
    openBorrowersForm,
    setOpenBorrowersForm,
    simpleForm,
    setSimpleForm,
    progress,
  } = props;
  const { borrowers = [] } = loan;

  return (
    <div className="borrowers-card-header">
      <div style={{ width: '100%' }}>
        <div className="flex-row title">
          <h3>Emprunteurs</h3>
          {openBorrowersForm ? (
            !!borrowers.length && (
              <SimpleFormSwitch
                simpleForm={simpleForm}
                setSimpleForm={setSimpleForm}
              />
            )
          ) : (
            <Button
              raised={progress < 1}
              secondary={progress < 1}
              primary={progress >= 1}
              onClick={() => setOpenBorrowersForm(true)}
            >
              <T
                id={
                  progress < 1
                    ? progress === 0
                      ? 'general.start'
                      : 'general.continue'
                    : 'general.modify'
                }
              />
            </Button>
          )}
        </div>
      </div>
      <span className="secondary">
        <T
          id="BorrowersProgress.progress"
          values={{
            percent: (
              <>
                &nbsp;
                <PercentWithStatus
                  value={progress}
                  status={progress < 1 ? null : undefined}
                  rounded
                />
              </>
            ),
          }}
        />
      </span>
    </div>
  );
};

export default BorrowersCardHeader;
