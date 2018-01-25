import PropTypes from 'prop-types';
import React from 'react';

import UploaderArray from 'core/components/UploaderArray';
import { borrowerFiles } from 'core/api/files/files';
import RadioInput from 'core/components/AutoForm/RadioInput';
import { T } from 'core/components/Translation';
import { disableForms } from 'core/utils/requestFunctions';

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

  return (
    <section
      className="animated fadeIn"
      key={borrower._id}
      style={styles.section}
    >
      <hr />
      <h2 className="text-center">
        <T id="Files.title" />
      </h2>

      <div className="description">
        <p>
          <T id="Files.description" />
        </p>
      </div>

      <h3 className="text-center">
        <T id="Files.files1.title" />
      </h3>

      <UploaderArray
        fileArray={borrowerFiles(borrower).auction}
        doc={borrower}
        collection="borrowers"
        disabled={disableForms({ loanRequest })}
      />
    </section>
  );
};

Files.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Files;
