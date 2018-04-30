import PropTypes from 'prop-types';
import React from 'react';

import UploaderArray from 'core/components/UploaderArray';
import { borrowerDocuments } from 'core/api/files/documents';
import { T } from 'core/components/Translation';
import { disableForms } from 'core/utils/loanFunctions';

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
  const { borrower, loan } = props;

  return (
    <section
      className="animated fadeIn borrower-page-files"
      key={borrower._id}
      style={styles.section}
    >
      <hr />
      <h2 className="text-center">
        <T id="Files.title" />
      </h2>

      <div className="text-center description">
        <p>
          <T id="Files.description" />
        </p>
      </div>

      <h3 className="text-center">
        <T id="Files.files1.title" />
      </h3>

      <UploaderArray
        fileArray={borrowerDocuments(borrower).auction}
        doc={borrower}
        collection="borrowers"
        disabled={disableForms({ loan })}
      />
    </section>
  );
};

Files.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Files;
