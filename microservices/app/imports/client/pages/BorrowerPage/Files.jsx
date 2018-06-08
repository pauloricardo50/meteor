import PropTypes from 'prop-types';
import React from 'react';

import UploaderArray from 'core/components/UploaderArray';
import { borrowerDocuments } from 'core/api/files/documents';
import T from 'core/components/Translation';

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

const Files = ({ borrowers, loan: { userFormsEnabled } }) => (
  <section
    className="animated fadeIn borrower-page-files"
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
    <div className="borrower-files__wrapper flex--helper flex-justify--center">
      {borrowers.map(borrower => (
        <div className="borrower-files__item col--50" key={borrower._id}>
          <h3 className="text-center">
            <T id="Files.files1.title" />
          </h3>

          <UploaderArray
            documentArray={borrowerDocuments(borrower).auction}
            doc={borrower}
            collection="borrowers"
            disabled={!userFormsEnabled}
          />
        </div>
      ))}
    </div>
  </section>
);

Files.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Files;
