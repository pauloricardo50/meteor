import PropTypes from 'prop-types';
import React, { Component } from 'react';

import UploaderArray from '/imports/ui/components/general/UploaderArray';
import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles } from '/imports/js/arrays/files';
import RadioInput from '/imports/ui/components/general/AutoForm/RadioInput';
import { T } from '/imports/ui/components/general/Translation';
import { disableForms } from '/imports/js/helpers/requestFunctions';

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioDiv: {
    alignSelf: 'center',
    margin: '20px 0',
  },
};

const Files = (props) => {
  const { borrower, loanRequest } = props;
  const percent = filesPercent([borrower], borrowerFiles, 'auction');

  return (
    <section
      className="animated fadeIn"
      key={borrower._id}
      style={styles.section}
    >
      <hr />
      <h2 className="text-center">
        <T id="Files.title" />
        <br />
        <small className={percent >= 1 && 'success'}>
          <T id="general.progress" values={{ value: percent }} />{' '}
          {percent >= 1 && <span className="fa fa-check" />}
        </small>
      </h2>

      <div className="description">
        <p>
          <T id="Files.description" />
        </p>
      </div>

      <h3 className="text-center">
        <T id="Files.files1.title" />
      </h3>

      <div style={styles.radioDiv}>
        <RadioInput
          id="hasChangedSalary"
          label={<T id="Files.hasChangedSalary" />}
          options={[
            { id: true, label: <T id="general.yes" /> },
            { id: false, label: <T id="general.no" /> },
          ]}
          currentValue={borrower.hasChangedSalary}
          documentId={borrower._id}
          updateFunc="updateBorrower"
          disabled={disableForms(loanRequest)}
        />
      </div>

      <UploaderArray
        fileArray={borrowerFiles(borrower).auction}
        doc={borrower}
        collection="borrowers"
        disabled={disableForms(loanRequest)}
      />
    </section>
  );
};

Files.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Files;
